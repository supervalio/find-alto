import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Discover local fashion. Country by country, designer by designer. Independent, no ads, written by humans.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-16 pb-24 sm:px-10 md:pt-28">
      <p className="eyebrow">About</p>
      <h1 className="mt-6 font-serif text-5xl leading-[1.05] tracking-tight md:text-6xl">
        Discover local fashion.
      </h1>
      <p className="mt-8 text-lg leading-relaxed text-muted max-w-xl">
        Country by country, designer by designer.
      </p>

      <div className="mt-20 flex flex-wrap gap-6 text-sm text-muted/60">
        <span className="flex items-center gap-2">
          <span className="block h-1 w-1 rounded-full bg-accent" />
          Independent
        </span>
        <span className="flex items-center gap-2">
          <span className="block h-1 w-1 rounded-full bg-accent" />
          No ads
        </span>
        <span className="flex items-center gap-2">
          <span className="block h-1 w-1 rounded-full bg-accent" />
          Written by humans
        </span>
      </div>
    </div>
  );
}
