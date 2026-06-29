import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";

/* ── snake_case → camelCase helper ──────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function snakeToCamel<T>(obj: T): T {
  if (Array.isArray(obj)) return obj.map(snakeToCamel) as unknown as T;
  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key.replace(/_([a-z])/g, (_: string, c: string) => c.toUpperCase()),
        snakeToCamel(value),
      ]),
    ) as unknown as T;
  }
  return obj;
}

/* ── Minimal price shape ────────────────────────────────── */
interface ItemPrice {
  priceLocal?: number | null;
  currency?: string | null;
  priceUsd?: number | null;
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await supabase
    .from("designers")
    .select("*, cities(name,slug, countries(name,slug))")
    .eq("slug", slug)
    .limit(1);

  const dbRow = data?.[0];
  if (!dbRow) return { title: "Дизайнер не найден" };

  const row = snakeToCamel(dbRow);
  const location = row.cities
    ? `${row.cities.name}${row.cities.countries ? `, ${row.cities.countries.name}` : ""}`
    : "";
  return {
    title: row.name,
    description:
      row.bio ||
      (location ? `Локальный дизайнер из ${location}` : "Локальный дизайнер"),
  };
}

export default async function DesignerPage({ params }: Props) {
  const { slug } = await params;

  /* ── Fetch designer with city & country ─────────────── */
  const { data, error } = await supabase
    .from("designers")
    .select("*, cities(name,slug, countries(name,slug))")
    .eq("slug", slug)
    .limit(1);

  if (error) throw error;

  const dbRow = data?.[0];
  if (!dbRow) notFound();

  const camelRow = snakeToCamel(dbRow);
  const designer = camelRow;
  const city = camelRow.cities ?? null;
  const country = camelRow.cities?.countries ?? null;

  /* ── Fetch designer's items with category & photos ──── */
  const { data: itemsData } = await supabase
    .from("items")
    .select("*, categories(name, name_ru)")
    .eq("designer_id", designer.id);

  const camelItems = (itemsData ?? []).map(snakeToCamel);

  /* Fetch items with photos */
  const itemsWithPhotos = await Promise.all(
    camelItems.map(async (itemRow) => {
      const { data: photosData } = await supabase
        .from("item_photos")
        .select("*")
        .eq("item_id", itemRow.id)
        .order("sort_order");
      const photos = (photosData ?? []).map(snakeToCamel);
      return {
        items: itemRow,
        categories: itemRow.categories ?? null,
        photos,
      };
    }),
  );

  /* ── Helpers ─────────────────────────────────────────── */
  const priceLabel = (item: ItemPrice) => {
    if (item.priceLocal && item.currency) {
      return `${item.priceLocal} ${item.currency}`;
    }
    if (item.priceUsd) return `$${item.priceUsd}`;
    return null;
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* ── Breadcrumb ─────────────────────────────────── */}
      <nav className="text-sm text-zinc-500 mb-8">
        <Link href="/" className="hover:text-zinc-900 transition-colors">
          Главная
        </Link>
        {country && (
          <>
            <span className="mx-2">/</span>
            <Link
              href={`/${country.slug}`}
              className="hover:text-zinc-900 transition-colors"
            >
              {country.name}
            </Link>
          </>
        )}
        {city && (
          <>
            <span className="mx-2">/</span>
            <Link
              href={`/${country?.slug ?? ""}/${city.slug}`}
              className="hover:text-zinc-900 transition-colors"
            >
              {city.name}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-zinc-900">{designer.name}</span>
      </nav>

      {/* ── Hero Section ────────────────────────────────── */}
      {/* DSGN-01: name, photo, city, bio */}
      <div className="flex flex-col md:flex-row gap-8 mb-16">
        {/* Photo */}
        <div className="w-full md:w-80 shrink-0">
          {designer.photo ? (
            <img
              src={designer.photo}
              alt={designer.name}
              className="w-full aspect-[3/4] object-cover rounded-xl border border-zinc-200"
            />
          ) : (
            <div className="w-full aspect-[3/4] rounded-xl border border-zinc-200 bg-zinc-100 flex items-center justify-center text-zinc-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center min-w-0">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">
            {designer.name}
          </h1>
          {city && (
            <p className="text-zinc-500 text-lg mb-4">
              {city.name}
              {country && `, ${country.name}`}
            </p>
          )}
          {designer.bio && (
            <p className="text-zinc-600 leading-relaxed max-w-xl">
              {designer.bio}
            </p>
          )}
        </div>
      </div>

      {/* ── Story Section ───────────────────────────────── */}
      {designer.story && (
        <section className="mb-16">
          <h2 className="text-xl font-semibold mb-4">История</h2>
          <div className="prose prose-zinc max-w-none text-zinc-600 leading-relaxed whitespace-pre-line">
            {designer.story}
          </div>
        </section>
      )}

      {/* ── Why Locals Wear This ─────────────────────────── */}
      {/* DSGN-04 */}
      {designer.whyLocalsWear && (
        <section className="mb-16">
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="text-xl font-semibold mb-3">
              Почему местные это носят
            </h2>
            <p className="text-zinc-600 leading-relaxed">
              {designer.whyLocalsWear}
            </p>
          </div>
        </section>
      )}

      {/* ── Contacts Section ─────────────────────────────── */}
      {/* DSGN-03: Instagram, website, address */}
      {(designer.instagram || designer.website || designer.address) && (
        <section className="mb-16">
          <h2 className="text-xl font-semibold mb-4">Контакты</h2>
          <div className="flex flex-wrap gap-4">
            {designer.instagram && (
              <a
                href={`https://instagram.com/${designer.instagram.replace(/^@/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium hover:border-zinc-400 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-zinc-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                <span className="text-zinc-700">
                  @{designer.instagram.replace(/^@/, "")}
                </span>
              </a>
            )}

            {designer.website && (
              <a
                href={
                  designer.website.startsWith("http")
                    ? designer.website
                    : `https://${designer.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium hover:border-zinc-400 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-zinc-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
                <span className="text-zinc-700">
                  {designer.website
                    .replace(/^https?:\/\//, "")
                    .replace(/\/$/, "")}
                </span>
              </a>
            )}

            {designer.address && (
              <div className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-zinc-500 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-zinc-700">{designer.address}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Items Gallery ────────────────────────────────── */}
      {/* DSGN-02: gallery of items, min 3 photos */}
      {itemsWithPhotos.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-6">Вещи дизайнера</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {itemsWithPhotos.map((row) => {
              const item = row.items;
              const category = row.categories ?? null;
              const firstPhoto = row.photos.length > 0 ? row.photos[0] : null;

              return (
                <Link
                  key={item.id}
                  href={`/item/${item.slug}`}
                  className="group block rounded-xl border border-zinc-200 bg-white overflow-hidden hover:border-zinc-400 transition-colors"
                >
                  {/* Item photo */}
                  <div className="aspect-[4/3] bg-zinc-100 overflow-hidden">
                    {firstPhoto ? (
                      <img
                        src={firstPhoto.url}
                        alt={firstPhoto.alt || item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-12 h-12"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Item info */}
                  <div className="p-4">
                    <h3 className="font-medium group-hover:text-zinc-600 transition-colors truncate">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      {item.material && (
                        <span className="text-xs text-zinc-400 truncate">
                          {item.material}
                        </span>
                      )}
                      {category && (
                        <>
                          {item.material && (
                            <span className="text-zinc-300">·</span>
                          )}
                          <span className="text-xs text-zinc-400 truncate">
                            {category.nameRu || category.name}
                          </span>
                        </>
                      )}
                    </div>
                    {priceLabel(item) && (
                      <p className="text-sm font-medium text-zinc-900 mt-2">
                        {priceLabel(item)}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Empty state when no items */}
      {itemsWithPhotos.length === 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Вещи дизайнера</h2>
          <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center">
            <p className="text-zinc-400">У этого дизайнера пока нет вещей.</p>
          </div>
        </section>
      )}
    </div>
  );
}
