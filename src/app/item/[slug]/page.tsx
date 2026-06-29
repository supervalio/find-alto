import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/db";
import {
  items,
  itemPhotos,
  designers,
  cities,
  countries,
  categories,
} from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const row = await db
    .select({
      item: items,
      designer: designers,
      category: categories,
      city: cities,
      country: countries,
    })
    .from(items)
    .innerJoin(designers, eq(items.designerId, designers.id))
    .innerJoin(categories, eq(items.categoryId, categories.id))
    .innerJoin(cities, eq(designers.cityId, cities.id))
    .innerJoin(countries, eq(cities.countryId, countries.id))
    .where(eq(items.slug, slug))
    .get();

  if (!row) return { title: "Вещь не найдена" };

  const categoryLabel = row.category.nameRu || row.category.name;
  return {
    title: row.item.name,
    description:
      row.item.description ||
      `${categoryLabel} от ${row.designer.name} — ${row.city.name}, ${row.country.name}`,
  };
}

export default async function ItemPage({ params }: Props) {
  const { slug } = await params;

  /* ── Fetch item with all joins ──────────────────────── */
  const row = await db
    .select()
    .from(items)
    .innerJoin(designers, eq(items.designerId, designers.id))
    .innerJoin(categories, eq(items.categoryId, categories.id))
    .innerJoin(cities, eq(designers.cityId, cities.id))
    .innerJoin(countries, eq(cities.countryId, countries.id))
    .where(eq(items.slug, slug))
    .get();

  if (!row) notFound();

  const item = row.items;
  const designer = row.designers;
  const category = row.categories;
  const city = row.cities;
  const country = row.countries;

  /* ── Fetch photos ───────────────────────────────────── */
  const photos = await db
    .select()
    .from(itemPhotos)
    .where(eq(itemPhotos.itemId, item.id))
    .orderBy(itemPhotos.sortOrder)
    ;

  /* ── Other items by same designer ───────────────────── */
  const otherItems = await db
    .select()
    .from(items)
    .where(and(eq(items.designerId, designer.id), ne(items.id, item.id)))
    .limit(3)
    ;

  /* ── Helpers ────────────────────────────────────────── */
  const photoCount = photos.length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* ═══ Breadcrumb ═══════════════════════════════════ */}
      <nav className="text-sm text-zinc-500 mb-8 flex flex-wrap items-center gap-x-1.5">
        <Link href="/" className="hover:text-zinc-900 transition-colors">
          Главная
        </Link>
        <span>/</span>
        <Link
          href={`/${country.slug}`}
          className="hover:text-zinc-900 transition-colors"
        >
          {country.name}
        </Link>
        <span>/</span>
        <Link
          href={`/${country.slug}/${city.slug}`}
          className="hover:text-zinc-900 transition-colors"
        >
          {city.name}
        </Link>
        <span>/</span>
        <Link
          href={`/designer/${designer.slug}`}
          className="hover:text-zinc-900 transition-colors"
        >
          {designer.name}
        </Link>
        <span>/</span>
        <span className="text-zinc-900">{item.name}</span>
      </nav>

      {/* ═══ Photo Gallery (ITEM-01) ══════════════════════ */}
      {photoCount > 0 && (
        <div className="mb-10">
          {photoCount === 1 ? (
            /* Single photo: full-width */
            <div className="rounded-xl overflow-hidden border border-zinc-200">
              <img
                src={photos[0].url}
                alt={photos[0].alt || item.name}
                className="w-full h-auto max-h-[32rem] object-cover"
              />
            </div>
          ) : (
            /* Multiple photos: first prominent, rest in grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* First photo — spans full height on md+ */}
              <div className="rounded-xl overflow-hidden border border-zinc-200 md:row-span-2">
                <img
                  src={photos[0].url}
                  alt={photos[0].alt || item.name}
                  className="w-full h-full object-cover min-h-[20rem]"
                />
              </div>
              {/* Remaining photos */}
              {photos.slice(1).map((photo) => (
                <div
                  key={photo.id}
                  className="rounded-xl overflow-hidden border border-zinc-200"
                >
                  <img
                    src={photo.url}
                    alt={photo.alt || item.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══ Item header (ITEM-01) ════════════════════════ */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <h1 className="text-3xl font-semibold tracking-tight">{item.name}</h1>
          <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-0.5 text-sm text-zinc-600">
            {category.nameRu || category.name}
          </span>
        </div>
        <p className="text-zinc-500">
          Дизайнер:{" "}
          <Link
            href={`/designer/${designer.slug}`}
            className="font-medium text-zinc-900 hover:text-zinc-600 transition-colors underline underline-offset-2"
          >
            {designer.name}
          </Link>
        </p>
      </div>

      {/* ═══ Two-column detail section ════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* ── Price (ITEM-02) ──────────────────────────── */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wide mb-2">
            Цена
          </h2>
          {item.priceLocal != null && item.priceLocal > 0 ? (
            <div>
              <p className="text-2xl font-semibold tabular-nums">
                {item.priceLocal.toLocaleString("ru-RU")}{" "}
                <span className="text-base font-normal text-zinc-500">
                  {item.currency || "USD"}
                </span>
              </p>
              {item.priceUsd != null && item.priceUsd > 0 && (
                <p className="text-sm text-zinc-400 mt-1 tabular-nums">
                  ≈{" "}
                  {item.priceUsd.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </p>
              )}
            </div>
          ) : (
            <p className="text-zinc-400 italic">Цена по запросу</p>
          )}
        </div>

        {/* ── Location (ITEM-02) ───────────────────────── */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wide mb-2">
            Локация
          </h2>
          <p className="text-lg font-medium">
            {city.name},{" "}
            <Link
              href={`/${country.slug}`}
              className="hover:text-zinc-600 transition-colors underline underline-offset-2"
            >
              {country.name}
            </Link>
          </p>
        </div>
      </div>

      {/* ═══ Material (ITEM-02) ═══════════════════════════ */}
      {item.material && (
        <div className="rounded-xl border border-zinc-200 bg-white p-5 mb-8">
          <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wide mb-2">
            Материал
          </h2>
          <p className="text-zinc-700">{item.material}</p>
        </div>
      )}

      {/* ═══ Story (ITEM-03) ══════════════════════════════ */}
      {item.story && (
        <div className="rounded-xl border-l-4 border-zinc-900 bg-white p-5 mb-8">
          <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wide mb-3">
            История вещи
          </h2>
          <p className="text-zinc-700 italic leading-relaxed">{item.story}</p>
        </div>
      )}

      {/* ═══ Description ══════════════════════════════════ */}
      {item.description && (
        <div className="mb-8">
          <p className="text-zinc-600 leading-relaxed">{item.description}</p>
        </div>
      )}

      {/* ═══ Designer link block (ITEM-04) ════════════════ */}
      <div className="mb-10">
        <Link
          href={`/designer/${designer.slug}`}
          className="group block rounded-xl border border-zinc-200 bg-white p-5 hover:border-zinc-400 transition-colors"
        >
          <h2 className="text-lg font-semibold mb-2">О дизайнере</h2>
          <div className="flex gap-4 items-start">
            <div className="w-16 h-16 rounded-lg bg-zinc-100 shrink-0 overflow-hidden">
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
              <p className="font-medium group-hover:text-zinc-600 transition-colors">
                {designer.name}
              </p>
              {designer.bio && (
                <p className="text-sm text-zinc-500 mt-1 line-clamp-2">
                  {designer.bio}
                </p>
              )}
              <p className="text-sm text-zinc-400 mt-1">
                {city.name}, {country.name}
              </p>
            </div>
          </div>
          <div className="mt-3 text-sm font-medium text-zinc-900 group-hover:text-zinc-600 transition-colors">
            Смотреть все вещи дизайнера →
          </div>
        </Link>
      </div>

      {/* ═══ Other items by this designer ═════════════════ */}
      {otherItems.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">
            Другие вещи {designer.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherItems.map((other) => (
              <Link
                key={other.id}
                href={`/item/${other.slug}`}
                className="group block rounded-xl border border-zinc-200 bg-white p-4 hover:border-zinc-400 transition-colors"
              >
                <h3 className="font-medium group-hover:text-zinc-600 transition-colors">
                  {other.name}
                </h3>
                {other.material && (
                  <p className="text-sm text-zinc-500 mt-1">{other.material}</p>
                )}
                {other.priceLocal != null && other.priceLocal > 0 && (
                  <p className="text-sm text-zinc-500 mt-1 tabular-nums">
                    {other.priceLocal.toLocaleString("ru-RU")}{" "}
                    {other.currency || "USD"}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
