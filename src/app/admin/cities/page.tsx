import { db } from "@/db";
import { cities, countries } from "@/db/schema";
import {
  createCity,
  updateCity,
  deleteCity,
} from "@/app/admin/actions";
import { DeleteButton } from "@/app/admin/delete-button";

export default async function CitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const editId = edit ? parseInt(edit) : null;

  const [allCities, allCountries] = await Promise.all([
    db.select().from(cities).all(),
    db.select().from(countries).all(),
  ]);

  const editing = editId
    ? allCities.find((c) => c.id === editId) ?? null
    : null;

  function countryName(countryId: number | null) {
    if (!countryId) return "—";
    const c = allCountries.find((x) => x.id === countryId);
    return c ? c.name : "—";
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Города</h1>

      {/* Add Form */}
      <details className="mb-8 rounded-xl border border-zinc-200 bg-white p-6" open={!editing}>
        <summary className="cursor-pointer text-sm font-medium text-zinc-900 select-none">
          + Добавить город
        </summary>
        <form action={createCity} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Название *</label>
            <input
              name="name"
              required
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Slug *</label>
            <input
              name="slug"
              required
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Описание</label>
            <textarea
              name="description"
              rows={3}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Страна *</label>
            <select
              name="countryId"
              required
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent bg-white"
            >
              <option value="">Выберите страну…</option>
              {allCountries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
          >
            Сохранить
          </button>
        </form>
      </details>

      {/* Edit Form */}
      {editing && (
        <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Редактировать: {editing.name}</h2>
            <a
              href="/admin/cities"
              className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              Отмена
            </a>
          </div>
          <form action={updateCity} className="space-y-4">
            <input type="hidden" name="id" value={editing.id} />
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Название *</label>
              <input
                name="name"
                required
                defaultValue={editing.name}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Slug *</label>
              <input
                name="slug"
                required
                defaultValue={editing.slug}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Описание</label>
              <textarea
                name="description"
                rows={3}
                defaultValue={editing.description}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Страна *</label>
              <select
                name="countryId"
                required
                defaultValue={editing.countryId ?? ""}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent bg-white"
              >
                <option value="">Выберите страну…</option>
                {allCountries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
            >
              Обновить
            </button>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              <th className="px-4 py-3 text-left font-medium text-zinc-600">ID</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">Название</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">Slug</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">Страна</th>
              <th className="px-4 py-3 text-right font-medium text-zinc-600">Действия</th>
            </tr>
          </thead>
          <tbody>
            {allCities.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-400">
                  Нет городов
                </td>
              </tr>
            ) : (
              allCities.map((c) => (
                <tr key={c.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3 text-zinc-500">{c.id}</td>
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-zinc-500">{c.slug}</td>
                  <td className="px-4 py-3 text-zinc-500">{countryName(c.countryId)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/admin/cities?edit=${c.id}`}
                        className="rounded-lg border border-zinc-300 px-3 py-1 text-xs text-zinc-700 hover:bg-zinc-100 transition-colors"
                      >
                        Ред.
                      </a>
                      <DeleteButton action={deleteCity} id={c.id} label={c.name} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
