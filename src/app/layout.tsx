import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: {
    default: "Find Alto — гид по локальной независимой моде",
    template: "%s | Find Alto",
  },
  description:
    "Редакционный гид по локальной независимой моде из стран СНГ. Открывайте дизайнеров, которых трудно найти самостоятельно. Discover local fashion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-charcoal">
        {/* ── Minimal header ───────────────────────────── */}
        <header className="border-b border-sand/50 bg-warm-white">
          <div className="mx-auto max-w-5xl px-6 h-14 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <img
                src="/logo-header.svg"
                alt="Find Alto"
                className="h-8 w-auto"
              />
            </Link>
            <nav className="flex items-center gap-6">
              <Link
                href="/"
                className="text-xs tracking-widest uppercase text-warm-grey/60 hover:text-charcoal transition-colors"
              >
                Home
              </Link>
              <Link
                href="/admin"
                className="text-xs tracking-widest uppercase text-warm-grey/60 hover:text-charcoal transition-colors"
              >
                Admin
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        {/* ── Editorial footer ─────────────────────────── */}
        <footer className="border-t border-sand/50 py-16 text-center">
          <img
            src="/logo.svg"
            alt="Find Alto"
            className="h-12 w-auto mx-auto mb-2"
          />
          <p className="text-[10px] tracking-[3px] uppercase text-warm-grey/40 mb-6">
            discover local fashion
          </p>
          <p className="text-warm-grey/40 text-xs max-w-xs mx-auto leading-relaxed">
            Editorial guide to independent designers around the world
          </p>
        </footer>
      </body>
    </html>
  );
}
