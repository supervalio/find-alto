import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface Country {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
}

interface Designer {
  id: number;
  name: string;
  slug: string;
  photo: string | null;
  bio: string | null;
  featured: boolean;
  created_at: string;
  city_id: number;
  cities?: {
    name: string;
    slug: string;
    countries?: { name: string; slug: string };
  } | null;
}

export default async function HomePage() {
  let allCountries: Country[] = [];
  let featuredDesigners: Designer[] = [];
  let recentDesigners: Designer[] = [];
  let dbError: string | null = null;

  try {
    const [countriesRes, featuredRes, recentRes] = await Promise.all([
      supabase.from("countries").select("*").order("name"),
      supabase
        .from("designers")
        .select("*, cities(name, slug, countries(name, slug))")
        .eq("featured", true)
        .order("name")
        .limit(3),
      supabase
        .from("designers")
        .select("*, cities(name, slug, countries(name, slug))")
        .order("created_at", { ascending: false })
        .limit(3),
    ]);

    if (countriesRes.error) throw countriesRes.error;
    if (featuredRes.error) throw featuredRes.error;
    if (recentRes.error) throw recentRes.error;

    allCountries = countriesRes.data || [];
    featuredDesigners = featuredRes.data || [];
    recentDesigners = recentRes.data || [];
  } catch (err: any) {
    dbError = err?.message || "Unknown database error";
  }

  if (dbError) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <img
          src="/logo.svg"
          alt="Find Alto"
          className="h-20 w-auto mx-auto mb-6"
        />
        <p className="text-xs tracking-[3px] uppercase text-warm-grey/50 mb-10">
          discover local fashion
        </p>
        <div className="p-6 bg-red-50/50 border border-red-100 rounded-sm text-left max-w-lg mx-auto">
          <p className="text-red-700 text-xs font-medium mb-1 uppercase tracking-wider">
            Database Error
          </p>
          <p className="text-red-600/70 text-sm font-mono break-all">
            {dbError}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ── Logo + tagline ─────────────────────────────── */}
      <section className="pt-20 pb-8 md:pt-28 md:pb-10 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <img
            src="/logo.svg"
            alt="Find Alto"
            className="h-20 md:h-24 w-auto mx-auto mb-6"
          />
          <p className="text-[10px] md:text-xs tracking-[3px] uppercase text-warm-grey/50 mb-8">
            discover local fashion
          </p>
          <div className="w-8 h-px bg-sand mx-auto mb-6" />
          <p className="text-warm-grey/70 text-sm md:text-base max-w-md mx-auto leading-relaxed">
            Editorial guide to independent designers around the world
          </p>
        </div>
      </section>

      {/* ── Choose your destination ────────────────────── */}
      <section className="pb-16 md:pb-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-xs tracking-[4px] uppercase text-warm-grey/50 mb-10 text-center">
            Choose your destination
          </h2>

          {allCountries.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-warm-grey/50 text-sm">
                Destinations coming soon
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {allCountries.map((country) => (
                <Link
                  key={country.id}
                  href={`/${country.slug}`}
                  className="group block"
                >
                  <div className="aspect-[4/5] bg-sand overflow-hidden mb-4">
                    {country.image ? (
                      <img
                        src={country.image}
                        alt={country.name}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-sand-hover/50 text-6xl font-serif">
                          {country.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl font-semibold mb-1 group-hover:text-terracotta transition-colors">
                    {country.name}
                  </h3>
                  {country.description && (
                    <p className="text-warm-grey/70 text-sm leading-relaxed line-clamp-2 max-w-xs">
                      {country.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Editor's Picks ─────────────────────────────── */}
      {featuredDesigners.length > 0 && (
        <section className="pb-16 md:pb-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="border-t border-sand pt-14 mb-10">
              <h2 className="text-xs tracking-[4px] uppercase text-warm-grey/50 mb-2 text-center">
                Editor's Picks
              </h2>
              <p className="text-warm-grey/40 text-xs text-center max-w-sm mx-auto leading-relaxed">
                Designers our editors believe deserve your attention
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredDesigners.map((d) => {
                const city = (d as any).cities;
                const country = city?.countries;
                return (
                  <Link
                    key={d.id}
                    href={`/designer/${d.slug}`}
                    className="group block"
                  >
                    <div className="aspect-[3/4] bg-sand overflow-hidden mb-4">
                      {d.photo ? (
                        <img
                          src={d.photo}
                          alt={d.name}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-sand-hover/40 text-4xl font-serif">
                            {d.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-serif text-lg font-semibold mb-1 group-hover:text-terracotta transition-colors">
                      {d.name}
                    </h3>
                    {(city || country) && (
                      <p className="text-warm-grey/50 text-xs tracking-wide uppercase mb-2">
                        {[city?.name, country?.name].filter(Boolean).join(", ")}
                      </p>
                    )}
                    {d.bio && (
                      <p className="text-warm-grey/70 text-sm leading-relaxed line-clamp-2">
                        {d.bio}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Recently Added ─────────────────────────────── */}
      {recentDesigners.length > 0 && (
        <section className="pb-20 md:pb-28">
          <div className="mx-auto max-w-5xl px-6">
            <div className="border-t border-sand pt-14 mb-10">
              <h2 className="text-xs tracking-[4px] uppercase text-warm-grey/50 mb-2 text-center">
                Recently Added
              </h2>
              <p className="text-warm-grey/40 text-xs text-center max-w-sm mx-auto leading-relaxed">
                New designers joining the guide
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {recentDesigners.map((d) => {
                const city = (d as any).cities;
                const country = city?.countries;
                return (
                  <Link
                    key={d.id}
                    href={`/designer/${d.slug}`}
                    className="group flex gap-4 p-4 hover:bg-warm-white transition-colors duration-300"
                  >
                    <div className="w-16 h-16 bg-sand shrink-0 overflow-hidden flex-shrink-0">
                      {d.photo ? (
                        <img
                          src={d.photo}
                          alt={d.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-sand-hover/40 text-lg font-serif">
                            {d.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-serif text-base font-semibold mb-0.5 group-hover:text-terracotta transition-colors">
                        {d.name}
                      </h3>
                      {(city || country) && (
                        <p className="text-warm-grey/50 text-[11px] tracking-wide uppercase mb-1">
                          {[city?.name, country?.name]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      )}
                      {d.bio && (
                        <p className="text-warm-grey/60 text-xs leading-relaxed line-clamp-1">
                          {d.bio}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
