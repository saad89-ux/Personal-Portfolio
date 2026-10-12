export type PortfolioItem = {
  id: string;
  title: string;
  image: string;
  coverColor: string;
  aspect?: string;
};

export type PortfolioCollection = {
  slug: string;
  title: string;
  category: string;
  coverColor: string;
  coverMark: string;
  heroImage: string;
  items: PortfolioItem[];
  href: string;
};

export type BrandMedia = {
  id: string;
  title: string;
  type: "image" | "video";
  src: string;
  poster?: string;
  bg?: string;
  aspect?: string;
};

export type BrandBlock =
  | { kind: "text"; heading: string; paragraphs: string[] }
  | { kind: "full"; media: BrandMedia }
  | { kind: "pair"; media: [BrandMedia, BrandMedia]; aspect?: string }
  | { kind: "video"; media: BrandMedia };

export type Brand = PortfolioCollection & {
  category: "Brand Identity";
  tagline: string;
  services: string[];
  year: string;
  washColor: string;
  blocks: BrandBlock[];
};

function items(prefix: string, titles: string[], colors: string[], aspects: string[]): PortfolioItem[] {
  return titles.map((title, index) => ({
    id: `${prefix}-${index + 1}`,
    title,
    image: `/mock/${prefix}-${index + 1}.svg`,
    coverColor: colors[index % colors.length],
    aspect: aspects[index % aspects.length],
  }));
}

type MockBrandInput = {
  slug: string;
  title: string;
  coverColor: string;
  coverMark: string;
  heroImage: string;
  prefix: string;
  itemTitles: string[];
  itemColors: string[];
  itemAspects: string[];
  tagline: string;
  services: string[];
  year: string;
  washColor: string;
  artDirection: string[];
  colorStory: string;
  creativeProcess: string[];
  imagePairs: [[number, number], [number, number], [number, number]];
  fullImages: [number, number];
};

function createMockBrand(input: MockBrandInput): Brand {
  const brandItems = items(input.prefix, input.itemTitles, input.itemColors, input.itemAspects);
  const imageMedia = (index: number): BrandMedia => {
    const item = brandItems[index];
    return { id: item.id, title: item.title, type: "image", src: item.image, bg: item.coverColor, aspect: item.aspect };
  };
  const video: BrandMedia = { id: `${input.slug}-film`, title: `${input.title} brand film`, type: "video", src: `/mock/video/${input.slug}.mp4`, poster: input.heroImage, bg: input.coverColor, aspect: "16 / 9" };
  return {
    slug: input.slug, title: input.title, category: "Brand Identity", coverColor: input.coverColor, coverMark: input.coverMark,
    heroImage: input.heroImage, href: `/work/brand-identity/${input.slug}`, items: brandItems,
    tagline: input.tagline, services: input.services, year: input.year, washColor: input.washColor,
    blocks: [
      { kind: "text", heading: "Art Direction", paragraphs: input.artDirection },
      { kind: "pair", media: [imageMedia(input.imagePairs[0][0]), imageMedia(input.imagePairs[0][1])], aspect: brandItems[input.imagePairs[0][0]].aspect },
      { kind: "text", heading: "Colour", paragraphs: [input.colorStory] },
      { kind: "full", media: imageMedia(input.fullImages[0]) },
      { kind: "pair", media: [imageMedia(input.imagePairs[1][0]), imageMedia(input.imagePairs[1][1])], aspect: brandItems[input.imagePairs[1][0]].aspect },
      { kind: "text", heading: "Creative Process", paragraphs: input.creativeProcess },
      { kind: "full", media: imageMedia(input.fullImages[1]) },
      { kind: "pair", media: [imageMedia(input.imagePairs[2][0]), imageMedia(input.imagePairs[2][1])], aspect: brandItems[input.imagePairs[2][0]].aspect },
      { kind: "video", media: video },
      { kind: "full", media: { id: `${input.slug}-closing`, title: `${input.title} campaign`, type: "image", src: input.heroImage, bg: input.coverColor, aspect: "16 / 9" } },
    ],
  };
}

const sophiaItems: PortfolioItem[] = [
  { id: "sophia-identity", title: "Brand identity", image: "/mock/sophia-identity.jpg", coverColor: "#1c3028", aspect: "1 / 1" },
  { id: "sophia-interior", title: "Interior identity", image: "/mock/sophia-interior.jpg", coverColor: "#293329", aspect: "1 / 1" },
  { id: "sophia-typography", title: "Typography", image: "/mock/sophia-typography.jpg", coverColor: "#20372c", aspect: "1600 / 966" },
  { id: "sophia-storefront", title: "Storefront", image: "/mock/sophia-storefront.jpg", coverColor: "#9c8662", aspect: "4 / 5" },
  { id: "sophia-uniform", title: "Staff uniform", image: "/mock/sophia-uniform.jpg", coverColor: "#26392f", aspect: "4 / 5" },
  { id: "sophia-stationery", title: "Stationery", image: "/mock/sophia-stationery.jpg", coverColor: "#435147", aspect: "1600 / 1039" },
];

