import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Find Alto is an independent, editorial guide to local fashion designers around the world. No advertising, no affiliate links, no rush.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-16 pb-24 sm:px-10 md:pt-28">
      <p className="eyebrow">The guide</p>
      <h1 className="mt-6 font-serif text-5xl leading-[1.05] tracking-tight md:text-6xl">
        A quiet atlas of independent fashion.
      </h1>

      <div className="mt-14 space-y-8 text-[17px] leading-relaxed text-ink/85">
        <p>
          Find Alto exists for the traveller who would rather spend an hour in a
          small workshop than in a department store. We write about independent
          designers — the ones who cut patterns themselves, work in short runs,
          and answer their own emails.
        </p>
        <p>
          We are not a shop and not a magazine. We take no advertising, no
          affiliate commissions, no press samples. We publish only after
          visiting in person, and we return often enough to know what has
          changed.
        </p>
        <p>
          The guide grows slowly. One country enters at a time, and stays only
          as long as it remains true.
        </p>
      </div>

      <div className="mt-20 grid gap-10 border-t border-hairline-hover pt-10 sm:grid-cols-3">
        <Fact label="Founded" value="Lisbon, 2024" />
        <Fact label="Written by" value="A team of four" />
        <Fact label="Funded by" value="Readers" />
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <p className="mt-3 font-serif text-xl">{value}</p>
    </div>
  );
}
