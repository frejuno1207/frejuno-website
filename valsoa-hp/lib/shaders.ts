/** 方向A: 上昇気流。2オクターブのvalue noiseをドメインワープし、uv.y方向へゆっくり流す。 */
export const UPDRAFT_FRAGMENT = `precision mediump float;
uniform highp float u_time;
uniform highp vec2 u_resolution;

float hash(vec2 p){
  p = fract(p * vec2(127.31, 311.7));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float vnoise(vec2 p){
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm2(vec2 p){
  return vnoise(p) * 0.65 + vnoise(p * 2.03 + 11.7) * 0.35;
}

void main(){
  highp vec2 st = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = vec2(st.x * aspect, st.y) * 1.35;
  float t = u_time * 0.035;
  vec2 warp = vec2(
    fbm2(p + vec2(0.0, -t)),
    fbm2(p + vec2(5.2, -t * 0.82) + 1.3)
  );
  float f = fbm2(p + warp * 0.9 + vec2(0.0, -t * 1.15));
  float breathe = 0.86 + 0.14 * sin(u_time * 0.5236);
  float l = (f - 0.5) * 0.10 * breathe;
  vec3 col = vec3(0.949, 0.953, 0.961) * (1.0 + l);
  col += vec3(-0.004, -0.001, 0.004) * (1.0 - f);
  float peak = smoothstep(0.76, 1.0, f);
  col = mix(col, vec3(0.690, 0.522, 0.212), peak * 0.08);
  col += (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  gl_FragColor = vec4(col, 1.0);
}`;

/** 方向B: 鋼面。ヘアライン＋45度の反射帯を14秒で1回通し、6秒休む。 */
export const STEEL_FRAGMENT = `precision mediump float;
uniform highp float u_time;
uniform highp vec2 u_resolution;

float hash1(float x){
  return fract(sin(x * 91.3458) * 47453.5453);
}

void main(){
  highp vec2 st = gl_FragCoord.xy / u_resolution;
  vec3 base = mix(vec3(0.102, 0.125, 0.149), vec3(0.165, 0.200, 0.231), st.y);

  float x = gl_FragCoord.x;
  float hair = hash1(floor(x)) * 0.6 + hash1(floor(x * 0.75) + 37.0) * 0.4;
  base *= 1.0 + (hair - 0.5) * 0.06;

  float tt = mod(u_time, 20.0);
  float prog = clamp(tt / 14.0, 0.0, 1.0);
  float d = (st.x + st.y) * 0.5;
  float center = mix(-0.35, 1.35, prog);
  float q = (d - center) / 0.075;
  float band = exp(-q * q);
  vec3 col = base * (1.0 + band * 0.10);

  float c = (d - center) / 0.014;
  float core = exp(-c * c);
  col = mix(col, vec3(0.690, 0.522, 0.212), core * 0.06);

  col += (hash1(x + gl_FragCoord.y * 3.1) - 0.5) / 255.0;
  gl_FragColor = vec4(col, 1.0);
}`;
