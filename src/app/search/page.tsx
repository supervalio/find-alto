import Link from "next/link";
import type { Metadata } from "next";
import { seedCountries, seedDesigners, type DesignerSeed } from "@/lib/guide-data";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search independent designers, cities and concept stores across the Find Alto guide.",
};

const categories = ["All", "Clothing", "Shoes", "Bags", "Accessories"];

export default async function SearchPage() {
  // Try Supabase first, merge with seed data
  let allDesigners: DesignerSeed[] = [...seedDesigners];
  try {
    const designerDisciplines: Record<string, string> = {
      armenia: "Womenswear · Craft",
      georgia: "Menswear · Deconstruction",
      kazakhstan: "Womenswear · Nomadic",
      uzbekistan: "Textiles · Silk",
    };
    const { data } = await supabase.from("designers").select("*, cities(name, countries(name, slug))");
    if (data && data.length > 0) {
      for (const d of data) {
        const country = (d as any).cities?.countries?.slug || "";
        allDesigners.push({
          slug: d.slug,
          name: d.name,
          country: (d as any).cities?.countries?.name || "",
          city: (d as any).cities?.name || "",
          discipline: designerDisciplines[country] || "Designer",
          philosophy: d.bio || "",
          materials: "",
          priceRange: "€€",
          production: "",
          editorsNotes: "",
          whereToBuy: [],
          image: d.photo || "",
          similar: [],
        });
      }
    }
  } catch {
    // fall through to seed data
  }

  // Add seed country designers
  for (const c of seedCountries) {
    for (const slug of c.designerSlugs) {
      if (!allDesigners.find((d) => d.slug === slug)) {
        allDesigners.push({
          slug,
          name: slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
          country: c.name,
          city: c.cityLabel.split(" · ")[0],
          discipline: "Designer",
          philosophy: "",
          materials: "",
          priceRange: "€€",
          production: "",
          editorsNotes: "",
          whereToBuy: [],
          image: "",
          similar: [],
        });
      }
    }
  }

  if (allDesigners.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-6 pt-16 pb-24 sm:px-10 md:pt-24">
        <p className="eyebrow">Look for</p>
        <h1 className="mt-4 font-serif text-5xl leading-[1.05] tracking-tight md:text-6xl">
          Search the guide.
        </h1>
        <p className="mt-12 text-muted text-lg">
          No designers in the guide yet. Check back soon.
        </p>
      </div>
    );
  }

  return <SearchClient designers={allDesigners} countries={seedCountries} />;
}

/* ── Client component for interactivity ─────────────── */
import SearchClient from "./search-client";
