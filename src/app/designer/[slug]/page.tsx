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

  const { data: itemsData } = await supabase
    .from("items")
    .select("*, categories(name, name_ru)")
    .eq("designer_id", designer.id);

  const camelItems = (itemsData ?? []).map(snakeToCamel);

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
      <nav className="text-sm text-warm-grey mb-8">
        <Link href="/" className="hover:text-terracotta transition-colors">
          Главная
        </Link>
        {country && (
          <>
            <span className="mx-2">/</span>
            <Link
              href={`/${country.slug}`}
              className="hover:text-terracotta transition-colors"
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
              className="hover:text-terracotta transition-colors"
            >
              {city.name}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-charcoal">{designer.name}</span>
      </nav>

      {/* ── Hero Section ────────────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-8 mb-16">
        {/* Photo */}
        <div className="w-full md:w-80 shrink-0">
          {designer.photo ? (
            <img
              src={designer.photo}
              alt={designer.name}
              className="w-full aspect-[3/4] object-cover rounded-xl border border-sand"
            />
          ) : (
            <div className="w-full aspect-[3/4] rounded-xl border border-sand bg-sand flex items-center justify-center text-sand-hover">
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
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight mb-2">
            {designer.name}
          </h1>
          {city && (
            <p className="text-warm-grey text-lg mb-4">
              {city.name}
              {country && `, ${country.name}`}
            </p>
          )}
          {designer.bio && (
            <p className="text-warm-grey leading-relaxed max-w-xl">
              {designer.bio}
            </p>
          )}
        </div>
      </div>

      {/* ── Story Section ───────────────────────────────── */}
      {designer.story && (
        <section className="mb-16">
          <h2 className="font-serif text-xl font-semibold mb-4">История</h2>
          <div className="prose max-w-none text-warm-grey leading-relaxed whitespace-pre-line">
            {designer.story}
          </div>
        </section>
      )}

      {/* ── Why Locals Wear This ─────────────────────────── */}
      {designer.whyLocalsWear && (
        <section className="mb-16">
          <div className="rounded-xl border-l-4 border-terracotta bg-warm-white p-6">
            <h2 className="font-serif text-xl font-semibold mb-3">
              Почему местные это носят
            </h2>
            <p className="text-warm-grey leading-relaxed italic">
              {designer.whyLocalsWear}
            </p>
          </div>
        </section>
      )}

      {/* ── Contacts Section ─────────────────────────────── */}
      {(designer.instagram || designer.website || designer.address) && (
        <section className="mb-16">
          <h2 className="font-serif text-xl font-semibold mb-4">Контакты</h2>
          <div className="flex flex-wrap gap-4">
            {designer.instagram && (
              <a
                href={`https://instagram.com/${designer.instagram.replace(/^@/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-sand bg-warm-white px-4 py-3 text-sm font-medium hover:border-terracotta hover:text-terracotta transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
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
                <span>@{designer.instagram.replace(/^@/, "")}</span>
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
                className="inline-flex items-center gap-2 rounded-xl border border-sand bg-warm-white px-4 py-3 text-sm font-medium hover:border-terracotta hover:text-terracotta transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
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
                <span>
                  {designer.website
                    .replace(/^https?:\/\//, "")
                    .replace(/\/$/, "")}
                </span>
              </a>
            )}

            {designer.address && (
              <div className="inline-flex items-center gap-2 rounded-xl border border-sand bg-warm-white px-4 py-3 text-sm font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-warm-grey shrink-0"
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
                <span className="text-warm-grey">{designer.address}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Items Gallery ────────────────────────────────── */}
      {itemsWithPhotos.length > 0 && (
        <section>
          <h2 className="font-serif text-xl font-semibold mb-6">
            Вещи дизайнера
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {itemsWithPhotos.map((row) => {
              const item = row.items;
              const category = row.categories ?? null;
              const firstPhoto = row.photos.length > 0 ? row.photos[0] : null;

              return (
                <Link
                  key={item.id}
                  href={`/item/${item.slug}`}
                  className="group block rounded-xl border border-sand bg-warm-white overflow-hidden hover:border-sand-hover hover:shadow-md transition-all duration-200"
                >
                  <div className="aspect-[4/3] bg-sand overflow-hidden">
                    {firstPhoto ? (
                      <img
                        src={firstPhoto.url}
                        alt={firstPhoto.alt || item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sand-hover">
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

                  <div className="p-4">
                    <h3 className="font-medium text-charcoal group-hover:text-terracotta transition-colors truncate">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      {item.material && (
                        <span className="text-xs text-warm-grey truncate">
                          {item.material}
                        </span>
                      )}
                      {category && (
                        <>
                          {item.material && (
                            <span className="text-sand-hover">·</span>
                          )}
                          <span className="text-xs text-warm-grey truncate">
                            {category.nameRu || category.name}
                          </span>
                        </>
                      )}
                    </div>
                    {priceLabel(item) && (
                      <p className="text-sm font-semibold text-charcoal mt-2">
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

      {itemsWithPhotos.length === 0 && (
        <section>
          <h2 className="font-serif text-xl font-semibold mb-4">
            Вещи дизайнера
          </h2>
          <div className="rounded-xl border border-sand bg-warm-white p-8 text-center">
            <p className="text-warm-grey">У этого дизайнера пока нет вещей.</p>
          </div>
        </section>
      )}
    </div>
  );
}
