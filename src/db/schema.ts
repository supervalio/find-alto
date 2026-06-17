import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

/* ── Страны ────────────────────────────────────────────── */
export const countries = sqliteTable("countries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  image: text("image").default(""),
  createdAt: text("created_at").default(sql`(current_timestamp)`),
});

/* ── Города ─────────────────────────────────────────────── */
export const cities = sqliteTable("cities", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  countryId: integer("country_id").references(() => countries.id, {
    onDelete: "cascade",
  }),
  createdAt: text("created_at").default(sql`(current_timestamp)`),
});

/* ── Категории ──────────────────────────────────────────── */
export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  nameRu: text("name_ru").notNull().default(""),
  nameEn: text("name_en").notNull().default(""),
  createdAt: text("created_at").default(sql`(current_timestamp)`),
});

/* ── Дизайнеры ──────────────────────────────────────────── */
export const designers = sqliteTable("designers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  photo: text("photo").notNull().default(""),
  bio: text("bio").notNull().default(""),
  story: text("story").notNull().default(""),
  whyLocalsWear: text("why_locals_wear").notNull().default(""),
  instagram: text("instagram").default(""),
  website: text("website").default(""),
  address: text("address").default(""),
  cityId: integer("city_id").references(() => cities.id, {
    onDelete: "set null",
  }),
  featured: integer("featured", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`(current_timestamp)`),
});

/* ── Вещи ───────────────────────────────────────────────── */
export const items = sqliteTable("items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  story: text("story").notNull().default(""),
  material: text("material").notNull().default(""),
  priceLocal: real("price_local").default(0),
  priceUsd: real("price_usd").default(0),
  currency: text("currency").default("USD"),
  designerId: integer("designer_id").references(() => designers.id, {
    onDelete: "cascade",
  }),
  categoryId: integer("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  createdAt: text("created_at").default(sql`(current_timestamp)`),
});

/* ── Фото вещей ─────────────────────────────────────────── */
export const itemPhotos = sqliteTable("item_photos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  itemId: integer("item_id").references(() => items.id, {
    onDelete: "cascade",
  }),
  url: text("url").notNull(),
  alt: text("alt").default(""),
  sortOrder: integer("sort_order").default(0),
});

/* ── Рекламные блоки ────────────────────────────────────── */
export const ads = sqliteTable("ads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  photo: text("photo").notNull().default(""),
  link: text("link").notNull().default(""),
  linkType: text("link_type").default("instagram"),
  countryId: integer("country_id").references(() => countries.id, {
    onDelete: "cascade",
  }),
  cityId: integer("city_id").references(() => cities.id, {
    onDelete: "cascade",
  }),
  createdAt: text("created_at").default(sql`(current_timestamp)`),
});
