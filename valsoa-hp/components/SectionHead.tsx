import Reveal from "@/components/Reveal";

type Props = {
  /** 01〜06。装飾なので読み上げない */
  index: string;
  id: string;
  title: string;
  lead?: string;
  size?: "default" | "large";
  /** 動かさない（方向Cの05） */
  still?: boolean;
};

export default function SectionHead({ index, id, title, lead, size = "default", still }: Props) {
  const large = size === "large";
  return (
    <>
      <Reveal
        still={still}
        className="relative border-t border-line pt-3"
        distance={large ? 48 : 32}
        duration={large ? 800 : 640}
      >
        <span className="signal-tick absolute -top-px left-0 block h-px w-3" aria-hidden="true" />
        <p className="mono text-s0 text-steel" aria-hidden="true">
          {index}
        </p>
        <h2 id={id} className={large ? "mt-2 text-s5 md:text-s6" : "mt-2 text-s4 md:text-s5"}>
          {title}
        </h2>
      </Reveal>
      {lead ? (
        <Reveal
          as="p"
          still={still}
          delay={160}
          distance={32}
          className="mt-2 max-w-84 text-s1 text-steel"
        >
          {lead}
        </Reveal>
      ) : null}
    </>
  );
}
