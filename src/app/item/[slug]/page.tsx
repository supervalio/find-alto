import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await supabase
    .from("items")
    .select(
      "name, description, designers(name, cities(name,slug, countries(name,slug))), categories(name, name_ru)",
    )
    .eq("slug", slug)
    .limit(1);

  const dbRow = data?.[0];
  if (!dbRow) return { title: "Вещь не найдена" };

  const designer = (dbRow.designers as any[])?.[0] || {};
  const category = (dbRow.categories as any[])?.[0] || {};
  const city = designer?.cities?.[0] || {};
  const country = city?.countries?.[0] || {};

  const categoryLabel = category.name_ru || category.name;
  return {
    title: dbRow.name,
    description:
      dbRow.description ||
      `${categoryLabel} от ${designer.name} — ${city.name}, ${country.name}`,
  };
}

export default async function ItemPage({ params }: Props) {
  const { slug } = await params;

  const { data, error } = await supabase
    .from("items")
    .select(
      "*, designers(*, cities(name,slug, countries(name,slug))), categories(name, name_ru)",
    )
    .eq("slug", slug)
    .limit(1);

  if (error) throw error;

  const dbRow = data?.[0];
  if (!dbRow) notFound();

  const item = dbRow;
  const designer = ((dbRow.designers as any[]) || [])[0] || {};
  const category = ((dbRow.categories as any[]) || [])[0] || {};
  const city = (designer.cities || [])[0] || {};
  const country = (city.countries || [])[0] || {};

  const { data: photosData } = await supabase
    .from("item_photos")
    .select("*")
    .eq("item_id", item.id)
    .order("sort_order");
  const photos = photosData ?? [];

  const { data: otherItemsData } = await supabase
    .from("items")
    .select("*")
    .neq("id", item.id)
    .eq("designer_id", designer.id)
    .limit(3);
  const otherItems = otherItemsData ?? [];

  const photoCount = photos.length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* ═══ Breadcrumb ═══════════════════════════════════ */}
      <nav className="text-sm text-warm-grey mb-8 flex flex-wrap items-center gap-x-1.5">
        <Link href="/" className="hover:text-terracotta transition-colors">
          Главная
        </Link>
        <span>/</span>
        <Link
          href={`/${country.slug}`}
          className="hover:text-terracotta transition-colors"
        >
          {country.name}
        </Link>
        <span>/</span>
        <Link
          href={`/${country.slug}/${city.slug}`}
          className="hover:text-terracotta transition-colors"
        >
          {city.name}
        </Link>
        <span>/</span>
        <Link
          href={`/designer/${designer.slug}`}
          className="hover:text-terracotta transition-colors"
        >
          {designer.name}
        </Link>
        <span>/</span>
        <span className="text-charcoal">{item.name}</span>
      </nav>

      {/* ═══ Photo Gallery ════════════════════════════════ */}
      {photoCount > 0 && (
        <div className="mb-10">
          {photoCount === 1 ? (
            <div className="rounded-xl overflow-hidden border border-sand">
              <img
                src={photos[0].url}
                alt={photos[0].alt || item.name}
                className="w-full h-auto max-h-[32rem] object-cover"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded-xl overflow-hidden border border-sand md:row-span-2">
                <img
                  src={photos[0].url}
                  alt={photos[0].alt || item.name}
                  className="w-full h-full object-cover min-h-[20rem]"
                />
              </div>
              {photos.slice(1).map((photo) => (
                <div
                  key={photo.id}
                  className="rounded-xl overflow-hidden border border-sand"
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

      {/* ═══ Item header ══════════════════════════════════ */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">
            {item.name}
          </h1>
          <span className="inline-flex items-center rounded-full bg-olive/10 px-3 py-0.5 text-sm text-olive">
            {category.name_ru || category.name}
          </span>
        </div>
        <p className="text-warm-grey">
          Дизайнер:{" "}
          <Link
            href={`/designer/${designer.slug}`}
            className="font-medium text-terracotta hover:text-terracotta-hover transition-colors underline underline-offset-2"
          >
            {designer.name}
          </Link>
        </p>
      </div>

      {/* ═══ Two-column detail section ════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* ── Price ────────────────────────────────────── */}
        <div className="rounded-xl border border-sand bg-warm-white p-5">
          <h2 className="text-sm font-medium text-warm-grey uppercase tracking-wide mb-2">
            Цена
          </h2>
          {item.price_local != null && item.price_local > 0 ? (
            <div>
              <p className="text-2xl font-semibold text-charcoal tabular-nums">
                {item.price_local.toLocaleString("ru-RU")}{" "}
                <span className="text-base font-normal text-warm-grey">
                  {item.currency || "USD"}
                </span>
              </p>
              {item.price_usd != null && item.price_usd > 0 && (
                <p className="text-sm text-warm-grey mt-1 tabular-nums">
                  ≈{" "}
                  {item.price_usd.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </p>
              )}
            </div>
          ) : (
            <p className="text-warm-grey italic">Цена по запросу</p>
          )}
        </div>

        {/* ── Location ─────────────────────────────────── */}
        <div className="rounded-xl border border-sand bg-warm-white p-5">
          <h2 className="text-sm font-medium text-warm-grey uppercase tracking-wide mb-2">
            Локация
          </h2>
          <p className="text-lg font-medium text-charcoal">
            {city.name},{" "}
            <Link
              href={`/${country.slug}`}
              className="text-terracotta hover:text-terracotta-hover transition-colors underline underline-offset-2"
            >
              {country.name}
            </Link>
          </p>
        </div>
      </div>

      {/* ═══ Material ═════════════════════════════════════ */}
      {item.material && (
        <div className="rounded-xl border border-sand bg-warm-white p-5 mb-8">
          <h2 className="text-sm font-medium text-warm-grey uppercase tracking-wide mb-2">
            Материал
          </h2>
          <p className="text-charcoal">{item.material}</p>
        </div>
      )}

      {/* ═══ Story ════════════════════════════════════════ */}
      {item.story && (
        <div className="rounded-xl border-l-4 border-terracotta bg-warm-white p-5 mb-8">
          <h2 className="text-sm font-medium text-warm-grey uppercase tracking-wide mb-3">
            История вещи
          </h2>
          <p className="text-warm-grey italic leading-relaxed">{item.story}</p>
        </div>
      )}

      {/* ═══ Description ══════════════════════════════════ */}
      {item.description && (
        <div className="mb-8">
          <p className="text-warm-grey leading-relaxed">{item.description}</p>
        </div>
      )}

      {/* ═══ Designer link block ══════════════════════════ */}
      <div className="mb-10">
        <Link
          href={`/designer/${designer.slug}`}
          className="group block rounded-xl border border-sand bg-warm-white p-5 hover:border-sand-hover hover:shadow-md transition-all duration-200"
        >
          <h2 className="font-serif text-lg font-semibold mb-2">О дизайнере</h2>
          <div className="flex gap-4 items-start">
            <div className="w-16 h-16 rounded-lg bg-sand shrink-0 overflow-hidden">
              {designer.photo ? (
                <img
                  src={designer.photo}
                  alt={designer.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sand-hover text-xs">
                  фото
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-charcoal group-hover:text-terracotta transition-colors">
                {designer.name}
              </p>
              {designer.bio && (
                <p className="text-sm text-warm-grey mt-1 line-clamp-2">
                  {designer.bio}
                </p>
              )}
              <p className="text-sm text-warm-grey mt-1">
                {city.name}, {country.name}
              </p>
            </div>
          </div>
          <div className="mt-3 text-sm font-medium text-terracotta group-hover:text-terracotta-hover transition-colors">
            Смотреть все вещи дизайнера →
          </div>
        </Link>
      </div>

      {/* ═══ Other items by this designer ═════════════════ */}
      {otherItems.length > 0 && (
        <section>
          <h2 className="font-serif text-xl font-semibold mb-4">
            Другие вещи {designer.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherItems.map((other) => (
              <Link
                key={other.id}
                href={`/item/${other.slug}`}
                className="group block rounded-xl border border-sand bg-warm-white p-4 hover:border-sand-hover hover:shadow-md transition-all duration-200"
              >
                <h3 className="font-medium text-charcoal group-hover:text-terracotta transition-colors">
                  {other.name}
                </h3>
                {other.material && (
                  <p className="text-sm text-warm-grey mt-1">
                    {other.material}
                  </p>
                )}
                {other.price_local != null && other.price_local > 0 && (
                  <p className="text-sm text-warm-grey mt-1 tabular-nums">
                    {other.price_local.toLocaleString("ru-RU")}{" "}
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
