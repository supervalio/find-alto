import {
  pgTable,
  text,
  integer,
  boolean,
  doublePrecision,
  bigint,
  timestamp,
} from "drizzle-orm/pg-core";

/* ── Страны ────────────────────────────────────────────── */
export const countries = pgTable("countries", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  image: text("image").default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

/* ── Города ─────────────────────────────────────────────── */
export const cities = pgTable("cities", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  countryId: bigint("country_id", { mode: "number" }).references(
    () => countries.id,
    { onDelete: "cascade" },
  ),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

/* ── Категории ──────────────────────────────────────────── */
export const categories = pgTable("categories", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  nameRu: text("name_ru").notNull().default(""),
  nameEn: text("name_en").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

/* ── Дизайнеры ──────────────────────────────────────────── */
export const designers = pgTable("designers", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  photo: text("photo").notNull().default(""),
  bio: text("bio").notNull().default(""),
  story: text("story").notNull().default(""),
  whyLocalsWear: text("why_locals_wear").notNull().default(""),
  instagram: text("instagram").default(""),
  website: text("website").default(""),
  address: text("address").default(""),
  cityId: bigint("city_id", { mode: "number" }).references(() => cities.id, {
    onDelete: "set null",
  }),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

/* ── Вещи ───────────────────────────────────────────────── */
export const items = pgTable("items", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  story: text("story").notNull().default(""),
  material: text("material").notNull().default(""),
  priceLocal: doublePrecision("price_local").default(0),
  priceUsd: doublePrecision("price_usd").default(0),
  currency: text("currency").default("USD"),
  designerId: bigint("designer_id", { mode: "number" }).references(
    () => designers.id,
    { onDelete: "cascade" },
  ),
  categoryId: bigint("category_id", { mode: "number" }).references(
    () => categories.id,
    { onDelete: "set null" },
  ),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

/* ── Фото вещей ─────────────────────────────────────────── */
export const itemPhotos = pgTable("item_photos", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  itemId: bigint("item_id", { mode: "number" }).references(() => items.id, {
    onDelete: "cascade",
  }),
  url: text("url").notNull(),
  alt: text("alt").default(""),
  sortOrder: integer("sort_order").default(0),
});

/* ── Рекламные блоки ────────────────────────────────────── */
export const ads = pgTable("ads", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  photo: text("photo").notNull().default(""),
  link: text("link").notNull().default(""),
  linkType: text("link_type").default("instagram"),
  countryId: bigint("country_id", { mode: "number" }).references(
    () => countries.id,
    { onDelete: "cascade" },
  ),
  cityId: bigint("city_id", { mode: "number" }).references(() => cities.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
