/**
 * 背景の「場」を描く最小のWebGL1ランタイム。
 * - 1パス（フルスクリーン三角形）。ループ内テクスチャ参照なし
 * - devicePixelRatio は 1.5 打ち止め、実解像度は幅1280pxまで
 * - 画面外・非表示タブでは rAF を止める
 * - reduced-motion は1フレームだけ描いて停止
 * - 非対応・コンテキストロストは onFail() を呼び、CSSグラデーションに委ねる
 */

const VERTEX_SOURCE = `attribute vec2 a_pos;
void main(){
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const MAX_DPR = 1.5;
const MAX_WIDTH = 1280;
/** 場の動きは人の呼吸より遅い。60fpsは要らない */
const MIN_FRAME_MS = 1000 / 30;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function mountField(
  canvas: HTMLCanvasElement,
  fragmentSource: string,
  onFail: () => void,
): () => void {
  let gl: WebGLRenderingContext | null = null;
  try {
    gl = (canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: "low-power",
    }) ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
  } catch {
    gl = null;
  }

  if (!gl) {
    onFail();
    return () => {};
  }

  const context = gl;
  const vertex = compile(context, context.VERTEX_SHADER, VERTEX_SOURCE);
  const fragment = compile(context, context.FRAGMENT_SHADER, fragmentSource);
  const program = vertex && fragment ? context.createProgram() : null;

  if (!vertex || !fragment || !program) {
    onFail();
    return () => {};
  }

  context.attachShader(program, vertex);
  context.attachShader(program, fragment);
  context.linkProgram(program);
  if (!context.getProgramParameter(program, context.LINK_STATUS)) {
    onFail();
    return () => {};
  }

  context.useProgram(program);

  const buffer = context.createBuffer();
  context.bindBuffer(context.ARRAY_BUFFER, buffer);
  context.bufferData(
    context.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    context.STATIC_DRAW,
  );
  const location = context.getAttribLocation(program, "a_pos");
  context.enableVertexAttribArray(location);
  context.vertexAttribPointer(location, 2, context.FLOAT, false, 0, 0);

  const uTime = context.getUniformLocation(program, "u_time");
  const uResolution = context.getUniformLocation(program, "u_resolution");

  const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let raf = 0;
  let onScreen = true;
  let width = 0;
  let height = 0;
  const started = performance.now();

  const resize = () => {
    const cssWidth = canvas.clientWidth || 1;
    const cssHeight = canvas.clientHeight || 1;
    const scale = Math.min(Math.min(window.devicePixelRatio || 1, MAX_DPR), MAX_WIDTH / cssWidth);
    const next = Math.max(1, Math.round(cssWidth * scale));
    const nextHeight = Math.max(1, Math.round(cssHeight * scale));
    if (next === width && nextHeight === height) return false;
    width = next;
    height = nextHeight;
    canvas.width = width;
    canvas.height = height;
    context.viewport(0, 0, width, height);
    return true;
  };

  const draw = () => {
    context.uniform2f(uResolution, width, height);
    context.uniform1f(uTime, ((performance.now() - started) / 1000) % 600);
    context.drawArrays(context.TRIANGLES, 0, 3);
  };

  let lastFrame = 0;

  const frame = (now: number) => {
    if (now - lastFrame >= MIN_FRAME_MS) {
      lastFrame = now;
      draw();
    }
    raf = window.requestAnimationFrame(frame);
  };

  const stop = () => {
    if (!raf) return;
    window.cancelAnimationFrame(raf);
    raf = 0;
  };

  const play = () => {
    if (raf || !onScreen || document.hidden || reduceQuery.matches) return;
    raf = window.requestAnimationFrame(frame);
  };

  const onVisibility = () => (document.hidden ? stop() : play());
  const onLost = (event: Event) => {
    event.preventDefault();
    stop();
    onFail();
  };

  const observer = new IntersectionObserver(
    (entries) => {
      onScreen = entries.some((entry) => entry.isIntersecting);
      if (onScreen) play();
      else stop();
    },
    { threshold: 0 },
  );

  const resizeObserver = new ResizeObserver(() => {
    if (resize()) draw();
  });

  resize();
  draw(); // reduced-motion でも1フレームは描く（空白にしない）
  observer.observe(canvas);
  resizeObserver.observe(canvas);
  document.addEventListener("visibilitychange", onVisibility);
  canvas.addEventListener("webglcontextlost", onLost);
  play();

  return () => {
    stop();
    observer.disconnect();
    resizeObserver.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    canvas.removeEventListener("webglcontextlost", onLost);
    context.deleteBuffer(buffer);
    context.deleteProgram(program);
    context.deleteShader(vertex);
    context.deleteShader(fragment);
    context.getExtension("WEBGL_lose_context")?.loseContext();
  };
}