const sophiaMedia = (item: PortfolioItem): BrandMedia => ({ id: item.id, title: item.title, type: "image", src: item.image, bg: item.coverColor, aspect: item.aspect });

const sophia: Brand = {
  slug: "sophia", title: "Sophia", category: "Brand Identity", coverColor: "#1c3028", coverMark: "S",
  heroImage: "/mock/sophia-hero.jpg", href: "/work/brand-identity/sophia", items: sophiaItems,
  tagline: "A premium, purpose-built rental community in downtown Barrie, designed for modern urban living and everyday connection.",
  services: ["Brand Strategy", "Visual Identity", "Residential", "Applications"], year: "2026", washColor: "rgba(28, 48, 40, .48)",
  blocks: [
    { kind: "text", heading: "Art Direction", paragraphs: [
      "Project Sophia is a purpose-built rental residential development in downtown Barrie, Canada. It is designed for urban renters, working professionals, and individuals or families seeking quality homes with convenient access to employment, essential services, and public transportation.",
      "The creative direction is premium, professional, modern, and sophisticated. Refined typography and a clean contemporary aesthetic communicate quality and trust, while warm architectural imagery makes the identity feel comfortable, accessible, and rooted in modern urban living.",
    ] },
    { kind: "pair", media: [sophiaMedia(sophiaItems[0]), sophiaMedia(sophiaItems[1])], aspect: "1 / 1" },
    { kind: "text", heading: "Colour", paragraphs: ["Premium cream brings warmth, elegance, and a welcoming residential feel. Sophisticated green suggests growth, stability, nature, and trust; together, the colours position Sophia as a comfortable, premium place to call home."] },
    { kind: "full", media: sophiaMedia(sophiaItems[2]) },
    { kind: "pair", media: [sophiaMedia(sophiaItems[3]), sophiaMedia(sophiaItems[4])], aspect: "4 / 5" },
    { kind: "text", heading: "Creative Process", paragraphs: [
      "The identity begins with the experience Sophia promises: a quality home in a connected urban setting. We translated that promise into a clear wordmark, considered type, and a composed visual language that feels premium while remaining approachable to a broad community of residents.",
      "Each application carries the same balance of confidence and warmth into the built environment and resident experience. The system is designed to support clear property communications and recognition across public-facing materials, while the cream and green palette keeps the overall impression calm and dependable.",
    ] },
    { kind: "full", media: sophiaMedia(sophiaItems[5]) },
    { kind: "video", media: { id: "sophia-film", title: "Sophia brand film", type: "video", src: "/mock/video/sophia.mp4", poster: "/mock/sophia-hero.jpg", bg: "#1c3028", aspect: "16 / 9" } },
    { kind: "full", media: { id: "sophia-closing", title: "Sophia identity", type: "image", src: "/mock/sophia-hero.jpg", bg: "#1c3028", aspect: "16 / 9" } },
  ],
};

