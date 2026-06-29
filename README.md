# Find Alto

Гид по локальным дизайнерам одежды, обуви и аксессуаров из стран СНГ. Каждая вещь — с биографией, историей и культурным контекстом.

## Что это?

Платформа, которая соединяет путешественников и ценителей локальной моды с мастерами, создающими уникальные вещи. Географическая навигация: **Страна → Город → Категория → Вещь**. Плюс профили дизайнеров и админ-панель для управления контентом.

## Статус

🔄 **Фаза 5** — Инфраструктура (Supabase + Telegram AI-бот)

- 28/28 требований выполнены
- 4 армянских дизайнера в каталоге (LOOM Weaving, Ariga Torosian, Kivera Naynomis, RUZANÉ)
- Планируется расширение: Грузия, Казахстан, Узбекистан, Украина

## Стек

- **Framework:** Next.js 16 (App Router) + React 19
- **Language:** TypeScript
- **Database:** Supabase PostgreSQL + Drizzle ORM
- **Styling:** Tailwind CSS 4
- **Hosting:** Vercel

## Быстрый старт

```bash
npm install
cp .env.example .env.local   # добавить DATABASE_URL от Supabase
npm run dev                   # http://localhost:3000
npm run seed                  # наполнить тестовыми данными
```

## Структура

```
src/
├── app/
│   ├── [country]/[city]/[category]/   # Гео-навигация
│   ├── designer/[slug]/               # Профиль дизайнера
│   ├── item/[slug]/                   # Страница вещи
│   └── admin/                         # Админ-панель (CRUD)
├── components/                        # UI-компоненты
└── db/                                # Drizzle ORM schema
```

## Планирование

- [PROJECT.md](.planning/PROJECT.md) — видение и архитектура
- [ROADMAP.md](.planning/ROADMAP.md) — фазы разработки
- [REQUIREMENTS.md](.planning/REQUIREMENTS.md) — 28 требований
- [COMPETITORS.md](.planning/COMPETITORS.md) — конкурентный анализ
- [ROI.md](.planning/ROI.md) — сценарии монетизации

## Лицензия

MIT
