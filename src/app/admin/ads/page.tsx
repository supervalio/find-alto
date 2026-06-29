import { db } from "@/db";
import { ads, countries, cities } from "@/db/schema";
import {
  createAd,
  updateAd,
  deleteAd,
} from "@/app/admin/actions";
import { DeleteButton } from "@/app/admin/delete-button";
import { AdPhotoField } from "./photo-field";

export default async function AdsPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const editId = edit ? parseInt(edit) : null;

  const [allAds, allCountries, allCities] = await Promise.all([
    db.select().from(ads),
    db.select().from(countries),
    db.select().from(cities),
  ]);

  const editing = editId
    ? (allAds.find((a) => a.id === editId) ?? null)
    : null;

  function countryName(countryId: number | null) {
    if (!countryId) return "—";
    const c = allCountries.find((x) => x.id === countryId);
    return c ? c.name : "—";
  }

  function cityName(cityId: number | null) {
    if (!cityId) return "—";
    const c = allCities.find((x) => x.id === cityId);
    return c ? c.name : "—";
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Реклама</h1>

      {/* Add Form */}
      <details
        className="mb-8 rounded-xl border border-zinc-200 bg-white p-6"
        open={!editing}
      >
        <summary className="cursor-pointer text-sm font-medium text-zinc-900 select-none">
          + Добавить рекламный блок
        </summary>
        <form action={createAd} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Название *
            </label>
            <input
              name="name"
              required
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Описание
            </label>
            <textarea
              name="description"
              rows={3}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Ссылка
            </label>
            <input
              name="link"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Тип ссылки
            </label>
            <select
              name="linkType"
              defaultValue="instagram"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent bg-white"
            >
              <option value="instagram">Instagram</option>
              <option value="website">Website</option>
              <option value="telegram">Telegram</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Страна
            </label>
            <select
              name="countryId"
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
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Город
            </label>
            <select
              name="cityId"
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
          <AdPhotoField />
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
              href="/admin/ads"
              className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              Отмена
            </a>
          </div>
          <form action={updateAd} className="space-y-4">
            <input type="hidden" name="id" value={editing.id} />
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Название *
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
                Описание
              </label>
              <textarea
                name="description"
                rows={3}
                defaultValue={editing.description ?? ""}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Ссылка
              </label>
              <input
                name="link"
                defaultValue={editing.link ?? ""}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Тип ссылки
              </label>
              <select
                name="linkType"
                defaultValue={editing.linkType ?? "instagram"}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent bg-white"
              >
                <option value="instagram">Instagram</option>
                <option value="website">Website</option>
                <option value="telegram">Telegram</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Страна
              </label>
              <select
                name="countryId"
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
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Город
              </label>
              <select
                name="cityId"
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
            <AdPhotoField defaultValue={editing.photo} />
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
                Название
              </th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">
                Ссылка
              </th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">
                Тип
              </th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">
                Страна
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
            {allAds.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-zinc-400">
                  Нет рекламных блоков
                </td>
              </tr>
            ) : (
              allAds.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors"
                >
                  <td className="px-4 py-3 text-zinc-500">{a.id}</td>
                  <td className="px-4 py-3 font-medium">{a.name}</td>
                  <td className="px-4 py-3 text-zinc-500">{a.link}</td>
                  <td className="px-4 py-3 text-zinc-500">{a.linkType}</td>
                  <td className="px-4 py-3 text-zinc-500">
                    {countryName(a.countryId)}
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {cityName(a.cityId)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/admin/ads?edit=${a.id}`}
                        className="rounded-lg border border-zinc-300 px-3 py-1 text-xs text-zinc-700 hover:bg-zinc-100 transition-colors"
                      >
                        Ред.
                      </a>
                      <DeleteButton
                        action={deleteAd}
                        id={a.id}
                        label={a.name}
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
