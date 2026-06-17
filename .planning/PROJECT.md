# PROJECT.md — Shop Locals

## Vision

**Shop Locals** — гид по локальным дизайнерам одежды, обуви и аксессуаров из стран СНГ. Каждая вещь — с биографией, историей и культурным контекстом. Проект соединяет путешественников и ценителей локальной моды с мастерами, создающими уникальные вещи "с душой".

## Core Value Proposition

- **Открытие локальных брендов** вместо масс-маркета
- **Вещи с историей**: не просто товар, а narrative — кто создал, из чего, почему местные это носят
- **Географическая навигация**: Страна → Город → Категория → Вещь
- **Культурный контекст**: почему locals wear this, локальные особенности

## Key Architecture Decisions

| Решение | Обоснование |
|---------|-------------|
| Next.js 16 App Router | Серверные компоненты, server actions, статическая генерация |
| SQLite + Drizzle ORM | Простота деплоя (один файл), никаких внешних БД, миграции в репозитории |
| Tailwind CSS v4 | Утилитарный CSS, минимальный бандл |
| Vercel | Нативный хостинг для Next.js |
| Файловая загрузка фото | `/public/uploads/`, без S3 — простота и нулевая стоимость |
| Нет аутентификации | Админка открыта для контент-менеджеров на раннем этапе |

## Tech Stack

- **Framework:** Next.js 16.2.9 (React 19.2.4)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Database:** SQLite (better-sqlite3) + Drizzle ORM 0.45
- **Hosting:** Vercel
- **Font:** Geist (Sans + Mono)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [country]/          # Страница страны
│   │   └── [city]/         # Страница города
│   │       └── [category]/ # Вещи категории в городе
│   ├── designer/[slug]/    # Профиль дизайнера
│   ├── item/[slug]/        # Детальная страница вещи
│   ├── admin/              # Админ-панель
│   │   ├── countries/      # CRUD стран
│   │   ├── cities/         # CRUD городов
│   │   ├── categories/     # CRUD категорий
│   │   ├── designers/      # CRUD дизайнеров
│   │   └── items/          # CRUD вещей
│   └── api/upload/         # API загрузки фото
├── components/             # Переиспользуемые компоненты
└── db/                     # Drizzle ORM schema + connection
```

## Data Model

- **countries** → cities → designers → items ← categories
- **item_photos** → items
- **ads** → countries / cities (рекламные блоки)
