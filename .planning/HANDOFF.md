# Handoff — Find Alto (2026-07-02, thread #4)

> 💡 **Инструкция для нового треда:** этот файл — точка входа. Прочитай его → сразу поймёшь состояние проекта.

## Что за проект

**Find Alto** — гид по локальным дизайнерам одежды из стран СНГ. Next.js 16 + Supabase PostgreSQL + Drizzle ORM + Tailwind 4.
Гео-навигация: Страна → Город → Категория → Вещь. Плюс профили дизайнеров и админка (без аутентификации, открытая).

Репозиторий: `https://github.com/supervalio/find-alto`
Локальный путь: `/Users/valio/codewhale_projects/find-alto/`

## Текущее состояние

### Фаза разработки: 5 (Infrastructure)
- Фазы 1-4 завершены ✅ (28/28 требований, MVP готов)
- 5.1 Миграция SQLite→Supabase ✅
- 5.2 Настройка Supabase ✅ (таблицы, RLS, seed-данные, Storage, API загрузки)
- 5.3 GSD-фазы ✅
- 5.4 Telegram AI-бот ⬜ позже
- **Деплой на Vercel** 🔄 в процессе — билд локально проходит, ждём результата на Vercel

### Что сделано в thread #4
1. **Исправлен Vercel build:** `src/db/index.ts` — ленивая инициализация `@neondatabase/serverless` через `Proxy` + динамический `import()`, чтобы Vercel не пытался загрузить нативные драйверы на этапе сборки
2. Билд проверен локально: проходит с `.env.local` и без него

### История thread #3
1. Подключён Supabase проект «find-alto» (boyvvchzrkaztwuoreeb, eu-west-1)
2. Настроены RLS-политики: публичное чтение + запись на все 7 таблиц
3. Seed-данные залиты через SQL API: 1 страна, 1 город, 4 категории, 4 дизайнера, 8 вещей, 16 фото, 2 рекламных блока
4. Создан Supabase Storage bucket «uploads» с публичным доступом
5. API загрузки фото переписан с локального диска на Supabase Storage
6. Установлен `@supabase/supabase-js`, создан `src/lib/supabase.ts`
7. Исправлены `.get()` → `.limit(1)` во всех страницах (PostgreSQL-совместимость)
8. Исправлена синтаксическая ошибка в `admin/items/page.tsx`
9. Добавлен `force-dynamic` в админку (пререндеринг на билде)
10. Код запушен на GitHub
11. `.env.local` создан с DATABASE_URL, SUPABASE_URL, SUPABASE_ANON_KEY
12. Начат деплой на Vercel — переменные добавлены, билд упал

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
- Storage bucket: `uploads` (public, 10 MB limit, image types only)

### Переменные окружения на Vercel
- `DATABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Что дальше (на выбор)
1. **Vercel** — запушить фикс и проверить деплой
2. **Дизайн** — применить стили из specification.md или дождаться Lovable
3. **Telegram бот** (5.4) — доработать `my-agent/bot.py`
4. **Research** — новые армянские дизайнеры
5. **Фаза 6** — монетизация (featured-дизайнеры, PWA)
