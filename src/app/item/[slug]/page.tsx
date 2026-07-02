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
  if (!dbRow) return { title: "Item not found" };

  const designer = (dbRow.designers as any[])?.[0] || {};
  const category = (dbRow.categories as any[])?.[0] || {};
  const city = designer?.cities?.[0] || {};
  const country = city?.countries?.[0] || {};

  const categoryLabel = category.name_ru || category.name;
  return {
    title: dbRow.name,
    description:
      dbRow.description ||
      `${categoryLabel} by ${designer.name} — ${city.name}, ${country.name}`,
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
    <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
      {/* ═══ Breadcrumb ═══════════════════════════════════ */}
      <nav className="text-xs tracking-wider text-warm-grey/50 mb-12 flex flex-wrap items-center gap-x-1.5">
        <Link href="/" className="hover:text-terracotta transition-colors">
          Home
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
        <span className="text-warm-grey">{item.name}</span>
      </nav>

      {/* ═══ Photo Gallery ════════════════════════════════ */}
      {photoCount > 0 && (
        <div className="mb-12">
          {photoCount === 1 ? (
            <div className="overflow-hidden">
              <img
                src={photos[0].url}
                alt={photos[0].alt || item.name}
                className="w-full h-auto max-h-[32rem] object-cover"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="overflow-hidden md:row-span-2">
                <img
                  src={photos[0].url}
                  alt={photos[0].alt || item.name}
                  className="w-full h-full object-cover min-h-[20rem]"
                />
              </div>
              {photos.slice(1).map((photo) => (
                <div key={photo.id} className="overflow-hidden">
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
      <div className="mb-10">
        <div className="flex flex-wrap items-baseline gap-3 mb-3">
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight">
            {item.name}
          </h1>
          <span className="text-xs tracking-[4px] uppercase text-warm-grey/50">
            {category.name_ru || category.name}
          </span>
        </div>
        <p className="text-warm-grey/70">
          by{" "}
          <Link
            href={`/designer/${designer.slug}`}
            className="font-medium text-terracotta hover:text-terracotta-hover transition-colors underline underline-offset-2"
          >
            {designer.name}
          </Link>
        </p>
      </div>

      {/* ═══ Two-column detail section ════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
        {/* ── Price ────────────────────────────────────── */}
        <div>
          <h2 className="text-xs tracking-[4px] uppercase text-warm-grey/50 mb-3">
            Price
          </h2>
          {item.price_local != null && item.price_local > 0 ? (
            <div>
              <p className="text-2xl font-semibold tabular-nums">
                {item.price_local.toLocaleString("ru-RU")}{" "}
                <span className="text-base font-normal text-warm-grey/50">
                  {item.currency || "USD"}
                </span>
              </p>
              {item.price_usd != null && item.price_usd > 0 && (
                <p className="text-sm text-warm-grey/50 mt-1 tabular-nums">
                  ≈{" "}
                  {item.price_usd.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </p>
              )}
            </div>
          ) : (
            <p className="text-warm-grey/50 italic">Price upon request</p>
          )}
        </div>

        {/* ── Location ─────────────────────────────────── */}
        <div>
          <h2 className="text-xs tracking-[4px] uppercase text-warm-grey/50 mb-3">
            Location
          </h2>
          <p className="text-lg font-medium">
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
        <div className="mb-10">
          <h2 className="text-xs tracking-[4px] uppercase text-warm-grey/50 mb-3">
            Material
          </h2>
          <p className="text-warm-grey/70">{item.material}</p>
        </div>
      )}

      {/* ═══ Story ════════════════════════════════════════ */}
      {item.story && (
        <div className="mb-10">
          <h2 className="text-xs tracking-[4px] uppercase text-warm-grey/50 mb-3">
            Story
          </h2>
          <div className="border-l-4 border-terracotta pl-6">
            <p className="text-warm-grey/70 italic leading-relaxed max-w-2xl">
              {item.story}
            </p>
          </div>
        </div>
      )}

      {/* ═══ Description ══════════════════════════════════ */}
      {item.description && (
        <div className="mb-10">
          <p className="text-warm-grey/70 leading-relaxed max-w-2xl">
            {item.description}
          </p>
        </div>
      )}

      {/* ═══ Designer link block ══════════════════════════ */}
      <div className="mb-12">
        <Link
          href={`/designer/${designer.slug}`}
          className="group block hover:bg-warm-white transition-colors duration-300 py-6"
        >
          <h2 className="text-xs tracking-[4px] uppercase text-warm-grey/50 mb-4">
            Designer
          </h2>
          <div className="flex gap-4 items-start">
            <div className="w-16 h-16 bg-warm-white shrink-0 overflow-hidden">
              {designer.photo ? (
                <img
                  src={designer.photo}
                  alt={designer.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-warm-grey/20 text-xs">
                  photo
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-medium group-hover:text-terracotta transition-colors">
                {designer.name}
              </p>
              {designer.bio && (
                <p className="text-sm text-warm-grey/50 mt-1 line-clamp-2">
                  {designer.bio}
                </p>
              )}
              <p className="text-sm text-warm-grey/50 mt-1">
                {city.name}, {country.name}
              </p>
            </div>
          </div>
          <div className="mt-3 text-sm font-medium text-terracotta group-hover:text-terracotta-hover transition-colors">
            View all items →
          </div>
        </Link>
      </div>

      {/* ═══ Other items by this designer ═════════════════ */}
      {otherItems.length > 0 && (
        <section>
          <h2 className="text-xs tracking-[4px] uppercase text-warm-grey/50 mb-4">
            More from {designer.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {otherItems.map((other) => (
              <Link
                key={other.id}
                href={`/item/${other.slug}`}
                className="group block p-4 hover:bg-warm-white transition-colors duration-300"
              >
                <h3 className="font-medium group-hover:text-terracotta transition-colors">
                  {other.name}
                </h3>
                {other.material && (
                  <p className="text-sm text-warm-grey/50 mt-1">
                    {other.material}
                  </p>
                )}
                {other.price_local != null && other.price_local > 0 && (
                  <p className="text-sm text-warm-grey/50 mt-1 tabular-nums">
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
