import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";

interface Props {
  params: Promise<{ country: string; city: string; category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const {
    country: countrySlug,
    city: citySlug,
    category: categorySlug,
  } = await params;
  const { data: countryData } = await supabase
    .from("countries")
    .select("*")
    .eq("slug", countrySlug)
    .limit(1);
  const country = (countryData || [])[0] || null;

  let city = null;
  if (country) {
    const { data: cityData } = await supabase
      .from("cities")
      .select("*")
      .eq("slug", citySlug)
      .eq("country_id", country.id)
      .limit(1);
    city = (cityData || [])[0] || null;
  }

  const { data: categoryData } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", categorySlug)
    .limit(1);
  const [category] = categoryData || [];

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

  const { data: countryData, error: countryError } = await supabase
    .from("countries")
    .select("*")
    .eq("slug", countrySlug)
    .limit(1);
  if (countryError) throw countryError;
  const [country] = countryData || [];

  if (!country) notFound();

  const { data: cityData, error: cityError } = await supabase
    .from("cities")
    .select("*")
    .eq("slug", citySlug)
    .eq("country_id", country.id)
    .limit(1);
  if (cityError) throw cityError;
  const [city] = cityData || [];

  if (!city) notFound();

  const { data: categoryData, error: categoryError } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", categorySlug)
    .limit(1);
  if (categoryError) throw categoryError;
  const [category] = categoryData || [];

  if (!category) notFound();

  const { data: cityDesigners, error: desErr } = await supabase
    .from("designers")
    .select("id")
    .eq("city_id", city.id);
  if (desErr) throw desErr;
  const designerIds = (cityDesigners || []).map((d: { id: number }) => d.id);

  let categoryItems: any[] = [];
  let categoryDesigners: any[] = [];
  if (designerIds.length > 0) {
    const { data: itemsData, error: itemsErr } = await supabase
      .from("items")
      .select("*, designers(*)")
      .eq("category_id", category.id)
      .in("designer_id", designerIds);
    if (itemsErr) throw itemsErr;

    categoryItems = (itemsData || []).map((row: any) => ({
      item: row,
      designer: row.designers,
    }));

    const seen = new Set<number>();
    for (const row of itemsData || []) {
      if (row.designers && !seen.has(row.designers.id)) {
        seen.add(row.designers.id);
        categoryDesigners.push({ designer: row.designers });
      }
    }
  }

  const categoryLabel = (cat: {
    name: string;
    nameRu: string;
    nameEn: string;
  }) => cat.nameRu || cat.nameEn || cat.name;

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
      {/* Breadcrumb */}
      <nav className="text-xs tracking-wider text-muted/50 mb-12">
        <Link href="/" className="hover:text-accent transition-colors">
          Home
        </Link>
        <span className="mx-2 text-hairline-hover">/</span>
        <Link
          href={`/${country.slug}`}
          className="hover:text-accent transition-colors"
        >
          {country.name}
        </Link>
        <span className="mx-2 text-hairline-hover">/</span>
        <Link
          href={`/${country.slug}/${city.slug}`}
          className="hover:text-accent transition-colors"
        >
          {city.name}
        </Link>
        <span className="mx-2 text-hairline-hover">/</span>
        <span className="text-ink/70">{categoryLabel(category)}</span>
      </nav>

      {/* Category header */}
      <header className="mb-20">
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-4">
          {categoryLabel(category)}
        </h1>
        <p className="text-muted/50 text-sm">
          {city.name}, {country.name}
        </p>
      </header>

      {/* Items */}
      {categoryItems.length > 0 && (
        <section className="mb-20">
          <h2 className="text-xs tracking-[4px] uppercase text-muted/50 mb-10">
            Items ({categoryItems.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {categoryItems.map(({ item, designer }) => (
              <Link
                key={item.id}
                href={`/item/${item.slug}`}
                className="group block p-5 hover:bg-neutral-100 transition-colors duration-300"
              >
                <h3 className="font-serif text-lg font-semibold mb-2 group-hover:text-accent transition-colors">
                  {item.name}
                </h3>
                {item.description && (
                  <p className="text-muted/70 text-sm leading-relaxed line-clamp-2 mb-3">
                    {item.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-accent">
                    {designer.name}
                  </span>
                  {item.priceLocal != null && item.priceLocal > 0 && (
                    <span className="text-sm tabular-nums text-ink/70">
                      {item.priceLocal.toLocaleString()}{" "}
                      {item.currency || "USD"}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Designers in this category */}
      {categoryDesigners.length > 0 && (
        <section>
          <h2 className="text-xs tracking-[4px] uppercase text-muted/50 mb-10">
            Designers in this category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {categoryDesigners.map(({ designer }) => (
              <Link
                key={designer.id}
                href={`/designer/${designer.slug}`}
                className="group flex gap-5 p-5 hover:bg-neutral-100 transition-colors duration-300"
              >
                <div className="w-20 h-20 bg-hairline shrink-0 overflow-hidden flex-shrink-0">
                  {designer.photo ? (
                    <img
                      src={designer.photo}
                      alt={designer.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-hairline-hover/40 text-xl font-serif">
                        {designer.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-serif text-base font-semibold mb-1 group-hover:text-accent transition-colors">
                    {designer.name}
                  </h3>
                  <p className="text-muted/50 text-[11px] tracking-wide uppercase mb-1">
                    {city.name}
                  </p>
                  {designer.bio && (
                    <p className="text-muted/60 text-sm leading-relaxed line-clamp-2">
                      {designer.bio}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {categoryItems.length === 0 && (
        <p className="text-muted/50 text-sm text-center py-16">
          No items in this category for {city.name} yet. Check back soon.
        </p>
      )}
    </div>
  );
}
