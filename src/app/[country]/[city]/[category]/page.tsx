import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/db";
import { countries, cities, designers, items, categories } from "@/db/schema";
import { eq, and } from "drizzle-orm";

interface Props {
  params: Promise<{ country: string; city: string; category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const {
    country: countrySlug,
    city: citySlug,
    category: categorySlug,
  } = await params;
  const country = await db
    .select()
    .from(countries)
    .where(eq(countries.slug, countrySlug))
    .get();
  const city = country
    ? await db
        .select()
        .from(cities)
        .where(and(eq(cities.slug, citySlug), eq(cities.countryId, country.id)))
        .get()
    : null;
  const category = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, categorySlug))
    .get();

  if (!country || !city || !category) return { title: "Категория не найдена" };

  const label = category.nameRu || category.nameEn || category.name;
  return {
    title: `${label} — ${city.name}`,
    description: `${label} от локальных дизайнеров в ${city.name}, ${country.name}`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const {
    country: countrySlug,
    city: citySlug,
    category: categorySlug,
  } = await params;

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

  /* ── Validate category ────────────────────────── */
  const category = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, categorySlug))
    .get();

  if (!category) notFound();

  /* ── Items in this category + city ────────────── */
  const categoryItems = await db
    .select({
      item: items,
      designer: designers,
    })
    .from(items)
    .innerJoin(designers, eq(items.designerId, designers.id))
    .where(
      and(eq(items.categoryId, category.id), eq(designers.cityId, city.id)),
    )
    ;

  /* ── Designers who have items here ────────────── */
  const categoryDesigners = await db
    .selectDistinct({
      designer: designers,
    })
    .from(designers)
    .innerJoin(items, eq(items.designerId, designers.id))
    .where(
      and(eq(items.categoryId, category.id), eq(designers.cityId, city.id)),
    )
    ;

  /* ── Display name helper ──────────────────────── */
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
        <Link
          href={`/${country.slug}/${city.slug}`}
          className="hover:text-zinc-900 transition-colors"
        >
          {city.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-900">{categoryLabel(category)}</span>
      </nav>

      {/* Category header */}
      <div className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight mb-3">
          {categoryLabel(category)} — {city.name}
        </h1>
      </div>

      {/* Items list */}
      {categoryItems.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">
            Вещи ({categoryItems.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryItems.map(({ item, designer }) => (
              <div
                key={item.id}
                className="rounded-xl border border-zinc-200 bg-white p-5"
              >
                <h3 className="font-medium">{item.name}</h3>
                {item.description && (
                  <p className="text-sm text-zinc-500 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                )}
                <div className="mt-3 flex items-center justify-between">
                  <Link
                    href={`/designer/${designer.slug}`}
                    className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
                  >
                    {designer.name}
                  </Link>
                  {item.priceLocal != null && item.priceLocal > 0 && (
                    <span className="text-sm font-medium">
                      {item.priceLocal.toLocaleString()}{" "}
                      {item.currency || "USD"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Designers in this category */}
      {categoryDesigners.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">
            Дизайнеры в этой категории
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categoryDesigners.map(({ designer }) => (
              <Link
                key={designer.id}
                href={`/designer/${designer.slug}`}
                className="group flex gap-4 rounded-xl border border-zinc-200 bg-white p-4 hover:border-zinc-400 transition-colors"
              >
                <div className="w-20 h-20 rounded-lg bg-zinc-100 shrink-0 overflow-hidden">
                  {designer.photo ? (
                    <img
                      src={designer.photo}
                      alt={designer.name}
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
                    {designer.name}
                  </h3>
                  <p className="text-sm text-zinc-500 mt-1">{city.name}</p>
                  <p className="text-sm text-zinc-400 mt-1 line-clamp-2">
                    {designer.bio}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {categoryItems.length === 0 && (
        <p className="text-zinc-500 text-center py-12">
          В этой категории пока нет вещей для {city.name}. Загляните позже.
        </p>
      )}
    </div>
  );
}
