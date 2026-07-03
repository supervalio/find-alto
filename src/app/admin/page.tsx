import { supabase } from "@/lib/supabase";

export default async function AdminDashboard() {
  let countriesCount = 0;
  let citiesCount = 0;
  let categoriesCount = 0;
  let designersCount = 0;
  let itemsCount = 0;

  try {
    const [c1, c2, c3, c4, c5] = await Promise.all([
      supabase.from("countries").select("id", { count: "exact", head: true }),
      supabase.from("cities").select("id", { count: "exact", head: true }),
      supabase.from("categories").select("id", { count: "exact", head: true }),
      supabase.from("designers").select("id", { count: "exact", head: true }),
      supabase.from("items").select("id", { count: "exact", head: true }),
    ]);
    if (!c1.error) countriesCount = c1.count ?? 0;
    if (!c2.error) citiesCount = c2.count ?? 0;
    if (!c3.error) categoriesCount = c3.count ?? 0;
    if (!c4.error) designersCount = c4.count ?? 0;
    if (!c5.error) itemsCount = c5.count ?? 0;
  } catch {
    // ignore — show zeros when DB is unavailable
  }

  const stats = [
    { label: "Страны", count: countriesCount, href: "/admin/countries" },
    { label: "Города", count: citiesCount, href: "/admin/cities" },
    { label: "Категории", count: categoriesCount, href: "/admin/categories" },
    { label: "Дизайнеры", count: designersCount, href: "/admin/designers" },
    { label: "Вещи", count: itemsCount, href: "/admin/items" },
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
