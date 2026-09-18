import type { CSSProperties, ElementType, ReactNode } from "react";

type Props = {
  as?: ElementType;
  /** 連鎖の待ち時間（160〜220msずつ） */
  delay?: number;
  /** 移動距離（FVより下は32〜56px） */
  distance?: number;
  /** 600〜800ms */
  duration?: number;
  /** 動かさない（方向Cの05など）。素の要素として出す */
  still?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/** 下から上へ一度だけ着地する。初期状態は可視（CSS側でJS有効時のみ不可視にする）。 */
export default function Reveal({
  as: Tag = "div",
  delay = 0,
  distance = 40,
  duration = 640,
  still = false,
  className,
  style,
  children,
}: Props) {
  if (still) {
    return (
      <Tag className={className} style={style}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      data-reveal=""
      className={className}
      style={
        {
          "--reveal-delay": `${delay}ms`,
          "--reveal-distance": `${distance}px`,
          "--reveal-duration": `${duration}ms`,
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
