import { db } from "@/db";
import { designers, cities } from "@/db/schema";
import {
  createDesigner,
  updateDesigner,
  deleteDesigner,
} from "@/app/admin/actions";
import { DeleteButton } from "@/app/admin/delete-button";
import { DesignerPhotoField } from "./photo-field";

export default async function DesignersPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const editId = edit ? parseInt(edit) : null;

  const [allDesigners, allCities] = await Promise.all([
    db.select().from(designers).all(),
    db.select().from(cities).all(),
  ]);

  const editing = editId
    ? (allDesigners.find((d) => d.id === editId) ?? null)
    : null;

  function cityName(cityId: number | null) {
    if (!cityId) return "—";
    const c = allCities.find((x) => x.id === cityId);
    return c ? c.name : "—";
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Дизайнеры</h1>

      {/* Add Form */}
      <details
        className="mb-8 rounded-xl border border-zinc-200 bg-white p-6"
        open={!editing}
      >
        <summary className="cursor-pointer text-sm font-medium text-zinc-900 select-none">
          + Добавить дизайнера
        </summary>
        <form action={createDesigner} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Имя *
              </label>
              <input
                name="name"
                required
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Slug *
              </label>
              <input
                name="slug"
                required
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Город *
            </label>
            <select
              name="cityId"
              required
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent bg-white"
            >
              <option value="">Выберите город…</option>
              {allCities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Биография
            </label>
            <textarea
              name="bio"
              rows={3}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              История
            </label>
            <textarea
              name="story"
              rows={3}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Why Locals Wear
            </label>
            <textarea
              name="whyLocalsWear"
              rows={3}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Instagram
              </label>
              <input
                name="instagram"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Сайт
              </label>
              <input
                name="website"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Адрес
            </label>
            <input
              name="address"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
            />
          </div>
          <DesignerPhotoField />
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
            <h2 className="text-lg font-semibold">
              Редактировать: {editing.name}
            </h2>
            <a
              href="/admin/designers"
              className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              Отмена
            </a>
          </div>
          <form action={updateDesigner} className="space-y-4">
            <input type="hidden" name="id" value={editing.id} />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Имя *
                </label>
                <input
                  name="name"
                  required
                  defaultValue={editing.name}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Slug *
                </label>
                <input
                  name="slug"
                  required
                  defaultValue={editing.slug}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Город *
              </label>
              <select
                name="cityId"
                required
                defaultValue={editing.cityId ?? ""}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent bg-white"
              >
                <option value="">Выберите город…</option>
                {allCities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Биография
              </label>
              <textarea
                name="bio"
                rows={3}
                defaultValue={editing.bio ?? ""}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                История
              </label>
              <textarea
                name="story"
                rows={3}
                defaultValue={editing.story ?? ""}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Why Locals Wear
              </label>
              <textarea
                name="whyLocalsWear"
                rows={3}
                defaultValue={editing.whyLocalsWear ?? ""}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Instagram
                </label>
                <input
                  name="instagram"
                  defaultValue={editing.instagram ?? ""}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Сайт
                </label>
                <input
                  name="website"
                  defaultValue={editing.website ?? ""}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Адрес
              </label>
              <input
                name="address"
                defaultValue={editing.address ?? ""}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </div>
            <DesignerPhotoField defaultValue={editing.photo} />
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
              <th className="px-4 py-3 text-left font-medium text-zinc-600">
                ID
              </th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">
                Имя
              </th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">
                Slug
              </th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">
                Город
              </th>
              <th className="px-4 py-3 text-right font-medium text-zinc-600">
                Действия
              </th>
            </tr>
          </thead>
          <tbody>
            {allDesigners.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-400">
                  Нет дизайнеров
                </td>
              </tr>
            ) : (
              allDesigners.map((d) => (
                <tr
                  key={d.id}
                  className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors"
                >
                  <td className="px-4 py-3 text-zinc-500">{d.id}</td>
                  <td className="px-4 py-3 font-medium">{d.name}</td>
                  <td className="px-4 py-3 text-zinc-500">{d.slug}</td>
                  <td className="px-4 py-3 text-zinc-500">
                    {cityName(d.cityId)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/admin/designers?edit=${d.id}`}
                        className="rounded-lg border border-zinc-300 px-3 py-1 text-xs text-zinc-700 hover:bg-zinc-100 transition-colors"
                      >
                        Ред.
                      </a>
                      <DeleteButton
                        action={deleteDesigner}
                        id={d.id}
                        label={d.name}
                      />
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
