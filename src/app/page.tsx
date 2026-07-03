import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { seedCountries } from "@/lib/guide-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let allCountries = seedCountries;
  let dbError: string | null = null;

  try {
    const { data, error } = await supabase
      .from("countries")
      .select("*")
      .order("name");
    if (!error && data && data.length > 0) {
      // Merge DB countries with seed: seed provides images and extra fields
      const dbSlugs = new Set(data.map((c: any) => c.slug));
      const dbCountries = data.map((c: any) => {
        const seed = seedCountries.find((s) => s.slug === c.slug);
        return {
          slug: c.slug,
          name: c.name,
          cityLabel: seed?.cityLabel || "",
          designerCount: seed?.designerCount || 0,
          intro: seed?.intro || c.description?.slice(0, 60) || "",
          description: c.description || "",
          image: seed?.image || c.image || "",
          whatToBuy: seed?.whatToBuy || [],
          designerSlugs: seed?.designerSlugs || [],
          stores: seed?.stores || [],
          events: seed?.events || [],
        };
      });
      // Add seed countries not in DB
      const missing = seedCountries.filter((s) => !dbSlugs.has(s.slug));
      allCountries = [...dbCountries, ...missing];
    }
  } catch (err: any) {
    dbError = err?.message || "Unknown database error";
  }

  return (
    <div className="mx-auto max-w-7xl px-6 sm:px-10">
      {/* Opener */}
      <section className="pt-16 pb-24 md:pt-28 md:pb-32">
        <img
          src="/find-alto_first page.png"
          alt="Find Alto"
          className="w-full max-w-3xl mx-auto mb-12 md:mb-16"
        />
        <div className="max-w-2xl">
          <h1 className="font-serif text-5xl leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            Discover local fashion.
          </h1>
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-muted">
            Find Alto is an editorial guide to independent designers, workshops
            and concept stores — country by country, quietly.
          </p>
          <div className="mt-10 flex items-center gap-8 text-sm">
            <Link href="/countries" className="link-underline text-accent">
              Choose a destination →
            </Link>
            <Link href="/about" className="link-underline text-ink/70">
              About the guide
            </Link>
          </div>
        </div>
      </section>

      {dbError && (
        <div className="mb-16 p-6 bg-red-50/50 border border-red-100 text-left max-w-lg mx-auto">
          <p className="text-red-700 text-xs font-medium mb-1 uppercase tracking-wider">
            Database connection note
          </p>
          <p className="text-red-600/70 text-sm font-mono break-all">
            {dbError}
          </p>
        </div>
      )}

      {/* ── Choose your destination ───────────────────── */}
      <Section title="Choose your destination">
        <ul className="divide-y divide-hairline-hover border-t border-hairline-hover">
          {allCountries.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/${c.slug}`}
                className="group flex items-center gap-5 py-6 hover:bg-surface transition-colors duration-300 px-4 -mx-4"
              >
                {c.image ? (
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    className="h-14 w-14 object-cover shrink-0"
                  />
                ) : (
                  <div className="h-14 w-14 bg-hairline shrink-0 flex items-center justify-center">
                    <span className="text-hairline-hover/40 text-xl font-serif">
                      {c.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-xl group-hover:text-accent transition-colors">
                    {c.name}
                  </h3>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Concept stores ─────────────────────────────── */}
      <Section
        title="Concept stores"
        note="A short selection of spaces worth the detour."
      >
        <ul className="divide-y divide-hairline-hover border-t border-hairline-hover">
          {allCountries.flatMap((c) =>
            c.stores.slice(0, 1).map((s) => (
              <li
                key={s.name}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-6 py-7 sm:grid-cols-[1fr_2fr_auto] sm:gap-10"
              >
                <p className="font-serif text-xl">{s.name}</p>
                <p className="text-[15px] text-muted">{s.note}</p>
                <p className="text-sm text-accent">{s.city}</p>
              </li>
            )),
          )}
        </ul>
      </Section>

      {/* ── Fashion events ─────────────────────────────── */}
      <Section title="Fashion events">
        <ul className="divide-y divide-hairline-hover border-t border-hairline-hover">
          {allCountries.flatMap((c) =>
            c.events.map((e) => (
              <li
                key={e.name}
                className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-6 py-7 sm:grid-cols-[10rem_1fr_auto] sm:gap-10"
              >
                <p className="tabular-nums text-sm text-muted">{e.when}</p>
                <div className="min-w-0">
                  <p className="font-serif text-xl">{e.name}</p>
                  <p className="mt-1 text-sm text-muted truncate">{e.where}</p>
                </div>
                <p className="hidden text-sm text-accent sm:block">{c.name}</p>
              </li>
            )),
          )}
        </ul>
      </Section>
    </div>
  );
}

/* ── Section wrapper ─────────────────────────────────── */
function Section({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-hairline-hover py-20 md:py-28">
      <div className="grid gap-10 md:grid-cols-[1fr_2.2fr] md:gap-16">
        <header>
          <h2 className="font-serif text-3xl leading-tight md:text-4xl">
            {title}
          </h2>
          {note ? <p className="mt-4 text-sm text-muted">{note}</p> : null}
        </header>
        <div>{children}</div>
      </div>
    </section>
  );
}
