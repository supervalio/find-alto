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
    "Редакционный гид по локальной независимой моде из стран СНГ. Открывайте дизайнеров, которых трудно найти самостоятельно. Find local.",
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
          <div className="mx-auto max-w-5xl px-4 h-13 flex items-center justify-center">
            <Link
              href="/"
              className="text-sm font-medium tracking-widest uppercase text-charcoal hover:text-terracotta transition-colors"
            >
              Find Alto
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
