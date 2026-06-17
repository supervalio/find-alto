import Link from "next/link";
import { db } from "@/db";
import { countries } from "@/db/schema";

export default async function HomePage() {
  const allCountries = await db.select().from(countries).all();

  if (allCountries.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-24 text-center">
        <h1 className="text-3xl font-semibold tracking-tight mb-4">
          Shop Locals
        </h1>
        <p className="text-zinc-500 text-lg">
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
          Shop Locals
        </h1>
        <p className="text-zinc-500 text-lg max-w-2xl">
          Гид по локальным дизайнерам одежды, обуви и аксессуаров из стран СНГ.
          Выберите страну, чтобы открыть для себя вещи с биографией.
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
