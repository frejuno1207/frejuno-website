/** 直線だけで作図する。曲線は使わない。 */

export function line(x1: number, y1: number, x2: number, y2: number): string {
  return `M ${x1} ${y1} L ${x2} ${y2}`;
}

export function rect(x: number, y: number, w: number, h: number): string {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`;
}

/** 矢印は開き30度・線長8px */
const ARROW = 8;
const HALF = 2.14; // 8 * tan(15deg)

export function arrow(x: number, y: number, dir: "left" | "right" | "up" | "down"): string {
  if (dir === "right") {
    return `${line(x, y, x - ARROW, y - HALF)} ${line(x, y, x - ARROW, y + HALF)}`;
  }
  if (dir === "left") {
    return `${line(x, y, x + ARROW, y - HALF)} ${line(x, y, x + ARROW, y + HALF)}`;
  }
  if (dir === "down") {
    return `${line(x, y, x - HALF, y - ARROW)} ${line(x, y, x + HALF, y - ARROW)}`;
  }
  return `${line(x, y, x - HALF, y + ARROW)} ${line(x, y, x + HALF, y + ARROW)}`;
}

export function cross(cx: number, cy: number, r: number): string {
  return `${line(cx - r, cy, cx + r, cy)} ${line(cx, cy - r, cx, cy + r)}`;
}

/** M / L / Z だけを解釈して全長を返す（stroke-dasharrayの実寸に使う） */
export function pathLength(d: string): number {
  const tokens = d.trim().split(/[\s,]+/);
  let total = 0;
  let cx = 0;
  let cy = 0;
  let sx = 0;
  let sy = 0;
  let i = 0;

  while (i < tokens.length) {
    const command = tokens[i++];
    if (command === "M") {
      cx = Number(tokens[i++]);
      cy = Number(tokens[i++]);
      sx = cx;
      sy = cy;
    } else if (command === "L") {
      const x = Number(tokens[i++]);
      const y = Number(tokens[i++]);
      total += Math.hypot(x - cx, y - cy);
      cx = x;
      cy = y;
    } else if (command === "Z" || command === "z") {
      total += Math.hypot(sx - cx, sy - cy);
      cx = sx;
      cy = sy;
    }
  }

  return Math.ceil(total);
}
