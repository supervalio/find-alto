import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";

interface Props {
  params: Promise<{ country: string; city: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country: countrySlug, city: citySlug } = await params;
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

  if (!country || !city) return { title: "Город не найден" };

  return {
    title: `${city.name} — ${country.name}`,
    description:
      city.description || `Локальные дизайнеры в ${city.name}, ${country.name}`,
  };
}

export default async function CityPage({ params }: Props) {
  const { country: countrySlug, city: citySlug } = await params;

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

  const { data: cityDesigners, error: desErr } = await supabase
    .from("designers")
    .select("id")
    .eq("city_id", city.id);
  if (desErr) throw desErr;
  const designerIds = (cityDesigners || []).map((d: { id: number }) => d.id);

  let cityCategories: any[] = [];
  if (designerIds.length > 0) {
    const { data: itemsData, error: itemsErr } = await supabase
      .from("items")
      .select("category_id, categories(id, name, slug, name_ru, name_en)")
      .in("designer_id", designerIds);
    if (itemsErr) throw itemsErr;

    const catMap = new Map<number, any>();
    for (const item of itemsData || []) {
      const catArr = item.categories as any[] | null;
      if (!catArr || catArr.length === 0) continue;
      const cat = catArr[0];
      if (!catMap.has(cat.id)) {
        catMap.set(cat.id, {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          nameRu: cat.name_ru,
          nameEn: cat.name_en,
          itemCount: 0,
        });
      }
      catMap.get(cat.id).itemCount++;
    }
    cityCategories = Array.from(catMap.values());
  }

  const { data: cityAds, error: adsError } = await supabase
    .from("ads")
    .select("*")
    .eq("city_id", city.id);
  if (adsError) throw adsError;

  const categoryLabel = (cat: {
    name: string;
    nameRu?: string;
    nameEn?: string;
  }) => cat.nameRu || cat.nameEn || cat.name;

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
      {/* Breadcrumb */}
      <nav className="text-xs tracking-wider text-warm-grey/50 mb-12">
        <Link href="/" className="hover:text-terracotta transition-colors">
          Home
        </Link>
        <span className="mx-2 text-sand-hover">/</span>
        <Link
          href={`/${country.slug}`}
          className="hover:text-terracotta transition-colors"
        >
          {country.name}
        </Link>
        <span className="mx-2 text-sand-hover">/</span>
        <span className="text-charcoal/70">{city.name}</span>
      </nav>

      {/* City header */}
      <header className="mb-20">
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-6">
          {city.name}
        </h1>
        {city.description && (
          <p className="text-warm-grey/70 text-lg md:text-xl max-w-2xl leading-relaxed">
            {city.description}
          </p>
        )}
      </header>

      {/* Sponsored */}
      {(cityAds || []).length > 0 && (
        <section className="mb-20">
          <h2 className="text-xs tracking-[4px] uppercase text-warm-grey/50 mb-10">
            Sponsored
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(cityAds || []).map((ad: any) => (
              <a
                key={ad.id}
                href={ad.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-5 hover:bg-warm-white transition-colors duration-300"
              >
                {ad.photo && (
                  <div className="aspect-[3/1] bg-sand overflow-hidden mb-4">
                    <img
                      src={ad.photo}
                      alt={ad.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h3 className="font-serif text-base font-semibold mb-1">
                  {ad.name}
                </h3>
                {ad.description && (
                  <p className="text-warm-grey/70 text-sm leading-relaxed line-clamp-2">
                    {ad.description}
                  </p>
                )}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      {cityCategories.length > 0 && (
        <section>
          <h2 className="text-xs tracking-[4px] uppercase text-warm-grey/50 mb-10">
            What to buy
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {cityCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/${country.slug}/${city.slug}/${cat.slug}`}
                className="group block p-6 hover:bg-warm-white transition-colors duration-300"
              >
                <h3 className="font-serif text-xl font-semibold mb-2 group-hover:text-terracotta transition-colors">
                  {categoryLabel(cat)}
                </h3>
                <p className="text-warm-grey/50 text-sm">
                  {cat.itemCount} {cat.itemCount === 1 ? "item" : "items"}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {cityCategories.length === 0 && (
        <p className="text-warm-grey/50 text-sm text-center py-16">
          No items yet in this city. Check back soon — we're constantly adding
          new designers.
        </p>
      )}
    </div>
  );
}
