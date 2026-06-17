import Link from "next/link";

const navItems = [
  { href: "/admin", label: "Дашборд" },
  { href: "/admin/countries", label: "Страны" },
  { href: "/admin/cities", label: "Города" },
  { href: "/admin/categories", label: "Категории" },
  { href: "/admin/designers", label: "Дизайнеры" },
  { href: "/admin/items", label: "Вещи" },
  { href: "/admin/ads", label: "Реклама" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="w-48 shrink-0">
          <nav className="sticky top-8">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
