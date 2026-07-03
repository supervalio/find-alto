# Find Alto

An editorial guide to independent fashion designers across CIS countries.  
Country by country, designer by designer — discover local fashion.

## What it is

Find Alto helps you discover independent designers, workshops and concept stores — people who cut, sew and ship their own work. Browse by country, find a workshop near you, read the story behind each piece. We don't sell anything. We just connect you with the makers.

- **Editorial, not commercial** — no ads, no affiliate links, no press samples
- **4 countries live:** Armenia, Georgia, Kazakhstan, Uzbekistan
- **English-language public site**, admin panel in Russian

## Status

🔄 **Phase 5** — Infrastructure (Supabase + deployment)

- ✅ 6 public pages, 7 admin pages, photo upload, SEO
- ✅ Supabase PostgreSQL + Drizzle ORM
- ✅ Deployed on Vercel with CI/CD
- ⬜ Telegram AI-bot (planned)

## Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Language:** TypeScript 5
- **Database:** Supabase PostgreSQL + Drizzle ORM
- **Styling:** Tailwind CSS 4
- **Fonts:** Playfair Display (serif), Inter (sans-serif)
- **Hosting:** Vercel

## Quick start

```bash
npm install
# Create .env.local with DATABASE_URL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev     # http://localhost:3000
npm run seed    # seed test data
npm run build   # production build
```

## Route structure

```
/                          → Homepage (logo + country list + stores + events)
/[country]                 → Country page (image, description, designers, stores, events)
/[country]/[city]          → City page (categories, ads)
/[country]/[city]/[category] → Category page (item grid, designers)
/designer/[slug]           → Designer profile (story, items, contacts)
/item/[slug]               → Item detail (photos, price, material, story)
/about                     → About page (minimal)
/admin/*                   → Admin panel (CRUD — in Russian)
/api/upload                → Photo upload API
```

## Documentation

- [SPECIFICATION.md](SPECIFICATION.md) — full project specification
- [.planning/PROJECT.md](.planning/PROJECT.md) — vision and core decisions
- [.planning/ROADMAP.md](.planning/ROADMAP.md) — development phases
- [.planning/REQUIREMENTS.md](.planning/REQUIREMENTS.md) — 28 requirements
- [.planning/architecture.md](.planning/architecture.md) — data model and design system
- [.planning/COMPETITORS.md](.planning/COMPETITORS.md) — competitor analysis
- [.planning/ROI.md](.planning/ROI.md) — monetization scenarios

## License

MIT
