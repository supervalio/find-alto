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

  /* ── Validate country ─────────────────────────── */
  const { data: countryData, error: countryError } = await supabase
    .from("countries")
    .select("*")
    .eq("slug", countrySlug)
    .limit(1);
  if (countryError) throw countryError;
  const [country] = countryData || [];

  if (!country) notFound();

  /* ── Validate city (must belong to country) ──── */
  const { data: cityData, error: cityError } = await supabase
    .from("cities")
    .select("*")
    .eq("slug", citySlug)
    .eq("country_id", country.id)
    .limit(1);
  if (cityError) throw cityError;
  const [city] = cityData || [];

  if (!city) notFound();

  /* ── Categories with items in this city ───────── */
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

    // Group by category and count
    const catMap = new Map<number, any>();
    for (const item of itemsData || []) {
      // Supabase returns nested relations as arrays
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

  /* ── Display name helper ─────────────────────── */
  const categoryLabel = (cat: {
    name: string;
    nameRu?: string;
    nameEn?: string;
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
      {(cityAds || []).length > 0 && (
        <section className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(cityAds || []).map((ad: any) => (
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
