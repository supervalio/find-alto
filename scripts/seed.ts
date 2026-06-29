import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../src/db/schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

const db = drizzle(pool, { schema });

async function seed() {
  console.log("🌱 Seeding Find Alto database...\n");

  /* ── Categories ─────────────────────────────── */
  const [odezhda, obuv, sumki, aksessuary] = await db
    .insert(schema.categories)
    .values([
      { name: "Одежда", slug: "odezhda", nameRu: "Одежда", nameEn: "Clothing" },
      { name: "Обувь", slug: "obuv", nameRu: "Обувь", nameEn: "Shoes" },
      { name: "Сумки", slug: "sumki", nameRu: "Сумки", nameEn: "Bags" },
      {
        name: "Аксессуары",
        slug: "aksessuary",
        nameRu: "Аксессуары",
        nameEn: "Accessories",
      },
    ])
    .returning();

  console.log(
    `  ✓ Categories: ${odezhda.nameRu}, ${obuv.nameRu}, ${sumki.nameRu}, ${aksessuary.nameRu}`,
  );

  /* ── Country: Armenia ───────────────────────── */
  const [armenia] = await db
    .insert(schema.countries)
    .values({
      name: "Армения",
      slug: "armenia",
      description:
        "Ереван — город, где древние ремесленные традиции встречаются с современным дизайном. Армянские дизайнеры работают с локальными материалами — шерстью, серебром, туфом — и переосмысляют национальное наследие через минималистичный крой и авангардные силуэты. Ковроткачество, вышивка и ювелирное дело — ремёсла с тысячелетней историей — здесь становятся основой для коллекций мирового уровня.",
    })
    .returning();

  console.log(`  ✓ Country: ${armenia.name}`);

  /* ── Cities ─────────────────────────────────── */
  const [yerevan] = await db
    .insert(schema.cities)
    .values([
      {
        name: "Ереван",
        slug: "yerevan",
        description:
          "Розовый город из туфа, где каждый дворик — мастерская. Модная сцена Еревана сосредоточена вокруг Teryan Cultural Center, концепт-сторов на ул. Абовяна и Туманяна, и мультибрендового пространства 5Concept. Здесь традиция не музейный экспонат, а живой материал для авангарда.",
        countryId: armenia.id,
      },
    ])
    .returning();

  console.log(`  ✓ Cities: ${yerevan.name}`);

  /* ── Designers ──────────────────────────────── */
  const [loom, ariga, kivera, ruzane] = await db
    .insert(schema.designers)
    .values([
      {
        name: "LOOM Weaving",
        slug: "loom-weaving",
        photo: "/uploads/loom.jpg",
        bio: "Бренд ручного трикотажа, основанный сёстрами Ингой и Элен Манукян в 2014 году. LOOM Weaving переопределил армянский трикотаж: вместо «уютного и тёплого» — смелый, дерзкий, авангардный. Каждая вещь создаётся вручную в ателье в Ереване.",
        story:
          "Всё началось с поиска идеального вязаного пледа. Инга Манукян, выпускница ереванской Академии художеств по специальности «текстильный дизайн», обошла десятки магазинов и не нашла ничего достойного. Тогда она решила создать свой бренд.\n\nПервое ателье — 10 швейных машин. Инга стояла и смотрела на них, не зная с чего начать. Сегодня LOOM Weaving — один из самых узнаваемых армянских брендов на международной арене. Коллекции показывались на Kyiv Fashion Week (2017) и Yerevan Fashion Week, где итальянский fashion-инфлюенсер назвал LOOM Weaving самым сильным впечатлением.\n\nИнга не делает эскизов — говорит, что «набросок ограничивает». Каждая вещь рождается в процессе: мастер работает с материалом, и форма проявляется сама. Материалы закупаются в Италии — «привыкнув к определённому уровню качества, трудно согласиться на меньшее». Вместе с сестрой Элен Инга также основала 5Concept — первый мультибрендовый магазин армянских дизайнеров.",
        whyLocalsWear:
          "LOOM Weaving — это армянское качество ручной работы, говорящее на международном языке моды. Здесь нет национальных орнаментов «в лоб» — вместо этого армянская идентичность проявляется в подходе к ремеслу: каждая вещь сделана 1-3 мастерами и несёт «энергию и тепло» этих рук. Ереванская молодёжь выбирает LOOM за смелость и непохожесть — в городе, где все знают друг друга, вещь LOOM Weaving видно издалека.",
        instagram: "loom_weaving",
        website: "",
        address: "Ереван, showroom by appointment",
        cityId: yerevan.id,
        featured: true,
      },
      {
        name: "Ariga Torosian",
        slug: "ariga-torosian",
        photo: "/uploads/ariga.jpg",
        bio: "Иранско-армянский дизайнер, основавшая бренд в 2013 году. Чёрно-белая гамма, архитектурные силуэты, вдохновлённые советским модернизмом Еревана и персидской эстетикой. Made-to-order, устойчивая мода — каждая вещь отшивается после заказа.",
        story:
          "Арига Торосян родилась в 1986 году в Тегеране. В 19 лет переехала в Ереван, чтобы учиться в Академии художеств — сначала на графике и скульптуре, затем на фэшн-дизайне. После выпуска в 2011 она вернулась в Иран, но через два года творческий импульс потянул её обратно в Армению.\n\nПервая созданная вещь — не платье, а туфли из ткани, сделанные в маленькой армянской обувной мастерской в Иране. «Я приходила каждый день и смотрела, как мой эскиз превращается в реальный объект».\n\nДебютная коллекция Ariga Torosian была показана на Paris Fashion Week — неслыханный старт для молодого бренда из Армении. С тех пор бренд работает по модели made-to-order: прототипы выставляются, одежда отшивается после получения заказа. Ткани — deadstock европейских модных домов. «Давайте будем честны, нам не нужно столько одежды в гардеробах» — Арига строит бренд на принципах slow fashion.",
        whyLocalsWear:
          "Ariga Torosian — выбор ереванской creative elite. Её вещи не про тренды, а про идентичность: армянская арка как повторяющийся мотив, архитектура как источник силуэта. «Если крой говорит сам, зачем цвету кричать?» — чёрно-белая палитра бренда стала его визуальной подписью. В Ереване вещь Ariga Torosian означает: её владелица понимает разницу между одеждой и высказыванием.",
        instagram: "ariga_to_",
        website: "",
        address: "Ереван",
        cityId: yerevan.id,
        featured: true,
      },
      {
        name: "Kivera Naynomis",
        slug: "kivera-naynomis",
        photo: "/uploads/kivera.jpg",
        bio: "Авангардный бренд из Еревана, основанный Аревик Симонян. Деконструктивизм, асимметричный крой и смелые эксперименты с формой и фактурой.",
        story:
          "Аревик Симонян — одна из самых смелых фигур новой волны армянского дизайна. Её бренд Kivera Naynomis работает на стыке искусства и моды: асимметрия, открытые швы, нарочитая «незавершённость» как эстетический приём.\n\nБренд регулярно участвует в Yerevan Fashion Week и представлен в ключевых концепт-сторах города.",
        whyLocalsWear:
          "Kivera Naynomis носят те, для кого одежда — способ мышления. В Ереване вещи бренда появляются на открытиях выставок, в барах на ул. Сарьяна, на Yerevan Jazz Festival. Это выбор поколения, которое не ждёт одобрения извне.",
        instagram: "kiveranaynomis",
        website: "",
        address: "Ереван",
        cityId: yerevan.id,
        featured: true,
      },
      {
        name: "RUZANÉ",
        slug: "ruzane",
        photo: "/uploads/ruzane.jpg",
        bio: "Ювелирный бренд Рузанны Варданян из Еревана. Аксессуары и украшения на стыке традиционных армянских ювелирных техник и современного минимализма.",
        story:
          "Рузанна Варданян создаёт украшения, вдохновлённые армянской культурой и природой. Её работы отличаются чистотой линий и вниманием к деталям — каждая вещь проходит полный цикл ручной работы от эскиза до финальной полировки.",
        whyLocalsWear:
          "RUZANÉ — это украшения, которые носят каждый день. Достаточно минималистичны для повседневной жизни, достаточно осмысленны, чтобы быть талисманом.",
        instagram: "",
        website: "",
        address: "Ереван",
        cityId: yerevan.id,
        featured: false,
      },
    ])
    .returning();

  console.log(
    `  ✓ Designers: ${loom.name}, ${ariga.name}, ${kivera.name}, ${ruzane.name}`,
  );

  /* ── Items ──────────────────────────────────── */
  const items_data: {
    designerId: number;
    categoryId: number;
    data: typeof schema.items.$inferInsert;
  }[] = [
    // ── LOOM Weaving ─────────────────────────────
    {
      designerId: loom.id,
      categoryId: odezhda.id,
      data: {
        name: "Кардиган «Ереван»",
        slug: "kardigan-yerevan-loom",
        description:
          "Вязаный кардиган oversize с объёмными рукавами и ручным плетением по подолу. Визитная карточка LOOM Weaving.",
        story:
          "Этот кардиган был одной из первых вещей LOOM Weaving, которую Инга Манукян увидела на прохожих в центре Еревана. «Я шла по городу и замечала его на людях — даже издалека узнавала свою работу, её невозможно спутать с попытками других брендов повторить». Кардиган вяжется вручную одним мастером, процесс занимает 5 дней. Хлопковая тесьма по подолу плетётся отдельно и вшивается вручную.",
        material:
          "Итальянская мериносовая шерсть, хлопковая тесьма ручного плетения",
        priceLocal: 120000,
        priceUsd: 300,
        currency: "AMD",
      },
    },
    {
      designerId: loom.id,
      categoryId: aksessuary.id,
      data: {
        name: "Шарф «Фриволите»",
        slug: "sharf-frivolite-loom",
        description:
          "Шерстяной шарф с элементами фриволите — старинной техники челночного кружева. Премьера коллекции Yerevan Fashion Week 2024.",
        story:
          "Фриволите (tatting) — техника плетения кружева с помощью челнока, почти забытая в Армении. Инга Манукян возродила её для своей коллекции 2024 года, показанной на Yerevan Fashion Week. «Каждая вещь сделана одним-тремя мастерами, и каждый стежок несёт эту энергию и тепло». Шарф плетётся вручную 3 дня.",
        material: "Итальянская шерсть, хлопковое фриволите ручной работы",
        priceLocal: 45000,
        priceUsd: 112,
        currency: "AMD",
      },
    },
    // ── Ariga Torosian ──────────────────────────
    {
      designerId: ariga.id,
      categoryId: odezhda.id,
      data: {
        name: "Платье «Арка»",
        slug: "platie-arka-ariga",
        description:
          "Платье архитектурного кроя с армянской аркой — повторяющимся мотивом бренда. Чёрный шёлк, чистые линии.",
        story:
          "Армянская арка — единственный мотив, который Арига Торосян считает постоянным в своём творчестве. «Я бы не сказала, что один элемент определяет мой бренд, но эти изгибы, эти архитектурные дуги постоянно возвращаются». Платье было показано в коллекции, вдохновлённой советским модернизмом Еревана. Крой строится без вытачек — форма держится за счёт архитектуры швов.",
        material: "100% натуральный шёлк (deadstock итальянской фабрики)",
        priceLocal: 220000,
        priceUsd: 550,
        currency: "AMD",
      },
    },
    {
      designerId: ariga.id,
      categoryId: obuv.id,
      data: {
        name: "Туфли «Ереван»",
        slug: "tufli-yerevan-ariga",
        description:
          "Туфли из фактурной ткани. Отсылка к самой первой вещи, созданной Аригой Торосян — тканевым туфлям.",
        story:
          "Первая вещь, которую Арига создала как дизайнер — не платье, а туфли из ткани. Они были сделаны в маленькой армянской обувной мастерской в Иране. «Я приходила каждый день и смотрела, как мой эскиз превращается в материальный объект». С тех пор limited-edition обувь остаётся частью каждой коллекции бренда. Как и вся одежда Ariga Torosian, туфли производятся по модели made-to-order.",
        material: "Фактурный текстиль, кожаная подошва",
        priceLocal: 160000,
        priceUsd: 400,
        currency: "AMD",
      },
    },
    // ── Kivera Naynomis ────────────────────────
    {
      designerId: kivera.id,
      categoryId: odezhda.id,
      data: {
        name: "Пиджак «Деконструкция»",
        slug: "pidzhak-dekonstruktsiya-kivera",
        description:
          "Асимметричный пиджак с открытыми швами и нарочито грубой обработкой краёв. Три панели из разных тканей, соединённые вручную.",
        story:
          "Деконструктивизм — ключевой метод Kivera Naynomis. Этот пиджак собран из трёх панелей разных тканей, соединённых контрастной нитью. Открытые швы — не небрежность, а эстетический приём: вместо того чтобы прятать конструкцию, бренд выводит её на первый план. Каждый пиджак собирается в ателье вручную.",
        material: "Костюмная шерсть, хлопок, фактурный текстиль",
        priceLocal: 140000,
        priceUsd: 350,
        currency: "AMD",
      },
    },
    {
      designerId: kivera.id,
      categoryId: odezhda.id,
      data: {
        name: "Платье «Асимметрия»",
        slug: "platie-asimmetriya-kivera",
        description:
          "Деконструированное платье с асимметричным подолом. Комбинация матовых и блестящих фактур.",
        story:
          "Платье построено на контрасте: матовый хлопок встречается с блестящим шёлком, прямая линия плеча ломается асимметрией подола. Идея — в том, что женщина не обязана быть симметричной и «правильной». Платье было показано на Yerevan Fashion Week и стало одним из самых обсуждаемых образов показа.",
        material: "Хлопок, шёлк, ручная сборка",
        priceLocal: 160000,
        priceUsd: 400,
        currency: "AMD",
      },
    },
    // ── RUZANÉ ──────────────────────────────────
    {
      designerId: ruzane.id,
      categoryId: aksessuary.id,
      data: {
        name: "Серьги «Гранат»",
        slug: "sergi-granat-ruzane",
        description:
          "Серебряные серьги ручной работы в форме плодов граната — символа Армении. Минималистичное исполнение, ювелирная точность.",
        story:
          "Гранат — один из главных символов Армении: плодородие, семья, изобилие. Рузанна Варданян создала эти серьги как современное прочтение традиционной символики — без пафоса и сувенирности. Каждая пара отливается и полируется вручную в ереванской мастерской.",
        material: "Серебро 925, ручная работа",
        priceLocal: 38000,
        priceUsd: 95,
        currency: "AMD",
      },
    },
    {
      designerId: ruzane.id,
      categoryId: aksessuary.id,
      data: {
        name: "Браслет «Хачкар»",
        slug: "braslet-khachkar-ruzane",
        description:
          "Серебряный браслет с гравировкой, вдохновлённой кружевной резьбой армянских хачкаров.",
        story:
          "Хачкары — каменные стелы с кружевной резьбой, уникальное явление армянской средневековой культуры. Рузанна перенесла их геометрию в ювелирный масштаб: браслет повторяет структуру хачкара — центральный крест в окружении орнамента. Ручная гравировка занимает несколько дней.",
        material: "Серебро 925, ручная гравировка",
        priceLocal: 52000,
        priceUsd: 130,
        currency: "AMD",
      },
    },
  ];

  const insertedItems: number[] = [];
  for (const item of items_data) {
    const [inserted] = await db
      .insert(schema.items)
      .values(item.data)
      .returning();
    insertedItems.push(inserted.id);
  }

  console.log(`  ✓ Items: ${insertedItems.length} items created`);

  /* ── Item photos ────────────────────────────── */
  const photos: { itemIdx: number; url: string; alt: string }[] = [];
  for (let i = 0; i < insertedItems.length; i++) {
    const idx = insertedItems[i];
    photos.push(
      { itemIdx: idx, url: `/uploads/items/${i + 1}a.jpg`, alt: "Фото 1" },
      { itemIdx: idx, url: `/uploads/items/${i + 1}b.jpg`, alt: "Фото 2" },
    );
  }

  await db.insert(schema.itemPhotos).values(
    photos.map((p, i) => ({
      itemId: p.itemIdx,
      url: p.url,
      alt: p.alt,
      sortOrder: i % 2,
    })),
  );

  console.log(`  ✓ Item photos: ${photos.length} photos created`);

  /* ── Ad blocks ──────────────────────────────── */
  await db.insert(schema.ads).values([
    {
      name: "5Concept Store",
      description:
        "Первый армянский мультибрендовый концепт-стор, основанный Ингой Манукян (LOOM Weaving). Пространство, где представлены десятки локальных дизайнеров.",
      photo: "/uploads/ads/5concept.jpg",
      link: "https://instagram.com/5conceptstore_",
      linkType: "instagram",
      countryId: armenia.id,
      cityId: yerevan.id,
    },
    {
      name: "Cone Yerevan",
      description:
        "Концепт-стор в Ереване, представляющий подборку армянских дизайнеров: LOOM Weaving, Ariga Torosian и других.",
      photo: "/uploads/ads/cone.jpg",
      link: "https://instagram.com/cone.yerevan",
      linkType: "instagram",
      countryId: armenia.id,
      cityId: yerevan.id,
    },
  ]);

  console.log("  ✓ Ad blocks: 2 created");
  console.log("\n✅ Seed complete!");
  console.log("   Start with: npm run dev");
}

seed().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
