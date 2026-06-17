import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-24 text-center">
      <h1 className="text-6xl font-semibold tracking-tight text-zinc-300 mb-4">
        404
      </h1>
      <h2 className="text-2xl font-semibold tracking-tight mb-3">
        Страница не найдена
      </h2>
      <p className="text-zinc-500 text-lg mb-8">
        Возможно, она была удалена или вы перешли по неверной ссылке.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
      >
        ← На главную
      </Link>
    </div>
  );
}
