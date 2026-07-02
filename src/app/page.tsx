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
      allCountries = data.map((c: any) => ({
        slug: c.slug,
        name: c.name,
        cityLabel: "",
        designerCount: 0,
        intro: c.description?.slice(0, 60) || "",
        description: c.description || "",
        image: c.image || "",
        whatToBuy: [] as string[],
        designerSlugs: [] as string[],
        stores: [] as { name: string; city: string; note: string }[],
        events: [] as { name: string; when: string; where: string }[],
      }));
    }
  } catch (err: any) {
    dbError = err?.message || "Unknown database error";
  }

  return (
    <div className="mx-auto max-w-7xl px-6 sm:px-10">
      {/* ── Opener ────────────────────────────────────── */}
      <section className="grid gap-10 pt-16 pb-24 md:grid-cols-[1.4fr_1fr] md:gap-20 md:pt-28 md:pb-32">
        <div className="max-w-2xl">
          <p className="eyebrow">Volume 01 — Winter Edition</p>
          <h1 className="mt-6 font-serif text-5xl leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            Discover local fashion.
          </h1>
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-warm-grey">
            Find Alto is an editorial guide to independent designers, workshops
            and concept stores — country by country, quietly.
          </p>
          <div className="mt-10 flex items-center gap-8 text-sm">
            <Link href="/countries" className="link-underline text-emerald">
              Choose a destination →
            </Link>
            <Link href="/about" className="link-underline text-charcoal/70">
              About the guide
            </Link>
          </div>
        </div>
        <aside className="border-l border-sand-hover pl-8 text-sm text-warm-grey md:pt-2">
          <p className="eyebrow">In this edition</p>
          <ul className="mt-6 space-y-4 text-charcoal">
            <li className="flex items-baseline justify-between gap-4 border-b border-sand-hover pb-3">
              <span>Countries</span>
              <span className="tabular-nums text-warm-grey">
                {allCountries.length}
              </span>
            </li>
            <li className="flex items-baseline justify-between gap-4 border-b border-sand-hover pb-3">
              <span>Designers</span>
              <span className="tabular-nums text-warm-grey">—</span>
            </li>
            <li className="flex items-baseline justify-between gap-4 border-b border-sand-hover pb-3">
              <span>Concept stores</span>
              <span className="tabular-nums text-warm-grey">—</span>
            </li>
            <li className="flex items-baseline justify-between gap-4">
              <span>Upcoming events</span>
              <span className="tabular-nums text-warm-grey">—</span>
            </li>
          </ul>
        </aside>
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
      <Section eyebrow="Chapter One" title="Choose your destination">
        <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {allCountries.map((c) => (
            <Link key={c.slug} href={`/${c.slug}`} className="group block">
              <div className="overflow-hidden bg-sand">
                {c.image ? (
                  <img
                    src={c.image}
                    alt={`${c.name} — ${c.intro}`}
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="aspect-[4/5] w-full flex items-center justify-center">
                    <span className="text-sand-hover/40 text-6xl font-serif">
                      {c.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <h3 className="font-serif text-2xl">{c.name}</h3>
                {c.designerCount > 0 && (
                  <span className="text-xs tabular-nums text-warm-grey">
                    {c.designerCount} designers
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-warm-grey">{c.cityLabel}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-charcoal/80">
                {c.intro}
              </p>
            </Link>
          ))}
        </div>
      </Section>

      {/* ── Concept stores ─────────────────────────────── */}
      <Section
        eyebrow="Chapter Two"
        title="Concept stores"
        note="A short selection of spaces worth the detour."
      >
        <ul className="divide-y divide-sand-hover border-t border-sand-hover">
          {allCountries.flatMap((c) =>
            c.stores.slice(0, 1).map((s) => (
              <li
                key={s.name}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-6 py-7 sm:grid-cols-[1fr_2fr_auto] sm:gap-10"
              >
                <p className="font-serif text-xl">{s.name}</p>
                <p className="text-[15px] text-warm-grey">{s.note}</p>
                <p className="text-sm text-terracotta">{s.city}</p>
              </li>
            )),
          )}
        </ul>
      </Section>

      {/* ── Fashion events ─────────────────────────────── */}
      <Section eyebrow="Chapter Three" title="Fashion events">
        <ul className="divide-y divide-sand-hover border-t border-sand-hover">
          {allCountries.flatMap((c) =>
            c.events.map((e) => (
              <li
                key={e.name}
                className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-6 py-7 sm:grid-cols-[10rem_1fr_auto] sm:gap-10"
              >
                <p className="tabular-nums text-sm text-warm-grey">{e.when}</p>
                <div className="min-w-0">
                  <p className="font-serif text-xl">{e.name}</p>
                  <p className="mt-1 text-sm text-warm-grey truncate">
                    {e.where}
                  </p>
                </div>
                <p className="hidden text-sm text-terracotta sm:block">
                  {c.name}
                </p>
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
  eyebrow,
  title,
  note,
  children,
}: {
  eyebrow: string;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-sand-hover py-20 md:py-28">
      <div className="grid gap-10 md:grid-cols-[1fr_2.2fr] md:gap-16">
        <header>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-4 font-serif text-3xl leading-tight md:text-4xl">
            {title}
          </h2>
          {note ? <p className="mt-4 text-sm text-warm-grey">{note}</p> : null}
        </header>
        <div>{children}</div>
      </div>
    </section>
  );
}
