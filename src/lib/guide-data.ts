/* ───────────────────────────────────────────────────
   Static seed data for Find Alto.
   Mirrors Supabase schema — pages try DB first, fall
   back to this when tables are empty.
   ─────────────────────────────────────────────────── */

export interface CountrySeed {
  slug: string;
  name: string;
  cityLabel: string;
  designerCount: number;
  intro: string;
  description: string;
  image: string;
  whatToBuy: string[];
  designerSlugs: string[];
  stores: { name: string; city: string; note: string }[];
  events: { name: string; when: string; where: string }[];
}

export interface DesignerSeed {
  slug: string;
  name: string;
  country: string;
  city: string;
  discipline: string;
  philosophy: string;
  materials: string;
  priceRange: "€" | "€€" | "€€€";
  production: string;
  editorsNotes: string;
  whereToBuy: string[];
  image: string;
  similar: string[];
}

export const seedCountries: CountrySeed[] = [
  {
    slug: "armenia",
    name: "Armenia",
    cityLabel: "Yerevan",
    designerCount: 12,
    intro: "Ancient craft, modern cut.",
    description:
      "A small but deliberate scene: family ateliers, hand-dyed wool, and a new generation translating Armenian ornament into sharp, wearable silhouettes.",
    image: "/Armenia_man.png",
    whatToBuy: [
      "Hand-dyed wool scarves",
      "Silver jewellery with national motifs",
      "Linen shirting",
      "Woven leather accessories",
    ],
    designerSlugs: [],
    stores: [
      {
        name: "Made in Armenia",
        city: "Yerevan",
        note: "A curated space on Abovyan Street — four permanent residents, rotating guests.",
      },
      {
        name: "Pahar",
        city: "Yerevan",
        note: "Ceramics and textiles from independent Armenian makers.",
      },
    ],
    events: [
      { name: "Yerevan Fashion Week", when: "May", where: "TUMO Center" },
    ],
  },
  {
    slug: "georgia",
    name: "Georgia",
    cityLabel: "Tbilisi",
    designerCount: 18,
    intro: "Tbilisi rewrites the rules.",
    description:
      "Georgia's capital is a laboratory of texture and proportion. Young designers work from Soviet-era factory floors, blending wild silhouettes with centuries-old dyeing traditions.",
    image: "/Georgia_bird.jpg",
    whatToBuy: [
      "Deconstructed blazers",
      "Hand-felted wool coats",
      "Vegetable-dyed silk dresses",
      "Enamelled accessories",
    ],
    designerSlugs: [],
    stores: [
      {
        name: "IERI",
        city: "Tbilisi",
        note: "A concept store inside a 19th-century mansion on Atoneli Street.",
      },
      {
        name: "Chaos Concept Store",
        city: "Tbilisi",
        note: "Multi-label — the best single edit of Tbilisi's independent designers.",
      },
    ],
    events: [
      {
        name: "Mercedes-Benz Fashion Week Tbilisi",
        when: "May & November",
        where: "Various venues",
      },
    ],
  },
  {
    slug: "kazakhstan",
    name: "Kazakhstan",
    cityLabel: "Almaty · Astana",
    designerCount: 9,
    intro: "Nomadic roots, urban stitch.",
    description:
      "Kazakhstan's designers look to the steppe and the city in equal measure. Wool, felt, and traditional embroidery meet sharp tailoring and streetwear sensibilities.",
    image: "/Kazakhstan_horseman.png",
    whatToBuy: [
      "Felt coats and vests",
      "Embroidered silk shirting",
      "Hand-tooled leather bags",
      "Traditional-motif knitwear",
    ],
    designerSlugs: [],
    stores: [
      {
        name: "Almaty Concept",
        city: "Almaty",
        note: "Curated space in the Green Bazaar district — feels like a design gallery.",
      },
    ],
    events: [
      {
        name: "Almaty Design Week",
        when: "September",
        where: "Arbat district",
      },
    ],
  },
  {
    slug: "uzbekistan",
    name: "Uzbekistan",
    cityLabel: "Tashkent · Bukhara",
    designerCount: 7,
    intro: "Ikat, reimagined.",
    description:
      "Centuries-old silk weaving traditions meet a quiet, modern sensibility. Uzbek designers honour the ikat while cutting for today — unhurried, respectful, distinct.",
    image: "/Uzbekistan_girl.webp",
    whatToBuy: [
      "Hand-dyed ikat dresses",
      "Suzani-embroidered jackets",
      "Raw silk scarves",
      "Handmade ceramic buttons",
    ],
    designerSlugs: [],
    stores: [
      {
        name: "Human House",
        city: "Tashkent",
        note: "Three floors of Uzbek design — fashion, ceramics, carpets, books.",
      },
    ],
    events: [
      {
        name: "Tashkent Textile Biennale",
        when: "October",
        where: "Palace of International Forums",
      },
    ],
  },
];

export const seedDesigners: DesignerSeed[] = [];
