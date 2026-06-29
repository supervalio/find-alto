# Handoff — Find Alto (2026-06-29, thread #3)

> 💡 **Инструкция для нового треда:** этот файл — точка входа. Прочитай его → сразу поймёшь состояние проекта.

## Что за проект

**Find Alto** — гид по локальным дизайнерам одежды из стран СНГ. Next.js 16 + Supabase PostgreSQL + Drizzle ORM + Tailwind 4.
Гео-навигация: Страна → Город → Категория → Вещь. Плюс профили дизайнеров и админка (без аутентификации, открытая).

Репозиторий: `https://github.com/supervalio/find-alto` (14 коммитов)
Локальный путь: `/Users/valio/codewhale_projects/find-alto/`

## Текущее состояние

### Фаза разработки: 5 (Infrastructure)
- Фазы 1-4 завершены ✅ (28/28 требований, MVP готов)
- 5.1 Миграция SQLite→Supabase ✅
- 5.2 Настройка Supabase ✅ (таблицы, RLS, seed-данные, Storage, API загрузки)
- 5.3 GSD-фазы ✅
- 5.4 Telegram AI-бот ⬜ позже
- **Деплой на Vercel** 🔄 в процессе — переменные окружения добавлены, но билд упал с ошибкой

### Что сделано в этой сессии (thread #3)
1. Подключён Supabase проект «find-alto» (boyvvchzrkaztwuoreeb, eu-west-1)
2. Настроены RLS-политики: публичное чтение + запись на все 7 таблиц
3. Seed-данные залиты через SQL API: 1 страна, 1 город, 4 категории, 4 дизайнера, 8 вещей, 16 фото, 2 рекламных блока
4. Создан Supabase Storage bucket «uploads» с публичным доступом
5. API загрузки фото переписан с локального диска на Supabase Storage
6. Установлен `@supabase/supabase-js`, создан `src/lib/supabase.ts`
7. Исправлены `.get()` → `.limit(1)` во всех страницах (PostgreSQL-совместимость)
8. Исправлена синтаксическая ошибка в `admin/items/page.tsx`
9. Добавлен `force-dynamic` в админку (пререндеринг на билде)
10. Код запушен на GitHub (коммит b762eac)
11. `.env.local` создан с DATABASE_URL, SUPABASE_URL, SUPABASE_ANON_KEY
12. Начат деплой на Vercel — переменные добавлены, билд упал

### Текущий блокер: Vercel build error
- На Vercel добавлены 3 переменные: `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Билд падает с `Command "npm run build" exited with 1`
- **Нужно:** посмотреть Build Logs в Vercel → найти текст ошибки → исправить

### Данные в Supabase
| Таблица | Строк |
|---------|-------|
| countries | 1 (Армения) |
| cities | 1 (Ереван) |
| categories | 4 |
| designers | 4 |
| items | 8 |
| item_photos | 16 |
| ads | 2 |

### Supabase проект
- ID: `boyvvchzrkaztwuoreeb`
- URL: `https://boyvvchzrkaztwuoreeb.supabase.co`
- Host: `db.boyvvchzrkaztwuoreeb.supabase.co`
- Anon key: `sb_publishable_B-bocbhbV9QDmFblvKeLbg_ywVJZYgR`
- Storage bucket: `uploads` (public, 10 MB limit, image types only)

### Planning-документы (все в `.planning/`):
- PROJECT.md ✅, REQUIREMENTS.md ✅ (28/28), ROADMAP.md ✅
- PLAN.md ✅, ROI.md ✅, COMPETITORS.md ✅
- architecture.md ✅, specification.md ✅, HANDOFF.md ✅

### Что дальше (на выбор)
1. **Vercel** — посмотреть build logs, найти ошибку, исправить, задеплоить
2. **Дизайн** — применить стили из specification.md или дождаться Lovable
3. **Telegram бот** (5.4) — доработать `my-agent/bot.py`
4. **Research** — новые армянские дизайнеры
5. **Фаза 6** — монетизация (featured-дизайнеры, PWA)
