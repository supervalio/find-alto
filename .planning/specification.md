# specification.md — Lovable Design Prompt

Copy this entire document into Lovable as the initial prompt for a new project.

---

## PROJECT: Find Alto

A bilingual (Russian + English) editorial web guide to local fashion designers from CIS countries. Think of it as "Afisha" but for independent fashion. Users discover unique clothing, shoes, and accessories made by local designers — each item comes with a cultural story, maker bio, and local context.

### Core Concept
- NOT an e-commerce store. It's an editorial discovery platform.
- Each designer and item has a narrative — who made it, from what materials, why locals wear it.
- Geographic navigation: Country → City → Category → Item.
- Prices shown in local currency (primary) + USD (secondary).

---

## PAGES TO BUILD

### 1. Homepage
- Full-width hero section with tagline: "Find Alto — открой локальную моду"
- Below: grid of country cards (2 columns mobile, 3 desktop)
- Each country card:
  - Large photo (4:3 ratio)
  - Country name (Russian + English)
  - Subtitle: "5 городов · 12 дизайнеров" (city count · designer count)
  - Subtle hover: slight scale up, shadow

### 2. Country Page (e.g., Armenia)
- Breadcrumbs: Главная › Армения
- Full-width country photo hero (max 60vh)
- Country name in large serif
- Description paragraph below hero (2-3 sentences about the fashion scene)
- Section: "Города" — horizontal scroll or grid of city cards
  - Each city card: photo, name, short vibe description
- Section: "Дизайнеры" — grid of designer cards (3 columns desktop)
  - Each card: 1:1 photo, name, city, item count badge
  - "Featured" badge for selected designers (subtle, olive accent)
- Ad block: distinct section with sand background, optional photo + CTA link

### 3. City Page (e.g., Yerevan)
- Breadcrumbs: Главная › Армения › Ереван
- City photo hero
- City description: 1-2 paragraphs about the fashion vibe, key districts
- Category grid: 4 cards — Одежда, Обувь, Сумки, Аксессуары
  - Each card: category icon or photo, name, count ("14 вещей")
  - Clicking leads to category page filtered by this city

### 4. Category Page (e.g., Yerevan › Одежда)
- Breadcrumbs: Главная › Армения › Ереван › Одежда
- Grid of item cards (2 columns mobile, 3 desktop)
- Each item card:
  - Photo (4:5 portrait ratio — fashion photography)
  - Item name
  - Designer name (small, linked)
  - Price block: 24,500 ֏ (large) · ~$65 (smaller, muted)
  - Hover: photo slight zoom, subtle shadow

### 5. Designer Profile (e.g., LOOM Weaving)
- Breadcrumbs: Главная › Армения › Ереван › LOOM Weaving
- Two-column layout desktop (photo left, info right), stacked mobile
- Designer photo: large, 3:4 ratio, editorial quality
- Info column:
  - Name (large serif)
  - City name (small, with location pin)
  - Instagram handle (linked, with icon)
  - Website if exists (linked)
- Bio section: 2-3 sentences about the designer
- Story section: full narrative text (2-3 paragraphs), serif, generous line-height
  - How the brand started, key milestones, creative philosophy
- "Почему местные это носят" block:
  - Pull-quote styling: large serif text, thick cream left border, slight indent
  - Warm, human tone — not marketing copy
- Gallery: "Вещи дизайнера" — grid of item cards (same as category page)
  - Show minimum 3 items, each with photo, name, price

### 6. Item Detail (e.g., LOOM Weaving — Вязаный кардиган)
- Breadcrumbs: Главная › Армения › Ереван › Одежда › Вязаный кардиган
- Photo area:
  - 1 photo: full-width hero, max 70vh
  - 2+ photos: grid (2 columns), first photo larger
  - Click to expand / lightbox
- Below photo, two-column layout:
  - Left column (70%): description, story, material
  - Right column (30%): price block, designer card, category tag
- Price block (sticky on desktop):
  - Local price large: 48,000 ֏
  - USD equivalent smaller, muted: ~$120
  - Currency label
- Material line: "Материал: 100% итальянская шерсть, ручная вязка"
- Description: 1-2 paragraphs
- Story block: pull-quote style, quote from designer or cultural note
- "О дизайнере" card:
  - Small photo thumbnail
  - Name, short bio
  - "Смотреть все вещи →" link
- "Другие вещи этого дизайнера" section:
  - Horizontal scroll mobile, grid desktop
  - Up to 3 items

### 7. Admin Panel
- Sidebar navigation: Дашборд, Страны, Города, Категории, Дизайнеры, Вещи, Реклама
- Dashboard: stat cards — total countries, cities, designers, items, photos
- CRUD pages: clean table layout
  - Columns with sortable headers
  - "Добавить" button top right
  - Each row: edit icon, delete icon
- Upload component: drag & drop zone, image preview, delete button

---

## DESIGN SYSTEM

### Color Palette
```
Page background:  #f5f5f5  (light grey)
Card backgrounds: #ffffff  (white)
Primary accent:   #0d5c46  (dark green)
Body text:        #1a1a1a  (near-black)
Secondary text:   #6b6b6b  (grey)
Borders:          #e5e5e5  (light grey)
Hover states:     #cccccc  (mid grey)
```

