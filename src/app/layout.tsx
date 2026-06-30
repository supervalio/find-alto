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
    default: "Find Alto — гид по локальным дизайнерам",
    template: "%s | Find Alto",
  },
  description:
    "Откройте локальных дизайнеров одежды, обуви и аксессуаров из стран СНГ. Find local.",
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
        <header className="border-b border-sand bg-warm-white">
          <div className="mx-auto max-w-5xl px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.svg" alt="Find Alto" className="h-10 w-auto" />
            </Link>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-sand bg-warm-white py-10 text-center text-sm text-warm-grey">
          <p className="font-serif text-lg text-charcoal mb-1">Find Alto</p>
          <p className="tracking-widest uppercase text-xs">find local</p>
        </footer>
      </body>
    </html>
  );
}
