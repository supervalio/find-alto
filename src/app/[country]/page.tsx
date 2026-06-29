import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/db";
import { countries, cities, designers, ads } from "@/db/schema";
import { eq } from "drizzle-orm";

interface Props {
  params: Promise<{ country: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country: slug } = await params;
  const country = await db
    .select()
    .from(countries)
    .where(eq(countries.slug, slug))
    .get();

  if (!country) return { title: "Страна не найдена" };

  return {
    title: country.name,
    description:
      country.description || `Локальные дизайнеры из ${country.name}`,
  };
}

export default async function CountryPage({ params }: Props) {
  const { country: slug } = await params;

  const country = await db
    .select()
    .from(countries)
    .where(eq(countries.slug, slug))
    .get();

  if (!country) notFound();

  const allCities = await db
    .select()
    .from(cities)
    .where(eq(cities.countryId, country.id))
    ;

  const allDesigners = await db
    .select()
    .from(designers)
    .innerJoin(cities, eq(designers.cityId, cities.id))
    .where(eq(cities.countryId, country.id))
    ;

  const countryAds = await db
    .select()
    .from(ads)
    .where(eq(ads.countryId, country.id))
    ;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-zinc-500 mb-8">
        <Link href="/" className="hover:text-zinc-900 transition-colors">
          Главная
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-900">{country.name}</span>
      </nav>

      {/* Country header */}
      <div className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight mb-3">
          {country.name}
        </h1>
        {country.image && (
          <div className="w-full aspect-[3/1] rounded-xl bg-zinc-100 overflow-hidden mb-4">
            <img
              src={country.image}
              alt={country.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {country.description && (
          <p className="text-zinc-500 text-lg max-w-2xl">
            {country.description}
          </p>
        )}
      </div>

      {/* Ads */}
      {countryAds.length > 0 && (
        <section className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {countryAds.map((ad) => (
              <a
                key={ad.id}
                href={ad.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-xl border border-zinc-200 bg-white overflow-hidden hover:border-zinc-400 transition-colors"
              >
                {ad.photo && (
                  <div className="aspect-[3/1] bg-zinc-100 overflow-hidden">
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
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
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
      {allCities.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Города</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allCities.map((city) => (
              <Link
                key={city.id}
                href={`/${country.slug}/${city.slug}`}
                className="group block rounded-xl border border-zinc-200 bg-white p-5 hover:border-zinc-400 transition-colors"
              >
                <h3 className="text-lg font-medium group-hover:text-zinc-600 transition-colors">
                  {city.name}
                </h3>
                {city.description && (
                  <p className="text-zinc-500 text-sm mt-1 line-clamp-2">
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
          <h2 className="text-xl font-semibold mb-4">Дизайнеры</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {allDesigners.map((d) => (
              <Link
                key={d.designers.id}
                href={`/designer/${d.designers.slug}`}
                className="group flex gap-4 rounded-xl border border-zinc-200 bg-white p-4 hover:border-zinc-400 transition-colors"
              >
                <div className="w-20 h-20 rounded-lg bg-zinc-100 shrink-0 overflow-hidden">
                  {d.designers.photo ? (
                    <img
                      src={d.designers.photo}
                      alt={d.designers.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-300 text-xs">
                      фото
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium group-hover:text-zinc-600 transition-colors truncate">
                    {d.designers.name}
                  </h3>
                  <p className="text-sm text-zinc-500 mt-1">{d.cities.name}</p>
                  <p className="text-sm text-zinc-400 mt-1 line-clamp-2">
                    {d.designers.bio}
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
