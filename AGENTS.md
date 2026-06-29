<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:agent-skills -->
# Agent Skills — Где лежат и как использовать

## Расположение

| Уровень | Путь | Назначение |
|---------|------|------------|
| **Глобальные** | `~/.agents/skills/` | Скиллы, доступные всем проектам |
| **Проектные** | `.codewhale/skills/` | Скиллы, специфичные для Find Alto |

## Как использовать скилл

1. Вызови инструмент `skill` с именем скилла (например, `skill("sp-verification")`)
2. Инструмент вернёт содержимое `SKILL.md` из директории скилла
3. Следуй инструкциям из SKILL.md

## Политика скиллов (из TEAM.md)

- Team Lead **не создаёт** скиллы самостоятельно
- Если скилла нет — Team Lead запрашивает его у пользователя
- Скиллы не коммитятся в git (`.codewhale/` в `.gitignore`)

## Структура скилла

```
.codewhale/skills/<имя-скилла>/
├── SKILL.md          # Инструкции для агента (обязательно)
└── ...               # Дополнительные ресурсы (опционально)
```

## Доступные скиллы

### Глобальные (`~/.agents/skills/`)

| Скилл | Когда использовать |
|-------|-------------------|
| `context-optimization` | Контекст заполнен >60% — сжатие, маскировка длинных ответов, разделение на под-агентов |

### Проектные (`.codewhale/skills/`)

| Скилл | Когда использовать |
|-------|-------------------|
| `gsd-phase` | Управление фазами: добавление, планирование, выполнение задач через агентов, проверка статуса |
<!-- END:agent-skills -->
