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
        <h1 className="text-3xl font-semibold tracking-tight mb-4">
          Find Alto
        </h1>
        <p className="text-zinc-500 text-lg max-w-xl mx-auto">
          Гид по локальным дизайнерам одежды, обуви и аксессуаров из стран СНГ.
        </p>
        <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-xl text-left max-w-2xl mx-auto">
          <p className="text-red-700 text-sm font-medium mb-1">
            ⚠️ Ошибка подключения к базе данных:
          </p>
          <p className="text-red-600 text-xs font-mono break-all">{dbError}</p>
        </div>
      </div>
    );
  }

  if (allCountries.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-24 text-center">
        <h1 className="text-3xl font-semibold tracking-tight mb-4">
          Find Alto
        </h1>
        <p className="text-zinc-500 text-lg max-w-xl mx-auto">
          Гид по локальным дизайнерам одежды, обуви и аксессуаров из стран СНГ.
        </p>
        <p className="text-zinc-400 mt-8">
          Контент появится здесь после наполнения базы данных.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight mb-3">
          Find Alto
        </h1>
        <p className="text-zinc-500 text-lg max-w-2xl">
          Гид по локальным дизайнерам одежды, обуви и аксессуаров из стран СНГ.
          Выберите страну — find local.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allCountries.map((country) => (
          <Link
            key={country.id}
            href={`/${country.slug}`}
            className="group block rounded-xl border border-zinc-200 bg-white p-6 hover:border-zinc-400 transition-colors"
          >
            <h2 className="text-xl font-semibold group-hover:text-zinc-600 transition-colors">
              {country.name}
            </h2>
            {country.image && (
              <div className="w-full aspect-[2/1] rounded-lg bg-zinc-100 overflow-hidden mb-3">
                <img
                  src={country.image}
                  alt={country.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {country.description && (
              <p className="text-zinc-500 text-sm mt-2 line-clamp-2">
                {country.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
