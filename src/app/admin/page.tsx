import { db } from "@/db";
import { countries, cities, categories, designers, items } from "@/db/schema";

export default async function AdminDashboard() {
  const [countryList, cityList, categoryList, designerList, itemList] =
    await Promise.all([
      db.select().from(countries).all(),
      db.select().from(cities).all(),
      db.select().from(categories).all(),
      db.select().from(designers).all(),
      db.select().from(items).all(),
    ]);

  const stats = [
    { label: "Страны", count: countryList.length, href: "/admin/countries" },
    { label: "Города", count: cityList.length, href: "/admin/cities" },
    { label: "Категории", count: categoryList.length, href: "/admin/categories" },
    { label: "Дизайнеры", count: designerList.length, href: "/admin/designers" },
    { label: "Вещи", count: itemList.length, href: "/admin/items" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-8">
        Админ-панель
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => (
          <a
            key={s.label}
            href={s.href}
            className="rounded-xl border border-zinc-200 bg-white p-6 hover:border-zinc-400 transition-colors"
          >
            <div className="text-3xl font-semibold tracking-tight">
              {s.count}
            </div>
            <div className="text-zinc-500 text-sm mt-1">{s.label}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
