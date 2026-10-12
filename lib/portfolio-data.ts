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

export type Brand = PortfolioCollection & { category: "Brand Identity" };

function items(prefix: string, titles: string[], colors: string[], aspects: string[]): PortfolioItem[] {
  return titles.map((title, index) => ({
    id: `${prefix}-${index + 1}`,
    title,
    image: `/mock/${prefix}-${index + 1}.svg`,
    coverColor: colors[index % colors.length],
    aspect: aspects[index % aspects.length],
  }));
}

export const brands: Brand[] = [
  {
    slug: "sophia", title: "Sophia", category: "Brand Identity", coverColor: "#1c3028", coverMark: "S",
    heroImage: "/mock/sophia-hero.jpg", href: "/work/brand-identity/sophia",
    items: [
      { id: "sophia-identity", title: "Brand identity", image: "/mock/sophia-identity.jpg", coverColor: "#1c3028", aspect: "1 / 1" },
      { id: "sophia-typography", title: "Typography", image: "/mock/sophia-typography.jpg", coverColor: "#20372c", aspect: "16 / 9" },
      { id: "sophia-storefront", title: "Storefront", image: "/mock/sophia-storefront.jpg", coverColor: "#9c8662", aspect: "4 / 5" },
      { id: "sophia-interior", title: "Interior identity", image: "/mock/sophia-interior.jpg", coverColor: "#293329", aspect: "1 / 1" },
      { id: "sophia-stationery", title: "Stationery", image: "/mock/sophia-stationery.jpg", coverColor: "#435147", aspect: "16 / 9" },
      { id: "sophia-uniform", title: "Staff uniform", image: "/mock/sophia-uniform.jpg", coverColor: "#26392f", aspect: "4 / 5" },
    ],
  },
  {
    slug: "aurora-finance", title: "Aurora Finance", category: "Brand Identity", coverColor: "#f25a2a", coverMark: "◒",
    heroImage: "/mock/aurora-hero.svg", href: "/work/brand-identity/aurora-finance",
    items: items("aurora", ["Wordmark", "App identity", "Member card", "Annual report", "Campaign", "Editorial system", "Wayfinding", "Product launch"], ["#ef633c", "#9f80b9", "#f1d5c1", "#182633"], ["16 / 9", "1 / 1", "4 / 5", "4 / 5", "16 / 9", "1 / 1", "16 / 9", "4 / 5"]),
  },
  {
    slug: "pixel-roots", title: "Pixel Roots", category: "Brand Identity", coverColor: "#cfff4a", coverMark: "⌘",
    heroImage: "/mock/pixel-hero.svg", href: "/work/brand-identity/pixel-roots",
    items: items("pixel", ["Brand mark", "Pixel language", "Seed packet", "Market poster", "Packaging family", "Social launch", "Store display", "Field guide"], ["#cfff4a", "#397d53", "#f2c95d", "#e98251"], ["16 / 9", "1 / 1", "4 / 5", "16 / 9", "4 / 5", "1 / 1", "16 / 9", "4 / 5"]),
  },
  {
    slug: "zenith-studio", title: "Zenith Studio", category: "Brand Identity", coverColor: "#a9dcff", coverMark: "✦",
    heroImage: "/mock/zenith-hero.svg", href: "/work/brand-identity/zenith-studio",
    items: items("zenith", ["Studio identity", "Signature mark", "Portfolio system", "Print suite", "Exhibition poster", "Studio objects", "Motion language", "Art direction"], ["#a9dcff", "#6d70b5", "#f4ede2", "#243049"], ["16 / 9", "1 / 1", "4 / 5", "16 / 9", "4 / 5", "1 / 1", "16 / 9", "4 / 5"]),
  },
];

export const socialCollection: PortfolioCollection = {
  slug: "social-media-posts", title: "Social Media Engagement Posts", category: "Social Media", coverColor: "#f061f5", coverMark: "↗",
  heroImage: "/mock/social-hero.svg", href: "/work/social-media-posts",
  items: items("social", ["New season", "A little reminder", "Now open", "Sunday ritual", "Meet the makers", "Limited release", "Big news", "Made for today", "Save the date", "Good things grow", "Your next chapter", "Thank you"], ["#f061f5", "#f1c850", "#82d8bd", "#ed765b", "#8295e8", "#f2e4cf"], ["1 / 1", "4 / 5", "1 / 1", "4 / 5", "1 / 1", "4 / 5", "1 / 1", "4 / 5", "1 / 1", "4 / 5", "1 / 1", "4 / 5"]),
};

export const workCards: PortfolioCollection[] = [...brands, socialCollection];
export const brandBySlug = (slug: string) => brands.find((brand) => brand.slug === slug);
