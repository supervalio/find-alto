import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Find Alto — Discover local fashion",
    template: "%s | Find Alto",
  },
  description:
    "An editorial guide to independent fashion designers, workshops and concept stores around the world. Country by country, quietly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        {/* ── Header ───────────────────────────────────── */}
        <header className="border-b border-sand-hover">
          <div className="mx-auto max-w-7xl flex items-center justify-between gap-4 px-6 py-5 sm:px-10">
            <Link
              href="/"
              className="inline-flex items-baseline gap-2 leading-none"
              aria-label="Find Alto — home"
            >
              <span className="flex flex-col items-end leading-none">
                <span className="text-[0.6rem] tracking-[0.2em] uppercase text-charcoal/70 font-medium">
                  find
                </span>
                <span className="font-serif text-lg font-semibold tracking-tight text-charcoal">
                  ALTO
                </span>
              </span>
              <span
                aria-hidden
                className="font-serif text-[2.4rem] font-medium leading-none text-emerald"
                style={{ transform: "translateY(2px)" }}
              >
                /
              </span>
            </Link>
            <nav className="flex items-center gap-6 sm:gap-8">
              <Link
                href="/"
                className="text-sm text-charcoal/70 hover:text-charcoal transition-colors"
              >
                Home
              </Link>
              <Link
                href="/countries"
                className="text-sm text-charcoal/70 hover:text-charcoal transition-colors"
              >
                Countries
              </Link>
              <Link
                href="/about"
                className="text-sm text-charcoal/70 hover:text-charcoal transition-colors"
              >
                About
              </Link>
              <Link
                href="/search"
                className="text-sm text-charcoal/70 hover:text-charcoal transition-colors"
              >
                Search
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 fade-in">{children}</main>

        {/* ── Footer ───────────────────────────────────── */}
        <footer className="mt-32 border-t border-sand-hover">
          <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10">
            <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
              <div>
                <Link
                  href="/"
                  className="inline-flex items-baseline gap-2 leading-none"
                  aria-label="Find Alto — home"
                >
                  <span className="flex flex-col items-end leading-none">
                    <span className="text-[0.6rem] tracking-[0.2em] uppercase text-warm-grey/70 font-medium">
                      find
                    </span>
                    <span className="font-serif text-lg font-semibold tracking-tight text-charcoal">
                      ALTO
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="font-serif text-[2.4rem] font-medium leading-none text-emerald"
                    style={{ transform: "translateY(2px)" }}
                  >
                    /
                  </span>
                </Link>
                <p className="mt-6 max-w-sm text-sm text-warm-grey/70">
                  An independent, editorial guide to fashion designers,
                  showrooms and concept stores around the world. Read slowly.
                </p>
              </div>
              <div>
                <p className="eyebrow">Guide</p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li>
                    <Link href="/" className="link-underline">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/countries" className="link-underline">
                      Countries
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="link-underline">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/search" className="link-underline">
                      Search
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <p className="eyebrow">Contact</p>
                <ul className="mt-4 space-y-2 text-sm text-warm-grey/70">
                  <li>editors@findalto.com</li>
                  <li>Submissions welcome</li>
                </ul>
              </div>
            </div>
            <div className="mt-16 flex flex-col justify-between gap-4 text-xs text-warm-grey/50 sm:flex-row">
              <p>
                © {new Date().getFullYear()} Find Alto. Independent, ad-free.
              </p>
              <p>Volume 01 — Winter Edition</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
