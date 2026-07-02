import Link from "next/link";
import type { Metadata } from "next";
import { seedCountries } from "@/lib/guide-data";

export const metadata: Metadata = {
  title: "Countries",
  description:
    "Browse independent fashion designers by country — a growing atlas of workshops, showrooms and concept stores.",
};

export default function CountriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 sm:px-10">
      <header className="grid gap-8 pt-16 pb-16 md:grid-cols-[1.5fr_1fr] md:gap-20 md:pt-24 md:pb-20">
        <div>
          <p className="eyebrow">The atlas</p>
          <h1 className="mt-4 font-serif text-5xl leading-[1.05] tracking-tight md:text-6xl">
            Countries.
          </h1>
        </div>
        <p className="max-w-md text-[15px] leading-relaxed text-muted md:pt-6">
          A slow-growing atlas. We add one country at a time — only after spending
          enough hours on the ground to write about it honestly.
        </p>
      </header>

      <ul className="divide-y divide-hairline-hover border-y border-hairline-hover">
        {seedCountries.map((c, i) => (
          <li key={c.slug}>
            <Link
              href={`/${c.slug}`}
              className="group grid grid-cols-[auto_minmax(0,1fr)] items-center gap-6 py-8 sm:grid-cols-[3rem_10rem_1fr_auto] sm:gap-10"
            >
              <span className="tabular-nums text-sm text-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl">{c.name}</h2>
              <p className="hidden text-[15px] leading-relaxed text-muted sm:block">
                {c.intro} <span className="text-ink/60">— {c.cityLabel}</span>
              </p>
              <span className="text-sm text-accent link-underline">
                {c.designerCount} designers →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
