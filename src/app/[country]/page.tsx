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
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-warm-grey mb-8">
        <Link href="/" className="hover:text-terracotta transition-colors">
          Главная
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">{country.name}</span>
      </nav>

      {/* Country header */}
      <div className="mb-12">
        <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight mb-4">
          {country.name}
        </h1>
        {country.image && (
          <div className="w-full aspect-[3/1] rounded-xl bg-sand overflow-hidden mb-4">
            <img
              src={country.image}
              alt={country.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {country.description && (
          <p className="text-warm-grey text-lg max-w-2xl leading-relaxed">
            {country.description}
          </p>
        )}
      </div>

      {/* Ads */}
      {(countryAds || []).length > 0 && (
        <section className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(countryAds || []).map((ad: any) => (
              <a
                key={ad.id}
                href={ad.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-xl border border-sand bg-warm-white overflow-hidden hover:border-sand-hover transition-colors"
              >
                {ad.photo && (
                  <div className="aspect-[3/1] bg-sand overflow-hidden">
                    <img
                      src={ad.photo}
                      alt={ad.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-medium text-sm">{ad.name}</h3>
                  {ad.description && (
                    <p className="text-xs text-warm-grey mt-1 line-clamp-2">
                      {ad.description}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Cities grid */}
      {(allCities || []).length > 0 && (
        <section className="mb-12">
          <h2 className="font-serif text-xl font-semibold mb-4">Города</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(allCities || []).map((city: any) => (
              <Link
                key={city.id}
                href={`/${country.slug}/${city.slug}`}
                className="group block rounded-xl border border-sand bg-warm-white p-5 hover:border-sand-hover transition-colors"
              >
                <h3 className="text-lg font-medium text-charcoal group-hover:text-terracotta transition-colors">
                  {city.name}
                </h3>
                {city.description && (
                  <p className="text-warm-grey text-sm mt-1 line-clamp-2">
                    {city.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All designers in country */}
      {allDesigners.length > 0 && (
        <section>
          <h2 className="font-serif text-xl font-semibold mb-4">Дизайнеры</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {allDesigners.map((d: any) => (
              <Link
                key={d.id}
                href={`/designer/${d.slug}`}
                className="group flex gap-4 rounded-xl border border-sand bg-warm-white p-4 hover:border-sand-hover transition-colors"
              >
                <div className="w-20 h-20 rounded-lg bg-sand shrink-0 overflow-hidden">
                  {d.photo ? (
                    <img
                      src={d.photo}
                      alt={d.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sand-hover text-xs">
                      фото
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium text-charcoal group-hover:text-terracotta transition-colors truncate">
                    {d.name}
                  </h3>
                  <p className="text-sm text-warm-grey mt-1">{d.cities.name}</p>
                  <p className="text-sm text-warm-grey/70 mt-1 line-clamp-2">
                    {d.bio}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
