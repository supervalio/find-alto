"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { type DesignerSeed, type CountrySeed } from "@/lib/guide-data";

const categories = ["All", "Clothing", "Shoes", "Bags", "Accessories"];

export default function SearchClient({
  designers,
  countries,
}: {
  designers: DesignerSeed[];
  countries: CountrySeed[];
}) {
  const [q, setQ] = useState("");
  const [country, setCountry] = useState("All");
  const [category, setCategory] = useState("All");

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    return designers.filter((d) => {
      if (country !== "All" && d.country !== country) return false;
      if (category !== "All") {
        const map: Record<string, string[]> = {
          Clothing: ["Menswear", "Womenswear"],
          Shoes: ["Shoes"],
          Bags: ["Leather"],
          Accessories: ["Textiles", "Accessories", "Craft", "Silk"],
        };
        const keys = map[category] || [];
        if (!keys.some((k) => d.discipline.toLowerCase().includes(k.toLowerCase()))) return false;
      }
      if (!term) return true;
      return (
        d.name.toLowerCase().includes(term) ||
        d.city.toLowerCase().includes(term) ||
        d.country.toLowerCase().includes(term) ||
        d.discipline.toLowerCase().includes(term)
      );
    });
  }, [q, country, category, designers]);

  return (
    <div className="mx-auto max-w-5xl px-6 pt-16 pb-24 sm:px-10 md:pt-24">
      <p className="eyebrow">Look for</p>
      <h1 className="mt-4 font-serif text-5xl leading-[1.05] tracking-tight md:text-6xl">
        Search the guide.
      </h1>

      <div className="mt-12 border-y border-hairline-hover py-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Designer, city, or material…"
          className="w-full bg-transparent font-serif text-3xl outline-none placeholder:text-muted/60 md:text-4xl"
          autoFocus
        />
      </div>

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        <Filter
          label="Country"
          value={country}
          onChange={setCountry}
          options={["All", ...countries.map((c) => c.name)]}
        />
        <Filter label="Category" value={category} onChange={setCategory} options={categories} />
      </div>

      <div className="mt-16 flex items-baseline justify-between border-b border-hairline-hover pb-3">
        <p className="eyebrow">Results</p>
        <p className="text-sm tabular-nums text-muted">{results.length}</p>
      </div>

      <ul className="divide-y divide-hairline-hover">
        {results.map((d) => (
          <li key={d.slug}>
            <Link
              href={`/designer/${d.slug}`}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-6 py-6 sm:grid-cols-[2fr_2fr_1fr_auto]"
            >
              <p className="font-serif text-2xl">{d.name}</p>
              <p className="hidden text-sm text-muted sm:block">{d.discipline}</p>
              <p className="hidden text-sm text-muted sm:block">
                {d.city}, {d.country}
              </p>
              <span className="text-sm text-accent link-underline">Read →</span>
            </Link>
          </li>
        ))}
        {results.length === 0 && (
          <li className="py-10 text-center text-[15px] text-muted">
            Nothing yet — try a broader term.
          </li>
        )}
      </ul>
    </div>
  );
}

function Filter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
        {options.map((o) => {
          const active = o === value;
          return (
            <button
              key={o}
              onClick={() => onChange(o)}
              className={
                "text-sm transition-colors " +
                (active ? "text-accent link-underline" : "text-muted hover:text-ink")
              }
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}
