import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "../src/db/schema";

const sqlite = new Database("./data/shop-locals.db");
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

const db = drizzle(sqlite, { schema });

async function seed() {
  console.log("🌱 Seeding Shop Locals database...\n");

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
    .returning()
    .all();

  console.log(`  ✓ Categories: ${odezhda.nameRu}, ${obuv.nameRu}, ${sumki.nameRu}, ${aksessuary.nameRu}`);

  /* ── Country: Georgia ───────────────────────── */
  const [georgia] = await db
    .insert(schema.countries)
    .values({
      name: "Грузия",
      slug: "georgia",
      description:
        "Тбилиси — один из самых ярких модных центров постсоветского пространства. Грузинские дизайнеры переосмысляют национальные традиции через современный крой: войлок, шёлк, ручная вышивка и кожа ручной выделки.",
    })
    .returning()
    .all();

  console.log(`  ✓ Country: ${georgia.name}`);

  /* ── Cities ─────────────────────────────────── */
  const [tbilisi, batumi] = await db
    .insert(schema.cities)
    .values([
      {
        name: "Тбилиси",
        slug: "tbilisi",
        description:
          "Креативное сердце Грузии. Здесь традиционные ремесленные техники встречаются с дерзким авангардом. Вернакулярная архитектура старого города — бесконечный источник вдохновения для местных дизайнеров.",
        countryId: georgia.id,
      },
      {
        name: "Батуми",
        slug: "batumi",
        description:
          "Прибрежный город с растущей модной сценой. Аджария привносит в местный дизайн турецкие и средиземноморские мотивы — лёгкие ткани, яркие принты, расслабленный силуэт.",
        countryId: georgia.id,
      },
    ])
    .returning()
    .all();

  console.log(`  ✓ Cities: ${tbilisi.name}, ${batumi.name}`);

  /* ── Designers ──────────────────────────────── */
  const [situationist, dalood, anouki, materiel] = await db
    .insert(schema.designers)
    .values([
      {
        name: "Situationist",
        slug: "situationist",
        photo: "/uploads/situationist.jpg",
        bio: "Основанный в 2015 году Ираклием Русией, Situationist — один из самых заметных грузинских брендов на международной арене. Минималистичный крой, монохромная палитра и архитектурные силуэты.",
        story:
          "Ираклий Русия начинал как стилист в Тбилиси, прежде чем запустить собственный бренд. Его первая коллекция была вдохновлена советским конструктивизмом и грузинской монументальной архитектурой 1970-х.\n\nСегодня Situationist показывается на Неделе моды в Тбилиси и продаётся в концепт-сторах от Берлина до Токио. Бренд принципиально не использует логотипы — вещь говорит сама за себя.",
        whyLocalsWear:
          "Situationist — это выбор тбилисской творческой интеллигенции. Пальто и плащи бренда носят художники, архитекторы и музыканты. Вещь Situationist узнают по силуэту, а не по лейблу — это код «свой-свой» в городе, где стиль значит больше, чем статус.",
        instagram: "situationist_official",
        website: "https://situationist.ge",
        address: "ул. Шардени, 12, Тбилиси",
        cityId: tbilisi.id,
        featured: true,
      },
      {
        name: "Dalood",
        slug: "dalood",
        photo: "/uploads/dalood.jpg",
        bio: "Dalood — бренд, основанный сестрами Датуной и Лали. Их вещи балансируют между женственной романтикой и строгим минимализмом. Натуральные ткани, ручная работа, small-batch production.",
        story:
          "Сёстры Датуна и Лали Суликашвили выросли в семье портных. Их бабушка шила сценические костюмы для тбилисского театра, и любовь к ткани передалась по наследству.\n\nDalood производит каждую коллекцию лимитированным тиражом — от 20 до 50 экземпляров на модель. Все вещи отшиваются в собственном ателье в Тбилиси.",
        whyLocalsWear:
          "Тбилисские модницы ценят Dalood за безупречную посадку и внимание к деталям. Это бренд для тех, кто ищет альтернативу масс-маркету, но не готов жертвовать качеством. Платья Dalood — must-have для грузинских свадеб и семейных торжеств.",
        instagram: "dalood",
        website: "https://dalood.com",
        cityId: tbilisi.id,
        featured: true,
      },
      {
        name: "Anouki",
        slug: "anouki",
        photo: "/uploads/anouki.jpg",
        bio: "Ануки Арешидзе начала с аксессуаров и быстро стала одним из самых коммерчески успешных дизайнеров Грузии. Её обувь и сумки продаются в универмагах от Милана до Дубая.",
        story:
          "Ануки начинала с маленькой мастерской в тбилисском районе Ваке. Её первая коллекция клатчей с грузинским орнаментом разошлась за неделю — и заказы пошли из Европы.\n\nСегодня Anouki — это полноценный lifestyle-бренд: одежда, обувь, аксессуары и даже детская линия. Ануки активно использует грузинские мотивы в принтах, но адаптирует их под глобальный вкус.",
        whyLocalsWear:
          "Anouki — это парадный выход по-тбилисски. Если вы видите девушку в туфлях с узнаваемым принтом Anouki на проспекте Руставели, знайте — она идёт на важную встречу или ужин. Обувь бренда стала символом грузинской модной самоидентификации.",
        instagram: "anoukiofficial",
        website: "https://anouki.ge",
        address: "пр. Руставели, 32, Тбилиси",
        cityId: tbilisi.id,
        featured: true,
      },
      {
        name: "Materiel",
        slug: "materiel",
        photo: "/uploads/materiel.jpg",
        bio: "Materiel — бренд, сочетающий скандинавский минимализм с грузинским темпераментом. Дизайнеры Александр Ахалая и Ладо Бокучава создают вещи для «нового рабочего класса» — архитекторов, редакторов, кураторов.",
        story:
          "Materiel вырос из одноимённого концепт-стора в Тбилиси, который Александр и Ладо открыли в 2012 году. Сначала они продавали скандинавские бренды, затем начали создавать собственные вещи — и быстро поняли, что это и есть их призвание.\n\nБренд известен безупречными брюками, пальто-халатами и кожаными аксессуарами. Materiel шьёт на фабриках в Грузии и Италии, соединяя грузинское качество кожи с итальянским кроем.",
        whyLocalsWear:
          "Materiel — это униформа тбилисского креативного класса. Кожаная куртка Materiel служит 10 лет и становится только лучше. Местные говорят: «Купил Materiel — и забыл о проблеме верхней одежды на decade».",
        instagram: "materiel_tbilisi",
        website: "https://materiel.ge",
        address: "ул. Атонели, 8, Тбилиси",
        cityId: tbilisi.id,
        featured: false,
      },
    ])
    .returning()
    .all();

  console.log(
    `  ✓ Designers: ${situationist.name}, ${dalood.name}, ${anouki.name}, ${materiel.name}`
  );

  /* ── Items ──────────────────────────────────── */
  const items_data = [
    // Situationist
    {
      designerId: situationist.id,
      categoryId: odezhda.id,
      data: {
        name: "Пальто-кокон «Бетон»",
        slug: "palto-kokon-beton-situationist",
        description:
          "Двубортное пальто oversize из плотного итальянского сукна. Архитектурный силуэт, вдохновлённый тбилисским Дворцом спорта.",
        story:
          "Ираклий Русия создал это пальто после прогулки по тбилисскому району Сабуртало. Массивные бетонные формы советского модернизма 1970-х стали отправной точкой для силуэта. Пальто скроено без единой вытачки — форма держится исключительно за счёт конструкции плечевого пояса и плотности ткани. Каждое пальто отшивается в ателье Situationist в Тбилиси три дня — двое суток уходит только на влажно-тепловую обработку.",
        material: "100% итальянская шерсть (Loro Piana), подкладка — вискоза",
        priceLocal: 2800,
        priceUsd: 980,
        currency: "GEL",
      },
    },
    {
      designerId: situationist.id,
      categoryId: aksessuary.id,
      data: {
        name: "Шарф-трансформер «Геометрия»",
        slug: "sharf-geometriya-situationist",
        description:
          "Шерстяной шарф с графичным принтом. Можно носить как шарф, палантин или накидку.",
        story:
          "Принт этого шарфа основан на мозаиках тбилисского метро — абстрактные геометрические формы, типичные для грузинского модернизма. Шарф стал бестселлером Situationist после того, как его заметили на редакторе Vogue Ukraine во время Tbilisi Fashion Week. Вещь-хамелеон: в Тбилиси его носят с кожаной курткой, в Берлине — поверх водолазки.",
        material: "100% мериносовая шерсть",
        priceLocal: 450,
        priceUsd: 158,
        currency: "GEL",
      },
    },
    // Dalood
    {
      designerId: dalood.id,
      categoryId: odezhda.id,
      data: {
        name: "Платье-комбинация «Кахетия»",
        slug: "platie-kombinaciya-kakhetiya-dalood",
        description:
          "Шёлковое платье-комбинация ручной работы. Деликатная вышивка по подолу повторяет мотивы кахетинских виноградных лоз.",
        story:
          "Это платье — оммаж грузинскому виноделию. Вышивка по подолу вручную выполнена мастерицами из Кахетии: каждая лоза и гроздь вышиты шёлковой нитью в три сложения. На одно платье уходит 40 часов ручной работы. Dalood создаёт всего 30 таких платьев в год — каждое пронумеровано и подписано.",
        material: "100% натуральный шёлк (made in Georgia), фурнитура — перламутр",
        priceLocal: 1800,
        priceUsd: 630,
        currency: "GEL",
      },
    },
    {
      designerId: dalood.id,
      categoryId: sumki.id,
      data: {
        name: "Сумка-багет «Вера»",
        slug: "sumka-baget-vera-dalood",
        description:
          "Миниатюрная сумка из мягкой телячьей кожи. Названа в честь Веры — района старого Тбилиси.",
        story:
          "Сумка названа в честь района Вера, где находится ателье Dalood. Форма напоминает традиционные грузинские хурджини (перемётные сумки), но в миниатюрном, современном прочтении. Внутри — карман для карт и отделение для телефона. Ручная прошивка седельным швом — technique, которую грузинские кожевники используют столетиями.",
        material: "Телячья кожа растительного дубления, подкладка — хлопок",
        priceLocal: 850,
        priceUsd: 298,
        currency: "GEL",
      },
    },
    // Anouki
    {
      designerId: anouki.id,
      categoryId: obuv.id,
      data: {
        name: "Туфли «Тбилиси»",
        slug: "tufli-tbilisi-anouki",
        description:
          "Лодочки на среднем каблуке с фирменным принтом Anouki — стилизованный грузинский орнамент.",
        story:
          "Фирменный принт Anouki — это современная интерпретация традиционного грузинского орнамента, который веками использовался в ковроткачестве и чеканке. Ануки Арешидзе адаптировала его, сделав более геометричным и графичным. Эти туфли — самая популярная модель бренда: их носят от Тбилиси до Милана. Колодка разработана специально для Anouki на итальянской фабрике в Марке.",
        material: "Натуральная кожа, кожаная подошва, каблук 6 см",
        priceLocal: 950,
        priceUsd: 333,
        currency: "GEL",
      },
    },
    {
      designerId: anouki.id,
      categoryId: sumki.id,
      data: {
        name: "Клатч «Сванетия»",
        slug: "klatch-svanetiya-anouki",
        description:
          "Вечерний клатч с вышивкой по мотивам сванских башен. Золотая нить по чёрной коже.",
        story:
          "Сванские башни — один из самых узнаваемых символов Грузии. Ануки перенесла их силуэт на вечерний клатч, используя технику золотного шитья — древнее грузинское ремесло, которое почти исчезло в XX веке. Вышивку выполняют вручную мастерицы из Местии. Клатч стал хитом после того, как с ним вышла грузинская певица Нина Сублатти на открытие Tbilisi Fashion Week.",
        material: "Натуральная кожа, золотая нить, подкладка — замша",
        priceLocal: 650,
        priceUsd: 228,
        currency: "GEL",
      },
    },
    // Materiel
    {
      designerId: materiel.id,
      categoryId: odezhda.id,
      data: {
        name: "Кожаная куртка «Тбилиси»",
        slug: "kozhanaya-kurtka-tbilisi-materiel",
        description:
          "Прямая кожаная куртка без подкладки. Минималистичный дизайн, грузинская кожа растительного дубления.",
        story:
          "Materiel закупает кожу на небольшом кожевенном заводе в Кахетии, где до сих пор используют технологию растительного дубления — без хрома и химикатов. Процесс занимает 60 дней. Куртка не имеет подкладки намеренно — designers хотели, чтобы владелец чувствовал натуральную фактуру кожи изнутри. Со временем куртка приобретает индивидуальную патину — каждая вещь становится уникальной.",
        material: "Грузинская кожа растительного дубления, фурнитура — латунь",
        priceLocal: 2200,
        priceUsd: 770,
        currency: "GEL",
      },
    },
    {
      designerId: materiel.id,
      categoryId: aksessuary.id,
      data: {
        name: "Ремень «Индустриальный»",
        slug: "remen-industrialniy-materiel",
        description:
          "Широкий кожаный ремень с латунной пряжкой ручного литья. Унисекс.",
        story:
          "Пряжка этого ремня отлита вручную в мастерской тбилисского ювелира Георгия Картвелишвили. Форма вдохновлена индустриальной архитектурой тбилисского завода «Электровозостроитель». Materiel выпускает ремень ограниченными партиями по 50 штук — каждая пряжка пронумерована. Носят и мужчины, и женщины — фирменный аксессуар, по которому Materiel узнают издалека.",
        material: "Кожа растительного дубления, латунь ручного литья",
        priceLocal: 380,
        priceUsd: 133,
        currency: "GEL",
      },
    },
  ];

  const insertedItems: number[] = [];
  for (const item of items_data) {
    const [inserted] = await db
      .insert(schema.items)
      .values(item.data)
      .returning()
      .all();
    insertedItems.push(inserted.id);
  }

  console.log(`  ✓ Items: ${insertedItems.length} items created`);

  /* ── Item photos ────────────────────────────── */
  const photos: { itemIdx: number; url: string; alt: string }[] = [];
  for (let i = 0; i < insertedItems.length; i++) {
    const idx = insertedItems[i];
    photos.push(
      { itemIdx: idx, url: `/uploads/items/${i + 1}a.jpg`, alt: "Фото 1" },
      { itemIdx: idx, url: `/uploads/items/${i + 1}b.jpg`, alt: "Фото 2" }
    );
  }

  await db.insert(schema.itemPhotos).values(
    photos.map((p, i) => ({
      itemId: p.itemIdx,
      url: p.url,
      alt: p.alt,
      sortOrder: i % 2,
    }))
  );

  console.log(`  ✓ Item photos: ${photos.length} photos created`);

  /* ── Ad blocks ──────────────────────────────── */
  await db.insert(schema.ads).values([
    {
      name: "Кафе «Le Ponchik»",
      description:
        "Лучшие пончики в Тбилиси. Место встречи местных дизайнеров и модной публики.",
      photo: "/uploads/ads/le-ponchik.jpg",
      link: "https://instagram.com/leponchik",
      linkType: "instagram",
      countryId: georgia.id,
      cityId: tbilisi.id,
    },
    {
      name: "Fabrika Tbilisi",
      description:
        "Креативное пространство в бывшей швейной фабрике. Хостел, бары, коворкинг и pop-up магазины грузинских дизайнеров.",
      photo: "/uploads/ads/fabrika.jpg",
      link: "https://instagram.com/fabrikatbilisi",
      linkType: "instagram",
      countryId: georgia.id,
      cityId: tbilisi.id,
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