export const brands: Brand[] = [
  sophia,
  createMockBrand({
    slug: "aurora-finance", title: "Aurora Finance", coverColor: "#f25a2a", coverMark: "◒", heroImage: "/mock/aurora-hero.svg", prefix: "aurora",
    itemTitles: ["Wordmark", "App identity", "Member card", "Annual report", "Campaign", "Editorial system", "Wayfinding", "Product launch"],
    itemColors: ["#ef633c", "#9f80b9", "#f1d5c1", "#182633"], itemAspects: ["16 / 9", "1 / 1", "4 / 5", "4 / 5", "16 / 9", "1 / 1", "16 / 9", "4 / 5"],
    tagline: "A clearer, more human identity for a financial platform built around everyday momentum.", services: ["Brand Strategy", "Visual Identity", "Editorial", "Digital Design"], year: "2025", washColor: "rgba(115, 48, 43, .38)",
    artDirection: ["Aurora Finance reframes financial progress as something people can see and shape in everyday life. Its identity pairs a confident typographic voice with a warm, optimistic visual system that makes complex decisions feel approachable.", "The mark and campaign language are designed to move between product, publication, and public space. Strong geometry gives the system recognition, while a human scale keeps the brand clear and welcoming."],
    colorStory: "Coral brings energy to deep navy, with soft lilac and warm paper tones creating a useful balance between momentum and reassurance.",
    creativeProcess: ["We organized the system around a small number of repeatable visual moves: a clear wordmark, editorial hierarchy, and confident blocks of colour. These elements give the platform a consistent voice without limiting the different ways its teams communicate.", "The applications were developed from the interface outward, with campaign and print pieces tested against the same hierarchy. Every touchpoint keeps the information legible while giving the brand room to feel expressive."],
    imagePairs: [[0, 4], [2, 3], [1, 5]], fullImages: [6, 7],
  }),
  createMockBrand({
    slug: "pixel-roots", title: "Pixel Roots", coverColor: "#cfff4a", coverMark: "⌘", heroImage: "/mock/pixel-hero.svg", prefix: "pixel",
    itemTitles: ["Brand mark", "Pixel language", "Seed packet", "Market poster", "Packaging family", "Social launch", "Store display", "Field guide"],
    itemColors: ["#cfff4a", "#397d53", "#f2c95d", "#e98251"], itemAspects: ["16 / 9", "1 / 1", "4 / 5", "16 / 9", "4 / 5", "1 / 1", "16 / 9", "4 / 5"],
    tagline: "A playful visual system for a growing community of makers, growers, and curious eaters.", services: ["Brand Strategy", "Visual Identity", "Packaging", "Campaigns"], year: "2025", washColor: "rgba(61, 91, 39, .42)",
    artDirection: ["Pixel Roots brings the energy of a neighborhood growing space into a flexible brand identity. The system celebrates the handmade and the experimental, giving community stories a bright, recognizable frame across markets, packaging, and digital channels.", "A simple graphic mark opens into a lively visual language of modular shapes and bold type. Its structure is deliberately easy to adapt, so each new harvest or event can feel fresh while remaining unmistakably part of the same community."],
    colorStory: "Electric green leads the palette, balanced by leaf green, sun-warmed yellow, and clay orange drawn from the materials and produce around the project.",
    creativeProcess: ["We started with the many small moments that make the community feel active: planting, sharing, labeling, and gathering. Those gestures became a toolkit of graphic forms that could scale from a tiny seed packet to a market banner.", "The identity is designed to be used by many hands. Clear templates and a generous colour system make it easy to create new communications while preserving the personality and rhythm of the brand."],
    imagePairs: [[0, 3], [2, 4], [1, 5]], fullImages: [6, 7],
  }),
  createMockBrand({
    slug: "zenith-studio", title: "Zenith Studio", coverColor: "#a9dcff", coverMark: "✦", heroImage: "/mock/zenith-hero.svg", prefix: "zenith",
    itemTitles: ["Studio identity", "Signature mark", "Portfolio system", "Print suite", "Exhibition poster", "Studio objects", "Motion language", "Art direction"],
    itemColors: ["#a9dcff", "#6d70b5", "#f4ede2", "#243049"], itemAspects: ["16 / 9", "1 / 1", "4 / 5", "16 / 9", "4 / 5", "1 / 1", "16 / 9", "4 / 5"],
    tagline: "A precise and expressive identity for a creative studio working across culture, space, and image.", services: ["Brand Strategy", "Visual Identity", "Print", "Motion"], year: "2025", washColor: "rgba(52, 61, 109, .42)",
    artDirection: ["Zenith Studio needed an identity that could hold a wide range of creative work without competing with it. The art direction gives the studio a quiet frame: open compositions, precise typography, and a signature mark with enough character to stand alone.", "A cool, spacious palette links the studio’s printed matter and digital portfolio. The system shifts scale and rhythm to suit each project, while a consistent typographic voice keeps the studio present throughout."],
    colorStory: "Clear sky blue and indigo set the tone, with warm paper and deep ink creating contrast across both expressive and information-heavy layouts.",
    creativeProcess: ["The identity was built as a working kit rather than a fixed lockup. We tested the signature mark across the studio’s portfolio, print suite, and exhibition materials to establish a set of reliable proportions and spacing rules.", "Motion and object studies extend the same principles into physical and moving forms. The result gives Zenith a coherent presence while allowing the studio’s selected work to remain the focus."],
    imagePairs: [[0, 3], [2, 4], [1, 5]], fullImages: [6, 7],
  }),
];

export const socialCollection: PortfolioCollection = {
  slug: "social-media-posts", title: "Social Media Engagement Posts", category: "Social Media", coverColor: "#f061f5", coverMark: "↗",
  heroImage: "/mock/social-hero.svg", href: "/work/social-media-posts",
  items: items("social", ["New season", "A little reminder", "Now open", "Sunday ritual", "Meet the makers", "Limited release", "Big news", "Made for today", "Save the date", "Good things grow", "Your next chapter", "Thank you"], ["#f061f5", "#f1c850", "#82d8bd", "#ed765b", "#8295e8", "#f2e4cf"], ["1 / 1", "4 / 5", "1 / 1", "4 / 5", "1 / 1", "4 / 5", "1 / 1", "4 / 5", "1 / 1", "4 / 5", "1 / 1", "4 / 5"]),
};

export const workCards: PortfolioCollection[] = [...brands, socialCollection];
export const brandBySlug = (slug: string) => brands.find((brand) => brand.slug === slug);
