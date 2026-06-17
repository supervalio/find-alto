"use server";

import { db } from "@/db";
import {
  countries,
  cities,
  categories,
  designers,
  items,
  itemPhotos,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/* ═══════════════════════════════════════════════════════════
   Countries
   ═══════════════════════════════════════════════════════════ */

export async function createCountry(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const description = ((formData.get("description") as string) ?? "").trim();

  if (!name || !slug) return;

  await db.insert(countries).values({ name, slug, description });
  revalidatePath("/admin/countries");
  redirect("/admin/countries");
}

export async function updateCountry(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  const name = (formData.get("name") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const description = ((formData.get("description") as string) ?? "").trim();

  if (!id || !name || !slug) return;

  await db
    .update(countries)
    .set({ name, slug, description })
    .where(eq(countries.id, id));
  revalidatePath("/admin/countries");
  redirect("/admin/countries");
}

export async function deleteCountry(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  if (!id) return;

  await db.delete(countries).where(eq(countries.id, id));
  revalidatePath("/admin/countries");
  redirect("/admin/countries");
}

/* ═══════════════════════════════════════════════════════════
   Cities
   ═══════════════════════════════════════════════════════════ */

export async function createCity(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const description = ((formData.get("description") as string) ?? "").trim();
  const countryId = parseInt(formData.get("countryId") as string);

  if (!name || !slug || !countryId) return;

  await db.insert(cities).values({ name, slug, description, countryId });
  revalidatePath("/admin/cities");
  redirect("/admin/cities");
}

export async function updateCity(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  const name = (formData.get("name") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const description = ((formData.get("description") as string) ?? "").trim();
  const countryId = parseInt(formData.get("countryId") as string);

  if (!id || !name || !slug || !countryId) return;

  await db
    .update(cities)
    .set({ name, slug, description, countryId })
    .where(eq(cities.id, id));
  revalidatePath("/admin/cities");
  redirect("/admin/cities");
}

export async function deleteCity(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  if (!id) return;

  await db.delete(cities).where(eq(cities.id, id));
  revalidatePath("/admin/cities");
  redirect("/admin/cities");
}

/* ═══════════════════════════════════════════════════════════
   Categories
   ═══════════════════════════════════════════════════════════ */

export async function createCategory(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const nameRu = ((formData.get("nameRu") as string) ?? "").trim();
  const nameEn = ((formData.get("nameEn") as string) ?? "").trim();

  if (!name || !slug) return;

  await db.insert(categories).values({ name, slug, nameRu, nameEn });
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategory(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  const name = (formData.get("name") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const nameRu = ((formData.get("nameRu") as string) ?? "").trim();
  const nameEn = ((formData.get("nameEn") as string) ?? "").trim();

  if (!id || !name || !slug) return;

  await db
    .update(categories)
    .set({ name, slug, nameRu, nameEn })
    .where(eq(categories.id, id));
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategory(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  if (!id) return;

  await db.delete(categories).where(eq(categories.id, id));
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

/* ═══════════════════════════════════════════════════════════
   Designers
   ═══════════════════════════════════════════════════════════ */

export async function createDesigner(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const cityId = parseInt(formData.get("cityId") as string);
  const bio = ((formData.get("bio") as string) ?? "").trim();
  const story = ((formData.get("story") as string) ?? "").trim();
  const whyLocalsWear = (
    (formData.get("whyLocalsWear") as string) ?? ""
  ).trim();
  const instagram = ((formData.get("instagram") as string) ?? "").trim();
  const website = ((formData.get("website") as string) ?? "").trim();
  const address = ((formData.get("address") as string) ?? "").trim();
  const photo = ((formData.get("photo") as string) ?? "").trim();

  if (!name || !slug || !cityId) return;

  await db.insert(designers).values({
    name,
    slug,
    cityId,
    bio,
    story,
    whyLocalsWear,
    instagram,
    website,
    address,
    photo,
  });
  revalidatePath("/admin/designers");
  redirect("/admin/designers");
}

export async function updateDesigner(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  const name = (formData.get("name") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const cityId = parseInt(formData.get("cityId") as string);
  const bio = ((formData.get("bio") as string) ?? "").trim();
  const story = ((formData.get("story") as string) ?? "").trim();
  const whyLocalsWear = (
    (formData.get("whyLocalsWear") as string) ?? ""
  ).trim();
  const instagram = ((formData.get("instagram") as string) ?? "").trim();
  const website = ((formData.get("website") as string) ?? "").trim();
  const address = ((formData.get("address") as string) ?? "").trim();
  const photo = ((formData.get("photo") as string) ?? "").trim();

  if (!id || !name || !slug || !cityId) return;

  await db
    .update(designers)
    .set({
      name,
      slug,
      cityId,
      bio,
      story,
      whyLocalsWear,
      instagram,
      website,
      address,
      photo,
    })
    .where(eq(designers.id, id));
  revalidatePath("/admin/designers");
  redirect("/admin/designers");
}

export async function deleteDesigner(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  if (!id) return;

  await db.delete(designers).where(eq(designers.id, id));
  revalidatePath("/admin/designers");
  redirect("/admin/designers");
}

/* ═══════════════════════════════════════════════════════════
   Items
   ═══════════════════════════════════════════════════════════ */

export async function createItem(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const designerId = parseInt(formData.get("designerId") as string);
  const categoryId = parseInt(formData.get("categoryId") as string);
  const description = ((formData.get("description") as string) ?? "").trim();
  const story = ((formData.get("story") as string) ?? "").trim();
  const material = ((formData.get("material") as string) ?? "").trim();
  const priceLocal =
    parseFloat((formData.get("priceLocal") as string) ?? "0") || 0;
  const priceUsd = parseFloat((formData.get("priceUsd") as string) ?? "0") || 0;
  const currency = ((formData.get("currency") as string) ?? "USD").trim();

  if (!name || !slug || !designerId || !categoryId) return;

  await db.insert(items).values({
    name,
    slug,
    designerId,
    categoryId,
    description,
    story,
    material,
    priceLocal,
    priceUsd,
    currency,
  });
  revalidatePath("/admin/items");
  redirect("/admin/items");
}

export async function updateItem(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  const name = (formData.get("name") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const designerId = parseInt(formData.get("designerId") as string);
  const categoryId = parseInt(formData.get("categoryId") as string);
  const description = ((formData.get("description") as string) ?? "").trim();
  const story = ((formData.get("story") as string) ?? "").trim();
  const material = ((formData.get("material") as string) ?? "").trim();
  const priceLocal =
    parseFloat((formData.get("priceLocal") as string) ?? "0") || 0;
  const priceUsd = parseFloat((formData.get("priceUsd") as string) ?? "0") || 0;
  const currency = ((formData.get("currency") as string) ?? "USD").trim();

  if (!id || !name || !slug || !designerId || !categoryId) return;

  await db
    .update(items)
    .set({
      name,
      slug,
      designerId,
      categoryId,
      description,
      story,
      material,
      priceLocal,
      priceUsd,
      currency,
    })
    .where(eq(items.id, id));
  revalidatePath("/admin/items");
  redirect("/admin/items");
}

export async function deleteItem(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  if (!id) return;

  await db.delete(items).where(eq(items.id, id));
  revalidatePath("/admin/items");
  redirect("/admin/items");
}

/* ═══════════════════════════════════════════════════════════
   Item Photos
   ═══════════════════════════════════════════════════════════ */

export async function addItemPhoto(formData: FormData) {
  const itemId = parseInt(formData.get("itemId") as string);
  const url = (formData.get("url") as string)?.trim();
  const alt = ((formData.get("alt") as string) ?? "").trim();

  if (!itemId || !url) return;

  // Get current max sort_order for this item
  const existing = await db
    .select({ maxSort: itemPhotos.sortOrder })
    .from(itemPhotos)
    .where(eq(itemPhotos.itemId, itemId))
    .orderBy(itemPhotos.sortOrder)
    .all();

  const nextSort =
    existing.length > 0 ? (existing[existing.length - 1].maxSort ?? 0) + 1 : 0;

  await db.insert(itemPhotos).values({
    itemId,
    url,
    alt,
    sortOrder: nextSort,
  });

  revalidatePath("/admin/items");
}

export async function deleteItemPhoto(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  if (!id) return;

  await db.delete(itemPhotos).where(eq(itemPhotos.id, id));
  revalidatePath("/admin/items");
}
