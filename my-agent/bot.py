import asyncio
import os
import socket
import sys
import time

from dotenv import load_dotenv
from openai import OpenAI
from telegram import Update
from telegram.ext import (
    Application,
    CommandHandler,
    ContextTypes,
    MessageHandler,
    filters,
)

load_dotenv()

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
MY_TELEGRAM_USER_ID = int(os.getenv("MY_TELEGRAM_USER_ID", "0"))

# Принудительный DNS-резолвинг (фикс для macOS nohup)
TELEGRAM_API_IP = None
try:
    TELEGRAM_API_IP = socket.gethostbyname("api.telegram.org")
    print(f"DNS: api.telegram.org → {TELEGRAM_API_IP}")
except Exception:
    pass

# DeepSeek client (OpenAI-compatible)
client = OpenAI(
    api_key=DEEPSEEK_API_KEY,
    base_url="https://api.deepseek.com",
)

# Хранилище истории диалога
conversations: dict[int, list[dict]] = {}


def is_me(user_id: int) -> bool:
    return user_id == MY_TELEGRAM_USER_ID


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    if not is_me(user.id):
        return
    conversations.pop(user.id, None)
    await update.message.reply_text(
        "👋 Привет! Я твой AI-агент через DeepSeek.\n"
        "Просто напиши мне вопрос — я передам его в DeepSeek и верну ответ.\n\n"
        "Команды:\n"
        "  /new — начать новый диалог"
    )


async def new_chat(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    if not is_me(user.id):
        return
    conversations.pop(user.id, None)
    await update.message.reply_text("🔄 История диалога очищена. Новый чат.")


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    if not is_me(user.id):
        print(f"Ignored message from user {user.id} (@{user.username})")
        return

    user_text = update.message.text
    user_id = user.id

    await context.bot.send_chat_action(
        chat_id=update.effective_chat.id, action="typing"
    )

    if user_id not in conversations:
        conversations[user_id] = [
            {
                "role": "system",
                "content": (
                    "Ты — полезный AI-агент, встроенный в Telegram-бота. "
                    "Отвечай кратко, по делу, на русском языке. "
                    "Если вопрос неясен — уточни. "
                    "Не используй markdown если не просили."
                ),
            }
        ]

    conversations[user_id].append({"role": "user", "content": user_text})

    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=conversations[user_id],
            max_tokens=2000,
            temperature=0.7,
        )
        reply = response.choices[0].message.content
        conversations[user_id].append({"role": "assistant", "content": reply})

        if len(reply) > 4000:
            for i in range(0, len(reply), 4000):
                await update.message.reply_text(reply[i : i + 4000])
        else:
            await update.message.reply_text(reply)

    except Exception as e:
        await update.message.reply_text(f"❌ Ошибка: {e}")


async def error_handler(update: object, context: ContextTypes.DEFAULT_TYPE):
    """Глобальный обработчик ошибок — логирует и продолжает."""
    print(f"Bot error: {context.error}", file=sys.stderr)


def build_app():
    return Application.builder().token(TELEGRAM_BOT_TOKEN).build()


def main():
    app = build_app()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("new", new_chat))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    app.add_error_handler(error_handler)

    print(f"🤖 Бот запущен. Ожидаю сообщения от user_id={MY_TELEGRAM_USER_ID}...")

    RETRY_DELAY = 5
    MAX_RETRIES = 10

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            app.run_polling(drop_pending_updates=True)
        except Exception as e:
            print(f"Сбой #{attempt}: {e}", file=sys.stderr)
            if attempt < MAX_RETRIES:
                print(f"Перезапуск через {RETRY_DELAY} сек...")
                time.sleep(RETRY_DELAY)
            else:
                print("Исчерпаны попытки перезапуска.", file=sys.stderr)
                raise


if __name__ == "__main__":
    main()
