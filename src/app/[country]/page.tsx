import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";

interface Props {
  params: Promise<{ country: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country: slug } = await params;
  const { data } = await supabase
    .from("countries")
    .select("*")
    .eq("slug", slug)
    .limit(1);
  const [country] = data || [];

  if (!country) return { title: "Страна не найдена" };

  return {
    title: country.name,
    description:
      country.description || `Локальные дизайнеры из ${country.name}`,
  };
}

export default async function CountryPage({ params }: Props) {
  const { country: slug } = await params;

  const { data: countryData, error: countryError } = await supabase
    .from("countries")
    .select("*")
    .eq("slug", slug)
    .limit(1);
  if (countryError) throw countryError;
  const [country] = countryData || [];

  if (!country) notFound();

  const { data: allCities, error: citiesError } = await supabase
    .from("cities")
    .select("*")
    .eq("country_id", country.id);
  if (citiesError) throw citiesError;

  const { data: cityIdsData, error: cityIdsError } = await supabase
    .from("cities")
    .select("id")
    .eq("country_id", country.id);
  if (cityIdsError) throw cityIdsError;
  const cityIds = (cityIdsData || []).map((c: { id: number }) => c.id);

  let allDesigners: any[] = [];
  if (cityIds.length > 0) {
    const { data: designersData, error: designersError } = await supabase
      .from("designers")
      .select("*, cities(*)")
      .in("city_id", cityIds);
    if (designersError) throw designersError;
    allDesigners = designersData || [];
  }

  const { data: countryAds, error: adsError } = await supabase
    .from("ads")
    .select("*")
    .eq("country_id", country.id);
  if (adsError) throw adsError;

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
      {/* ── Breadcrumb ─────────────────────────────────── */}
      <nav className="text-xs tracking-wider text-warm-grey/50 mb-12">
        <Link href="/" className="hover:text-terracotta transition-colors">
          Home
        </Link>
        <span className="mx-2 text-sand-hover">/</span>
        <span className="text-charcoal/70">{country.name}</span>
      </nav>

      {/* ── Country header ─────────────────────────────── */}
      <header className="mb-20">
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-6">
          {country.name}
        </h1>
        {country.image && (
          <div className="w-full aspect-[21/9] bg-sand overflow-hidden mb-8">
            <img
              src={country.image}
              alt={country.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {country.description && (
          <p className="text-warm-grey/70 text-lg md:text-xl max-w-2xl leading-relaxed">
            {country.description}
          </p>
        )}
      </header>

      {/* ── Cities ─────────────────────────────────────── */}
      {(allCities || []).length > 0 && (
        <section className="mb-20">
          <h2 className="text-xs tracking-[4px] uppercase text-warm-grey/50 mb-10">
            Cities
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(allCities || []).map((city: any) => (
              <Link
                key={city.id}
                href={`/${country.slug}/${city.slug}`}
                className="group block p-6 hover:bg-warm-white transition-colors duration-300"
              >
                <h3 className="font-serif text-xl font-semibold mb-2 group-hover:text-terracotta transition-colors">
                  {city.name}
                </h3>
                {city.description && (
                  <p className="text-warm-grey/70 text-sm leading-relaxed">
                    {city.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Designers ──────────────────────────────────── */}
      {allDesigners.length > 0 && (
        <section className="mb-20">
          <h2 className="text-xs tracking-[4px] uppercase text-warm-grey/50 mb-10">
            Designers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {allDesigners.map((d: any) => (
              <Link
                key={d.id}
                href={`/designer/${d.slug}`}
                className="group flex gap-5 p-5 hover:bg-warm-white transition-colors duration-300"
              >
                <div className="w-20 h-20 bg-sand shrink-0 overflow-hidden flex-shrink-0">
                  {d.photo ? (
                    <img
                      src={d.photo}
                      alt={d.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-sand-hover/40 text-xl font-serif">
                        {d.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-serif text-base font-semibold mb-1 group-hover:text-terracotta transition-colors">
                    {d.name}
                  </h3>
                  <p className="text-warm-grey/50 text-[11px] tracking-wide uppercase mb-1.5">
                    {d.cities?.name}
                  </p>
                  {d.bio && (
                    <p className="text-warm-grey/70 text-sm leading-relaxed line-clamp-2">
                      {d.bio}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Sponsored ──────────────────────────────────── */}
      {(countryAds || []).length > 0 && (
        <section>
          <h2 className="text-xs tracking-[4px] uppercase text-warm-grey/50 mb-10">
            Sponsored
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(countryAds || []).map((ad: any) => (
              <a
                key={ad.id}
                href={ad.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-5 hover:bg-warm-white transition-colors duration-300"
              >
                {ad.photo && (
                  <div className="aspect-[3/1] bg-sand overflow-hidden mb-4">
                    <img
                      src={ad.photo}
                      alt={ad.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h3 className="font-serif text-base font-semibold mb-1">
                  {ad.name}
                </h3>
                {ad.description && (
                  <p className="text-warm-grey/70 text-sm leading-relaxed line-clamp-2">
                    {ad.description}
                  </p>
                )}
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
