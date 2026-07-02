# Find Alto

Редакционный гид по локальной независимой моде из стран СНГ.  
**Lonely Planet в мире локальной моды** — находим дизайнеров, которых трудно найти самостоятельно.

## Миссия

Find Alto помогает путешественникам открывать талантливых локальных дизайнеров, а дизайнерам — становиться заметнее за пределами своих стран. Мы верим, что будущее моды — за идентичностью, ремеслом и уникальностью.

## Проблема

Найти интересную локальную моду, не тратя часы на поиск и проверку. Проблема не в отсутствии информации — проблема в её избытке. Find Alto решает это редакционным отбором: в каталог попадают только бренды с собственным дизайном и производством, узнаваемым стилем и стабильной работой.

## Для кого

- **Путешественники** — кто покупает вещи вместо сувениров
- **Любители независимой моды** — кто следит за брендами до того, как они станут мейнстримом
- **Стилисты** — кому нужен быстрый доступ к curated-каталогу
- **Fashion-журналисты** — кто ищет темы и истории

## Статус

🔄 **Фаза 5** — Инфраструктура (Supabase + Telegram AI-бот)

- ✅ 6 публичных страниц, 7 админ-страниц, загрузка фото, SEO
- 🌍 4 армянских дизайнера (LOOM Weaving, Ariga Torosian, Kivera Naynomis, RUZANÉ)
- 🗺 Планируется: Грузия, Казахстан, Узбекистан, Украина

## Стек

- **Framework:** Next.js 16 (App Router) + React 19
- **Language:** TypeScript
- **Database:** Supabase PostgreSQL + Drizzle ORM
- **Styling:** Tailwind CSS 4
- **Hosting:** Vercel

## Быстрый старт

```bash
npm install
# Создать .env.local (см. SPECIFICATION.md)
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
├── lib/supabase.ts                    # Supabase client
└── db/                                # Drizzle ORM schema
```

## Документация

- [SPECIFICATION.md](SPECIFICATION.md) — полная спецификация проекта
- [.planning/PROJECT.md](.planning/PROJECT.md) — видение и архитектура
- [.planning/ROADMAP.md](.planning/ROADMAP.md) — фазы разработки
- [.planning/REQUIREMENTS.md](.planning/REQUIREMENTS.md) — 28 требований
- [.planning/COMPETITORS.md](.planning/COMPETITORS.md) — конкурентный анализ
- [.planning/ROI.md](.planning/ROI.md) — сценарии монетизации

## Лицензия

MIT
