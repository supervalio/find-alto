# Architecture.md — Find Alto

## Tech Stack
- **Framework:** Next.js 16 (App Router) + React 19
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Database:** Supabase PostgreSQL + Drizzle ORM
- **File Storage:** `/public/uploads/` (local) or Supabase Storage
- **Hosting:** Vercel
- **Font:** Geist Sans + Geist Mono (or Serif alternative for headings)

---

## Data Model

```
countries
├── id, name, slug, description, photo, seoTitle, seoDescription
│
├── cities
│   ├── id, name, slug, description, countryId
│
├── designers
│   ├── id, name, slug, photo, bio, story, whyLocalsWear
│   ├── instagram, website, address, cityId, featured (bool)
│   │
│   └── items
│       ├── id, name, slug, description, story, material
│       ├── priceLocal (number), priceUsd (number), currency (string)
│       ├── designerId, categoryId
│       │
│       └── item_photos
│           ├── id, url, alt, sortOrder, itemId
│
├── categories
│   ├── id, name, slug, nameRu, nameEn
│
└── ads
    ├── id, name, description, photo, link, linkType
    ├── countryId (nullable), cityId (nullable)
```

---

## Route Structure

```
/                                          → Homepage (list of countries)
/[country]                                 → Country page (cities + designers)
/[country]/[city]                          → City page (categories)
/[country]/[city]/[category]               → Category page (item grid)
/designer/[slug]                           → Designer profile
/item/[slug]                               → Item detail
/admin                                     → Admin dashboard
/admin/countries                           → CRUD countries
/admin/cities                              → CRUD cities
/admin/categories                          → CRUD categories
/admin/designers                           → CRUD designers
/admin/items                               → CRUD items
/admin/ads                                 → CRUD ad blocks
/api/upload                                → File upload API
```

---

## Page Structure

### 1. Homepage `/`
- Full-width hero with tagline
- Grid of country cards (2-3 columns)
- Each card: country photo, name, city count, designer count

### 2. Country Page `/[country]`
- Breadcrumbs: Home > Country
- Country hero image (full-width)
- Country description (1-2 paragraphs)
- Section: «Города» — city cards in grid
- Section: «Дизайнеры» — featured designers first, then rest
- Ad block (if assigned to country)

### 3. City Page `/[country]/[city]`
- Breadcrumbs: Home > Country > City
- City description
- Category grid: 4 cards — Одежда, Обувь, Сумки, Аксессуары
- Each card shows item count for that city+category
- Ad block (if assigned to city)

### 4. Category Page `/[country]/[city]/[category]`
- Breadcrumbs: Home > Country > City > Category
- Grid of item cards
- Each card: photo, name, designer name, local price (AMD) + USD price
- Click → item detail

### 5. Designer Profile `/designer/[slug]`
- Breadcrumbs: Home > Country > City > Designer
- Designer photo (large, left or top)
- Name, city, Instagram link, website
- Bio (2-3 sentences)
- Story section — full narrative about the brand
- «Почему местные это носят» — pull-quote styled block
- Gallery of designer's items (grid, min 3)
- Each item card: photo, name, price

### 6. Item Detail `/item/[slug]`
- Breadcrumbs: Home > Country > City > Category > Item
- Photo hero (full-width, 1 photo) or gallery (2+ photos in grid)
- Item name, designer name (linked), category
- Price block: AMD (large, primary) + USD (smaller, secondary)
- Material
- Description
- Story block — with quote styling
- «О дизайнере» block — thumbnail, name, short bio, link to profile
- «Другие вещи этого дизайнера» — horizontal scroll or grid (up to 3)

### 7. Admin Panel `/admin`
- Sidebar navigation
- Dashboard: counts of countries, cities, designers, items, photos
- Each CRUD page: table with edit/delete actions, "Add new" button
- Photo upload: drag & drop, preview, delete

---

## Design System

### Colors
| Token | Hex | Usage |
|-------|-----|-------|
| Cream/Off-white | `#FAF8F5` | Page background |
| Warm white | `#FFFDF9` | Card backgrounds |
| Terracotta | `#C4735A` | Primary accent, buttons, links |
| Deep terracotta | `#A85D47` | Button hover |
| Charcoal | `#2D2A26` | Body text |
| Warm grey | `#6B6560` | Secondary text, captions |
| Olive | `#7C8C5E` | Secondary accent, tags |
| Soft sand | `#E8E0D5` | Borders, dividers |
| Dark sand | `#D4C9BC` | Hover states |

### Typography
- **Headings:** Serif font (e.g. Playfair Display or Cormorant Garamond) — 700 weight
- **Body:** Geist Sans — 400/500 weight
- **Russian text:** Same serif for headings, sans-serif for body
- **Scale:** 14/16/18/20/24/32/40/48px

### Spacing
- Page padding: 24px mobile, 48px desktop
- Card gaps: 16px mobile, 24px desktop
- Section gaps: 48px mobile, 80px desktop
- Max content width: 1200px

### Components
- **Breadcrumbs:** Small, muted, with chevron separators `›`
- **Price tag:** Local currency bold/large, USD smaller/translucent
- **Country card:** Large photo (4:3 or 16:9), name overlay or below, stats line
- **Designer card:** Square photo (1:1), name, city, item count
- **Item card:** Photo (4:5 portrait for fashion), name, designer, price
- **Ad block:** Full-width with distinct background (sand), optional photo, CTA link
- **Pull-quote block** («Почему местные это носят»): Large serif text, decorative left border, optional icon
- **Story block:** Longer text with generous line-height, serif
- **Photo hero:** Full-viewport-width image, max height 70vh, name overlay at bottom
- **Admin table:** Clean rows, hover highlight, action buttons (edit/delete)
