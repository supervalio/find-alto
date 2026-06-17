import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import {
  countries,
  cities,
  designers,
  items,
  categories,
  ads,
} from "@/db/schema";
import { eq, and, count } from "drizzle-orm";

interface Props {
  params: Promise<{ country: string; city: string }>;
}

export default async function CityPage({ params }: Props) {
  const { country: countrySlug, city: citySlug } = await params;

  /* ── Validate country ─────────────────────────── */
  const country = await db
    .select()
    .from(countries)
    .where(eq(countries.slug, countrySlug))
    .get();

  if (!country) notFound();

  /* ── Validate city (must belong to country) ──── */
  const city = await db
    .select()
    .from(cities)
    .where(and(eq(cities.slug, citySlug), eq(cities.countryId, country.id)))
    .get();

  if (!city) notFound();

  /* ── Categories with items in this city ───────── */
  const cityCategories = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      nameRu: categories.nameRu,
      nameEn: categories.nameEn,
      itemCount: count(items.id),
    })
    .from(categories)
    .innerJoin(items, eq(categories.id, items.categoryId))
    .innerJoin(designers, eq(items.designerId, designers.id))
    .where(eq(designers.cityId, city.id))
    .groupBy(categories.id)
    .all();

  const cityAds = await db
    .select()
    .from(ads)
    .where(eq(ads.cityId, city.id))
    .all();

  /* ── Display name helper ─────────────────────── */
  const categoryLabel = (cat: {
    name: string;
    nameRu: string;
    nameEn: string;
  }) => cat.nameRu || cat.nameEn || cat.name;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-zinc-500 mb-8">
        <Link href="/" className="hover:text-zinc-900 transition-colors">
          Главная
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/${country.slug}`}
          className="hover:text-zinc-900 transition-colors"
        >
          {country.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-900">{city.name}</span>
      </nav>

      {/* City header */}
      <div className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight mb-3">
          {city.name}
        </h1>
        {city.description && (
          <p className="text-zinc-500 text-lg max-w-2xl">{city.description}</p>
        )}
      </div>

      {/* Ads */}
      {cityAds.length > 0 && (
        <section className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cityAds.map((ad) => (
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

      {/* Categories grid */}
      {cityCategories.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Категории</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cityCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/${country.slug}/${city.slug}/${cat.slug}`}
                className="group block rounded-xl border border-zinc-200 bg-white p-5 hover:border-zinc-400 transition-colors"
              >
                <h3 className="text-lg font-medium group-hover:text-zinc-600 transition-colors">
                  {categoryLabel(cat)}
                </h3>
                <p className="text-zinc-500 text-sm mt-1">
                  {cat.itemCount} {cat.itemCount === 1 ? "вещь" : "вещей"}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {cityCategories.length === 0 && (
        <p className="text-zinc-500 text-center py-12">
          В этом городе пока нет вещей. Загляните позже — мы постоянно добавляем
          новых дизайнеров.
        </p>
      )}
    </div>
  );
}
