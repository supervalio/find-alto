import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";

/* ── snake_case → camelCase helper ──────────────────────── */
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
  if (!dbRow) return { title: "Designer not found" };

  const row = snakeToCamel(dbRow);
  const location = row.cities
    ? `${row.cities.name}${row.cities.countries ? `, ${row.cities.countries.name}` : ""}`
    : "";
  return {
    title: row.name,
    description:
      row.bio ||
      (location
        ? `Independent designer from ${location}`
        : "Independent designer"),
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
    <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
      {/* ── Breadcrumb ─────────────────────────────────── */}
      <nav className="text-xs tracking-wider text-muted/50 mb-12">
        <Link href="/" className="hover:text-accent transition-colors">
          Home
        </Link>
        {country && (
          <>
            <span className="mx-2">/</span>
            <Link
              href={`/${country.slug}`}
              className="hover:text-accent transition-colors"
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
              className="hover:text-accent transition-colors"
            >
              {city.name}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-muted">{designer.name}</span>
      </nav>

      {/* ── Hero Section ────────────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-10 mb-20">
        {/* Photo */}
        <div className="w-full md:w-80 shrink-0">
          {designer.photo ? (
            <img
              src={designer.photo}
              alt={designer.name}
              className="w-full aspect-[3/4] object-cover"
            />
          ) : (
            <div className="w-full aspect-[3/4] bg-surface flex items-center justify-center text-muted/30">
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
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-3">
            {designer.name}
          </h1>
          {city && (
            <p className="text-muted/70 text-lg mb-6">
              {city.name}
              {country && `, ${country.name}`}
            </p>
          )}
          {designer.bio && (
            <p className="text-muted/70 leading-relaxed max-w-xl">
              {designer.bio}
            </p>
          )}
        </div>
      </div>

      {/* ── Story Section ───────────────────────────────── */}
      {designer.story && (
        <section className="mb-20">
          <h2 className="text-xs tracking-[4px] uppercase text-muted/50 mb-6">
            Story
          </h2>
          <div className="text-muted/70 leading-relaxed whitespace-pre-line max-w-2xl">
            {designer.story}
          </div>
        </section>
      )}

      {/* ── Why Locals Wear This ─────────────────────────── */}
      {designer.whyLocalsWear && (
        <section className="mb-20">
          <h2 className="text-xs tracking-[4px] uppercase text-muted/50 mb-6">
            Why Locals Wear This
          </h2>
          <div className="border-l-4 border-accent pl-6">
            <p className="text-muted/70 leading-relaxed italic max-w-2xl">
              {designer.whyLocalsWear}
            </p>
          </div>
        </section>
      )}

      {/* ── Contacts Section ─────────────────────────────── */}
      {(designer.instagram || designer.website || designer.address) && (
        <section className="mb-20">
          <h2 className="text-xs tracking-[4px] uppercase text-muted/50 mb-6">
            Contacts
          </h2>
          <div className="flex flex-wrap gap-6">
            {designer.instagram && (
              <a
                href={`https://instagram.com/${designer.instagram.replace(/^@/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors"
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
                className="inline-flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors"
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
              <div className="inline-flex items-center gap-2 text-sm font-medium text-muted/70">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 shrink-0"
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
                <span>{designer.address}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Items Gallery ────────────────────────────────── */}
      {itemsWithPhotos.length > 0 && (
        <section>
          <h2 className="text-xs tracking-[4px] uppercase text-muted/50 mb-6">
            Items
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {itemsWithPhotos.map((row) => {
              const item = row.items;
              const category = row.categories ?? null;
              const firstPhoto = row.photos.length > 0 ? row.photos[0] : null;

              return (
                <Link
                  key={item.id}
                  href={`/item/${item.slug}`}
                  className="group block hover:bg-neutral-100 transition-colors duration-300"
                >
                  <div className="aspect-[4/3] bg-surface overflow-hidden">
                    {firstPhoto ? (
                      <img
                        src={firstPhoto.url}
                        alt={firstPhoto.alt || item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted/20">
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
                    <h3 className="font-medium group-hover:text-accent transition-colors truncate">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      {item.material && (
                        <span className="text-xs text-muted/50 truncate">
                          {item.material}
                        </span>
                      )}
                      {category && (
                        <>
                          {item.material && (
                            <span className="text-muted/30">·</span>
                          )}
                          <span className="text-xs text-muted/50 truncate">
                            {category.nameEn || category.name}
                          </span>
                        </>
                      )}
                    </div>
                    {priceLabel(item) && (
                      <p className="text-sm font-medium mt-2">
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
          <h2 className="text-xs tracking-[4px] uppercase text-muted/50 mb-6">
            Items
          </h2>
          <div className="py-12 text-center">
            <p className="text-muted/50">No items yet.</p>
          </div>
        </section>
      )}
    </div>
  );
}
