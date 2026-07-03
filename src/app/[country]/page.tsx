import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import {
  seedCountries,
  seedDesigners,
  type DesignerSeed,
} from "@/lib/guide-data";

interface Props {
  params: Promise<{ country: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country: slug } = await params;
  const seed = seedCountries.find((c) => c.slug === slug);
  if (seed) return { title: seed.name, description: seed.intro };

  const { data } = await supabase
    .from("countries")
    .select("name, description")
    .eq("slug", slug)
    .limit(1);
  const row = data?.[0];
  if (!row) return { title: "Country not found" };
  return {
    title: (row as any).name,
    description: (row as any).description || "",
  };
}

export default async function CountryPage({ params }: Props) {
  const { country: slug } = await params;

  // Try seed data first
  const seed = seedCountries.find((c) => c.slug === slug);
  let designers: DesignerSeed[] = [];

  if (seed) {
    designers = seed.designerSlugs
      .map((s) => seedDesigners.find((d) => d.slug === s))
      .filter(Boolean) as DesignerSeed[];
  }

  // Also try Supabase
  let dbCountry: any = null;
  try {
    const { data: countryData } = await supabase
      .from("countries")
      .select("*")
      .eq("slug", slug)
      .limit(1);
    dbCountry = countryData?.[0] || null;

    if (dbCountry) {
      const { data: designerData } = await supabase
        .from("designers")
        .select("*, cities(name, countries(name, slug))")
        .eq("cities.countries.slug", slug);
      if (designerData) {
        for (const d of designerData) {
          if (!designers.find((x) => x.slug === d.slug)) {
            designers.push({
              slug: d.slug,
              name: d.name,
              country: (d as any).cities?.countries?.name || "",
              city: (d as any).cities?.name || "",
              discipline: "Designer",
              philosophy: d.bio || "",
              materials: "",
              priceRange: "€€",
              production: "",
              editorsNotes: "",
              whereToBuy: [],
              image: d.photo || "",
              similar: [],
            });
          }
        }
      }
    }
  } catch {
    // ignore
  }

  const country = seed || dbCountry;
  if (!country) notFound();

  const name = seed?.name || dbCountry?.name;
  const cityLabel = seed?.cityLabel || "";
  const description = seed?.description || dbCountry?.description || "";
  const image = seed?.image || dbCountry?.image || "";
  const whatToBuy = seed?.whatToBuy || [];
  const stores = seed?.stores || [];
  const events = seed?.events || [];

  return (
    <article className="pb-16">
      {/* Hero */}
      <header className="mx-auto max-w-7xl px-6 pt-14 pb-16 sm:px-10 md:pt-20">
        <Link href="/countries" className="eyebrow link-underline">
          ← All countries
        </Link>
        <div className="mt-8 grid gap-10 md:grid-cols-[1.5fr_1fr] md:gap-20">
          <div>
            <h1 className="font-serif text-6xl leading-[1.02] tracking-tight md:text-8xl">
              {name}
            </h1>
            <p className="mt-6 text-sm text-muted">{cityLabel}</p>
          </div>
          <p className="max-w-md text-[17px] leading-relaxed text-ink/85 md:pt-6">
            {description}
          </p>
        </div>
      </header>

      {image && (
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="w-full max-w-lg object-cover"
          />
        </div>
      )}

      {/* What to buy */}
      {whatToBuy.length > 0 && (
        <CountrySection title="What to buy">
          <ul className="grid gap-6 sm:grid-cols-2">
            {whatToBuy.map((item, i) => (
              <li
                key={item}
                className="flex items-baseline gap-4 border-b border-hairline-hover pb-5"
              >
                <span className="tabular-nums text-xs text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[15px]">{item}</span>
              </li>
            ))}
          </ul>
        </CountrySection>
      )}

      {/* Designers */}
      <CountrySection title="Designers">
        {designers.length === 0 ? (
          <p className="text-[15px] text-muted">
            Profiles for {name} are being written this season.
          </p>
        ) : (
          <div className="grid gap-14 sm:grid-cols-2">
            {designers.map((d) => (
              <Link
                key={d.slug}
                href={`/designer/${d.slug}`}
                className="group block"
              >
                <div className="overflow-hidden bg-hairline">
                  {d.image ? (
                    <img
                      src={d.image}
                      alt={d.name}
                      loading="lazy"
                      className="aspect-[4/5] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="aspect-[4/5] w-full flex items-center justify-center">
                      <span className="text-hairline-hover/40 text-4xl font-serif">
                        {d.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <p className="eyebrow mt-5">{d.discipline}</p>
                <h3 className="mt-2 font-serif text-2xl">{d.name}</h3>
                <p className="mt-2 text-sm text-muted">{d.city}</p>
                {d.philosophy && (
                  <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink/80">
                    {d.philosophy.split(".")[0]}.
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </CountrySection>

      {/* Concept stores */}
      {stores.length > 0 && (
        <CountrySection title="Concept stores">
          <ul className="divide-y divide-hairline-hover border-t border-hairline-hover">
            {stores.map((s) => (
              <li
                key={s.name}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-6 py-7 sm:grid-cols-[1fr_2fr_auto] sm:gap-10"
              >
                <p className="font-serif text-xl">{s.name}</p>
                <p className="text-[15px] text-muted">{s.note}</p>
                <p className="text-sm text-accent">{s.city}</p>
              </li>
            ))}
          </ul>
        </CountrySection>
      )}

      {/* Events */}
      {events.length > 0 && (
        <CountrySection title="Fashion events">
          <ul className="divide-y divide-hairline-hover border-t border-hairline-hover">
            {events.map((e) => (
              <li
                key={e.name}
                className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-6 py-7 sm:grid-cols-[8rem_1fr_auto] sm:gap-10"
              >
                <p className="tabular-nums text-sm text-muted">{e.when}</p>
                <p className="font-serif text-xl">{e.name}</p>
                <p className="text-sm text-muted">{e.where}</p>
              </li>
            ))}
          </ul>
        </CountrySection>
      )}
    </article>
  );
}

function CountrySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl border-t border-hairline-hover px-6 py-16 sm:px-10 md:py-24">
      <div className="grid gap-10 md:grid-cols-[1fr_2.4fr] md:gap-16">
        <header>
          <h2 className="font-serif text-3xl md:text-4xl">{title}</h2>
        </header>
        <div>{children}</div>
      </div>
    </section>
  );
}
