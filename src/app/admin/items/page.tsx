import { db } from "@/db";
import { items, designers, categories, itemPhotos } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createItem, updateItem, deleteItem } from "@/app/admin/actions";
import { DeleteButton } from "@/app/admin/delete-button";
import { ItemPhotoManager } from "./photo-manager";

export default async function ItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const editId = edit ? parseInt(edit) : null;

  const [allItems, allDesigners, allCategories] = await Promise.all([
    db.select().from(items),
    db.select().from(designers),
    db.select().from(categories),
  ]);

  const editing = editId
    ? (allItems.find((i) => i.id === editId) ?? null)
    : null;

  const editingPhotos = editId
    ? await db
        .select()
        .from(itemPhotos)
        .where(eq(itemPhotos.itemId, editId))
        .orderBy(itemPhotos.sortOrder)
    : [];

  function designerName(id: number | null) {
    if (!id) return "—";
    const d = allDesigners.find((x) => x.id === id);
    return d ? d.name : "—";
  }

  function categoryName(id: number | null) {
    if (!id) return "—";
    const c = allCategories.find((x) => x.id === id);
    return c ? c.name : "—";
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Вещи</h1>

      {/* Add Form */}
      <details
        className="mb-8 rounded-xl border border-zinc-200 bg-white p-6"
        open={!editing}
      >
        <summary className="cursor-pointer text-sm font-medium text-zinc-900 select-none">
          + Добавить вещь
        </summary>
        <form action={createItem} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
                Slug *
              </label>
              <input
                name="slug"
                required
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Дизайнер *
              </label>
              <select
                name="designerId"
                required
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent bg-white"
              >
                <option value="">Выберите дизайнера…</option>
                {allDesigners.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Категория *
              </label>
              <select
                name="categoryId"
                required
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent bg-white"
              >
                <option value="">Выберите категорию…</option>
                {allCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
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
              Материал
            </label>
            <input
              name="material"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Цена (лок.)
              </label>
              <input
                name="priceLocal"
                type="number"
                step="any"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Цена (USD)
              </label>
              <input
                name="priceUsd"
                type="number"
                step="any"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Валюта
              </label>
              <input
                name="currency"
                defaultValue="USD"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </div>
          </div>
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
          >
            Сохранить
          </button>
          <p className="text-xs text-zinc-400 mt-2">
            Фото можно будет добавить после создания вещи.
          </p>
        </form>
      </details>

      {/* Edit Form */}
      {editing && (
        <div className="border border-zinc-200 rounded-xl p-6 bg-white">
          <form action={updateItem} className="space-y-4">
            <input type="hidden" name="id" value={editing.id} />
            <div className="grid grid-cols-2 gap-4">
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Дизайнер *
                </label>
                <select
                  name="designerId"
                  required
                  defaultValue={editing.designerId ?? ""}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent bg-white"
                >
                  <option value="">Выберите дизайнера…</option>
                  {allDesigners.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Категория *
                </label>
                <select
                  name="categoryId"
                  required
                  defaultValue={editing.categoryId ?? ""}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent bg-white"
                >
                  <option value="">Выберите категорию…</option>
                  {allCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Описание
              </label>
              <textarea
                name="description"
                rows={3}
                defaultValue={editing.description}
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
                defaultValue={editing.story}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Материал
              </label>
              <input
                name="material"
                defaultValue={editing.material}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Цена (лок.)
                </label>
                <input
                  name="priceLocal"
                  type="number"
                  step="any"
                  defaultValue={editing.priceLocal ?? 0}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Цена (USD)
                </label>
                <input
                  name="priceUsd"
                  type="number"
                  step="any"
                  defaultValue={editing.priceUsd ?? 0}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Валюта
                </label>
                <input
                  name="currency"
                  defaultValue={editing.currency ?? "USD"}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                />
              </div>
            </div>
            {editing && (
              <ItemPhotoManager itemId={editing.id} photos={editingPhotos} />
            )}
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
                Slug
              </th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">
                Дизайнер
              </th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">
                Категория
              </th>
              <th className="px-4 py-3 text-right font-medium text-zinc-600">
                Действия
              </th>
            </tr>
          </thead>
          <tbody>
            {allItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-400">
                  Нет вещей
                </td>
              </tr>
            ) : (
              allItems.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors"
                >
                  <td className="px-4 py-3 text-zinc-500">{item.id}</td>
                  <td className="px-4 py-3 font-medium">{item.name}</td>
                  <td className="px-4 py-3 text-zinc-500">{item.slug}</td>
                  <td className="px-4 py-3 text-zinc-500">
                    {designerName(item.designerId)}
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {categoryName(item.categoryId)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/admin/items?edit=${item.id}`}
                        className="rounded-lg border border-zinc-300 px-3 py-1 text-xs text-zinc-700 hover:bg-zinc-100 transition-colors"
                      >
                        Ред.
                      </a>
                      <DeleteButton
                        action={deleteItem}
                        id={item.id}
                        label={item.name}
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