### Typography
- **Headings:** Serif font (Playfair Display or Cormorant Garamond), weight 700
- **Body:** Clean sans-serif (Inter or Geist), weight 400-500
- **Russian text support:** Headings in serif, body in sans-serif
- **Scale (px):** 14, 16, 18, 20, 24, 32, 40, 48

### Spacing & Layout
- Max content width: 1200px
- Page padding: 24px mobile, 48px desktop
- Card gaps: 16px mobile, 24px desktop
- Section vertical gaps: 48px mobile, 80px desktop

### UI Patterns
- Breadcrumbs: small text (14px), muted color, `›` separator between levels
- Price display: local currency bold 20px + currency symbol, USD light 14px below
- Badges: rounded pill, small, olive background for "Featured", sand for counts
- Links: terracotta color, no underline by default, underline on hover
- Images: object-fit cover, subtle border-radius (4-8px), lazy loading

---

## SAMPLE DATA (Armenia)

### Country
- **Armenia** — capital Yerevan. A crossroads of Persian, Soviet, and contemporary design. Known for artisanal knitwear, avant-garde womenswear, and handcrafted jewelry.

### Cities
- **Yerevan** — the creative heart. Concept stores on Abovyan and Tumanyan streets. Home of Yerevan Fashion Week. Soviet modernist architecture meets centuries-old craft traditions.

### Categories
- Одежда (Clothing), Обувь (Shoes), Сумки (Bags), Аксессуары (Accessories)

### Designers

**LOOM Weaving** (Inga Manukyan, est. 2014)
- Instagram: @loom_weaving
- Bio: Hand-knit brand by sisters Inga and Elen Manukyan. Redefined Armenian knitwear — not cozy, but bold and avant-garde. Each piece handcrafted by 1-3 artisans.
- Story: Inga studied textile design at the Academy of Arts. It started when she couldn't find a beautiful knitted blanket — so she created her own brand. Now a Yerevan Fashion Week and Kyiv Fashion Week participant.
- Why locals wear it: LOOM Weaving is not "Armenian ornament" literally — it's Armenian quality of handwork elevated to international level.
- Items:
  - "Объёмный кардиган" (Voluminous Cardigan) — 48,000֏ (~$120), Italian merino wool, hand-knit, oversized silhouette
  - "Платье-свитер с бахромой" (Fringe Sweater Dress) — 62,000֏ (~$155), wool blend, fringes hand-tied individually

**Ariga Torosian** (Ariga Torosian, est. 2013)
- Instagram: @ariga_to_
- Bio: Iranian-Armenian designer. Brand at the intersection of Persian and Armenian heritage. Black-and-white palette, architectural silhouettes inspired by Soviet modernism.
- Story: Moved to Yerevan at 19, graduated from Academy of Arts. First creation: fabric shoes. Debuted at Paris Fashion Week with her very first collection. Uses deadstock fabrics from European fashion houses.
- Why locals wear it: "If the cut speaks for itself, why let color shout?" — Ariga's ethos. Made-to-order: prototypes displayed, items sewn after order.
- Items:
  - "Структурный жакет" (Structural Jacket) — 85,000֏ (~$210), deadstock Italian wool, architectural shoulders
  - "Асимметричное платье" (Asymmetric Dress) — 72,000֏ (~$180), deadstock viscose, signature arch motif

**Kivera Naynomis** (Arevik Simonyan)
- Instagram: @kiveranaynomis
- Bio: Avant-garde brand. Deconstructivism, asymmetry, experimental form.
- Items:
  - "Деконструированная рубашка" (Deconstructed Shirt) — 35,000֏ (~$88), cotton, asymmetric hem
  - "Платье-трансформер" (Transformer Dress) — 55,000֏ (~$138), technical fabric, 3 ways to wear

**RUZANÉ** (Ruzanna Vardanyan)
- Bio: Accessories and jewelry designer from Yerevan.
- Items:
  - "Колье 'Арарат'" (Ararat Necklace) — 18,000֏ (~$45), brass, handmade
  - "Серьги 'Гранат'" (Pomegranate Earrings) — 12,000֏ (~$30), silver-plated, enamel

### Ads
- "5Concept Store" — Yerevan's first multi-brand concept store. Абовяна 12. Button: "На карте"
- "Yerevan Fashion Week" — Annual event showcasing Armenian designers. Button: "Подробнее"

---

## DESIGN TONE
- **Editorial, not commercial.** Think Kinfolk magazine meets modern travel guide.
- **Warm and human.** Every photo, every text block should feel like it was curated, not auto-generated.
- **Photography-led.** Images are the hero. Text supports the image, not the other way around.
- **Mobile-first.** Every page must work beautifully on a phone. Desktop is enhanced, not primary.

---

## WHAT TO GENERATE FIRST
1. Homepage with country cards
2. Designer profile page (most complex editorial layout)
3. Item detail page (critical conversion page)
4. Category grid page
5. City page
6. Admin panel dashboard
