import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface Country {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
}

export default async function HomePage() {
  let allCountries: Country[] = [];
  let dbError: string | null = null;

  try {
    const { data, error } = await supabase
      .from("countries")
      .select("*")
      .order("name");
    if (error) throw error;
    allCountries = data || [];
  } catch (err: any) {
    dbError = err?.message || "Unknown database error";
  }

  if (dbError) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-24 text-center">
        <div className="font-sans text-4xl font-extralight text-emerald mb-1">
          /
        </div>
        <p className="text-xs tracking-[4px] uppercase text-warm-grey/50 mb-2">
          find
        </p>
        <h1 className="font-sans text-2xl font-semibold tracking-[6px] text-emerald mb-3">
          ALTO
        </h1>
        <p className="tracking-widest uppercase text-xs text-olive mb-8">
          discover local fashion
        </p>
        <p className="text-warm-grey text-lg max-w-xl mx-auto">
          Редакционный гид по локальной независимой моде из стран СНГ.
        </p>
        <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-xl text-left max-w-2xl mx-auto">
          <p className="text-red-700 text-sm font-medium mb-1">
            Ошибка подключения к базе данных:
          </p>
          <p className="text-red-600 text-xs font-mono break-all">{dbError}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ── Hero: Slash Logo ───────────────────────────── */}
      <section className="bg-warm-white border-b border-sand">
        <div className="mx-auto max-w-5xl px-4 py-28 md:py-36 text-center">
          <div className="font-sans text-6xl md:text-7xl font-extralight text-emerald leading-none mb-1">
            /
          </div>
          <p className="text-xs md:text-sm tracking-[5px] uppercase text-warm-grey/50 mb-2">
            find
          </p>
          <h1 className="font-sans text-3xl md:text-4xl font-semibold tracking-[6px] text-emerald mb-3">
            ALTO
          </h1>
          <p className="tracking-widest uppercase text-xs text-olive mb-10">
            discover local fashion
          </p>
          <p className="text-warm-grey text-base md:text-lg max-w-md mx-auto leading-relaxed">
            Редакционный гид по локальной независимой моде из стран СНГ
          </p>
        </div>
      </section>

      {/* ── Countries Grid ───────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-4 py-16">
        {allCountries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-warm-grey text-lg">
              Контент появится здесь после наполнения базы данных.
            </p>
          </div>
        ) : (
          <>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-8">
              Страны
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCountries.map((country) => (
                <Link
                  key={country.id}
                  href={`/${country.slug}`}
                  className="group block rounded-xl border border-sand bg-warm-white overflow-hidden hover:border-sand-hover hover:shadow-md transition-all duration-200"
                >
                  {country.image && (
                    <div className="w-full aspect-[4/3] bg-sand overflow-hidden">
                      <img
                        src={country.image}
                        alt={country.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-serif text-xl font-semibold text-charcoal group-hover:text-terracotta transition-colors">
                      {country.name}
                    </h3>
                    {country.description && (
                      <p className="text-warm-grey text-sm mt-2 line-clamp-2 leading-relaxed">
                        {country.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
