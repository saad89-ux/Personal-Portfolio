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
  coverImage?: string;
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
  | { kind: "video"; media: BrandMedia }
  | { kind: "film-collection"; films: { media: BrandMedia; heading: string; paragraph: string }[] }
  | { kind: "social-posts"; posts: { media: BrandMedia; brand: string; heading: string; paragraph: string; source?: { label: string; href: string } }[] };

export type Brand = Omit<PortfolioCollection, "category"> & {
  category: string;
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
  heroImage: "/mock/sophia-hero.jpg", coverImage: "/work-covers/sophia-cover.webp", href: "/work/brand-identity/sophia", items: sophiaItems,
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
    { kind: "full", media: { id: "sophia-closing", title: "Sophia identity", type: "image", src: "/mock/sophia-hero.jpg", bg: "#1c3028", aspect: "16 / 9" } },
  ],
};

const coffeeBrandItems: PortfolioItem[] = [
  { id: "me-coffee-identity", title: "Coffee and character identity", image: "/me-coffee/brand-world.png", coverColor: "#24150d", aspect: "4 / 5" },
  { id: "me-coffee-loyalty", title: "Loyalty card", image: "/me-coffee/loyalty-card.jpg", coverColor: "#24150d", aspect: "4 / 5" },
  { id: "me-coffee-cups", title: "Takeaway cups", image: "/me-coffee/takeaway-cups.jpg", coverColor: "#24150d", aspect: "4 / 5" },
  { id: "me-coffee-menu", title: "Menu and coffee cards", image: "/me-coffee/menu-cards.jpg", coverColor: "#24150d", aspect: "4 / 5" },
  { id: "me-coffee-menu-in-use", title: "Menu in use", image: "/me-coffee/menu-in-use.gif", coverColor: "#24150d", aspect: "16 / 10" },
  { id: "me-coffee-machine", title: "Coffee machine", image: "/me-coffee/coffee-machine.gif", coverColor: "#24150d", aspect: "16 / 9" },
  { id: "me-coffee-storefront", title: "Coffee house storefront", image: "/me-coffee/hero-storefront.jpg", coverColor: "#24150d", aspect: "2 / 1" },
  { id: "me-coffee-iced", title: "Iced coffee campaign", image: "/me-coffee/iced-coffee.jpg", coverColor: "#24150d", aspect: "4 / 5" },
  { id: "me-coffee-social", title: "Good morning social story", image: "/me-coffee/coffee-story.jpg", coverColor: "#24150d", aspect: "4 / 5" },
  { id: "me-coffee-barista", title: "Coffee making ritual", image: "/me-coffee/barista-ritual.jpg", coverColor: "#24150d", aspect: "4 / 5" },
  { id: "me-coffee-story", title: "Social story", image: "/me-coffee/social-story.jpg", coverColor: "#24150d", aspect: "9 / 16" },
  { id: "me-coffee-thank-you", title: "Thank you card", image: "/me-coffee/thank-you-card.png", coverColor: "#24150d", aspect: "16 / 9" },
  { id: "me-coffee-character", title: "Animated coffee character", image: "/me-coffee/brand-character.gif", coverColor: "#24150d", aspect: "16 / 9" },
  { id: "me-coffee-character-study", title: "Character animation", image: "/me-coffee/character-animation.gif", coverColor: "#24150d", aspect: "16 / 9" },
  { id: "me-coffee-ritual", title: "Coffee ritual campaign", image: "/me-coffee/coffee-ritual.jpg", coverColor: "#24150d", aspect: "4 / 5" },
];

const coffeeBrandMedia = (item: PortfolioItem): BrandMedia => ({ id: item.id, title: item.title, type: "image", src: item.image, bg: item.coverColor, aspect: item.aspect });

const coffeeBrand: Brand = {
  slug: "me-coffee", title: "me coffee", category: "Brand Identity", coverColor: "#24150d", coverMark: "me",
  heroImage: "/me-coffee/hero-storefront.jpg", coverImage: "/work-covers/coffee-cover.webp", href: "/work/brand-identity/me-coffee", items: coffeeBrandItems,
  tagline: "A characterful coffee brand built around good coffee, warm rituals, and a little everyday joy.",
  services: ["Brand Identity", "Packaging", "Art Direction", "Social Campaign"], year: "2026", washColor: "rgba(83, 48, 24, .42)",
  blocks: [
    { kind: "text", heading: "Art Direction", paragraphs: [
      "me is a coffee and pastry brand with a warm, confident visual personality. A distinctive hand-drawn wordmark and illustrated character make the identity immediately recognizable across the café, cups, menus, and social media.",
      "The art direction pairs close-up coffee imagery with playful graphics and tactile, cream-toned surfaces. Espresso brown anchors the system, letting the expressive mark and rich coffee photography carry the experience from the first cup to the last detail.",
    ] },
    { kind: "pair", media: [coffeeBrandMedia(coffeeBrandItems[0]), coffeeBrandMedia(coffeeBrandItems[1])], aspect: "4 / 5" },
    { kind: "text", heading: "Identity", paragraphs: ["The soft, hand-drawn wordmark gives me its own easygoing voice. A small coffee character adds a memorable signature, while bold, rounded lettering stays legible across packaging, menus, and the storefront."] },
    { kind: "pair", media: [coffeeBrandMedia(coffeeBrandItems[2]), coffeeBrandMedia(coffeeBrandItems[3])], aspect: "4 / 5" },
    { kind: "full", media: coffeeBrandMedia(coffeeBrandItems[4]) },
    { kind: "text", heading: "Colour & Craft", paragraphs: ["Cream and espresso brown create the core palette: inviting, rich, and rooted in the daily coffee ritual. Warm photography and subtle paper textures keep the visual system tactile, while the white wordmark gives every touchpoint a clear point of contrast."] },
    { kind: "pair", media: [coffeeBrandMedia(coffeeBrandItems[5]), coffeeBrandMedia(coffeeBrandItems[6])], aspect: "16 / 9" },
    { kind: "text", heading: "Creative Process", paragraphs: [
      "We shaped the identity around the moments that make a coffee stop feel personal: a familiar cup, a favorite order, and a friendly face behind the counter. The character and expressive wordmark add personality without getting in the way of the product.",
      "The visual system carries naturally across the menu, loyalty card, takeaway cups, coffee machine, storefront, and social stories. Consistent colour and illustration keep each application connected while giving the photography room to feel immediate and inviting.",
    ] },
    { kind: "pair", media: [coffeeBrandMedia(coffeeBrandItems[7]), coffeeBrandMedia(coffeeBrandItems[8])], aspect: "4 / 5" },
    { kind: "pair", media: [coffeeBrandMedia(coffeeBrandItems[9]), coffeeBrandMedia(coffeeBrandItems[10])], aspect: "4 / 5" },
    { kind: "full", media: coffeeBrandMedia(coffeeBrandItems[11]) },
    { kind: "pair", media: [coffeeBrandMedia(coffeeBrandItems[12]), coffeeBrandMedia(coffeeBrandItems[13])], aspect: "16 / 9" },
    { kind: "full", media: coffeeBrandMedia(coffeeBrandItems[14]) },
  ],
};

const stargazerItems: PortfolioItem[] = [
  { id: "stargazer-identity-suite", title: "Identity suite", image: "/stargazer/identity-suite.webp", coverColor: "#10111a", aspect: "4 / 3" },
  { id: "stargazer-emblem", title: "Celestial emblem", image: "/stargazer/logo-mark.webp", coverColor: "#10111a", aspect: "1 / 1" },
  { id: "stargazer-shooting", title: "Shooting campaign", image: "/stargazer/shooting-banner.webp", coverColor: "#10111a", aspect: "4 / 3" },
  { id: "stargazer-clapperboard", title: "Production slate", image: "/stargazer/clapperboard.webp", coverColor: "#10111a", aspect: "3 / 2" },
  { id: "stargazer-cinema", title: "Cinema screen", image: "/stargazer/cinema-screen.webp", coverColor: "#10111a", aspect: "3 / 2" },
  { id: "stargazer-sign", title: "Production sign", image: "/stargazer/production-sign.webp", coverColor: "#10111a", aspect: "4 / 5" },
  { id: "stargazer-billboard", title: "Outdoor campaign", image: "/stargazer/billboard.webp", coverColor: "#10111a", aspect: "3 / 2" },
  { id: "stargazer-crew-shirt", title: "Crew apparel", image: "/stargazer/crew-shirt.webp", coverColor: "#10111a", aspect: "4 / 3" },
  { id: "stargazer-crew-cap", title: "Crew cap", image: "/stargazer/crew-cap.webp", coverColor: "#10111a", aspect: "3 / 4" },
  { id: "stargazer-on-set", title: "On set", image: "/stargazer/camera-shoot.webp", coverColor: "#10111a", aspect: "4 / 3" },
];

const stargazerMedia = (item: PortfolioItem): BrandMedia => ({ id: item.id, title: item.title, type: "image", src: item.image, bg: item.coverColor, aspect: item.aspect });

const stargazer: Brand = {
  slug: "stargazer-film-productions", title: "Stargazer Film Productions", category: "Brand Identity", coverColor: "#10111a", coverMark: "✦",
  heroImage: "/stargazer/shooting-banner.webp", coverImage: "/work-covers/stargazer-cover.webp", href: "/work/brand-identity/stargazer-film-productions", items: stargazerItems,
  tagline: "A Canadian film production house with its sights set on stories that stay with you.",
  services: ["Brand Strategy", "Visual Identity", "Film Production", "Campaigns"], year: "2026", washColor: "rgba(37, 43, 77, .5)",
  blocks: [
    { kind: "text", heading: "Art Direction", paragraphs: [
      "The creative brief imagines Stargazer as a Canada-based film production company built around original, considered storytelling. The identity needed to feel at home on set and on screen: confident enough for industry partners, yet open to the possibility and wonder at the heart of filmmaking.",
      "The emblem brings a filmmaker and telescope beneath a night sky, connecting the focus of the camera with Stargazer's outward-looking name. A restrained celestial palette and formal typography give the mark a timeless, cinematic presence.",
    ] },
    { kind: "pair", media: [stargazerMedia(stargazerItems[0]), stargazerMedia(stargazerItems[1])], aspect: "4 / 3" },
    { kind: "text", heading: "A Mark for the Movies", paragraphs: [
      "A circular frame holds the illustrated emblem like a lens: a telescope points toward a field of stars, while the filmmaker silhouette keeps the mark grounded in the craft. The full wordmark pairs classic letterforms with clear supporting type for FILM PRODUCTIONS.",
    ] },
    { kind: "pair", media: [stargazerMedia(stargazerItems[2]), stargazerMedia(stargazerItems[3])], aspect: "3 / 2" },
    { kind: "full", media: stargazerMedia(stargazerItems[4]) },
    { kind: "text", heading: "Colour & Atmosphere", paragraphs: [
      "Deep charcoal creates a quiet, theatre-like ground. Cosmic indigo and luminous blue bring depth to the illustrated sky, while warm gold lends the wordmark a sense of craft and permanence. The contrast keeps the identity legible across both dark production environments and clean light applications.",
    ] },
    { kind: "pair", media: [stargazerMedia(stargazerItems[5]), stargazerMedia(stargazerItems[6])], aspect: "3 / 2" },
    { kind: "text", heading: "Built for the Production", paragraphs: [
      "The brief is shaped for a collaborative screen-production studio: a place where writers, directors, performers, crew, and production partners come together to move an idea from development to a finished film. In Canada's varied screen-production landscape, a distinct point of view helps each project find its own audience.",
      "The identity carries from stationery and pitch materials to crew apparel, location signage, and campaign placements. The emblem stays recognizable at every scale, keeping Stargazer present throughout the work of making a film.",
    ] },
    { kind: "pair", media: [stargazerMedia(stargazerItems[7]), stargazerMedia(stargazerItems[8])], aspect: "4 / 3" },
    { kind: "full", media: stargazerMedia(stargazerItems[9]) },
  ],
};

const motionFilmStories = [
  {
    media: { id: "motion-skin-spotlight", title: "Skincare visibility campaign", type: "video", src: "/motion-films/skin-spotlight.mp4", poster: "/motion-films/skin-spotlight-poster.jpg", bg: "#17120f", aspect: "9 / 16" },
    heading: "Visible Lines",
    paragraph: "A skincare awareness reel built around a close portrait, clear type, and a simple booking invitation. The edit gives the message room to land before the final call to action.",
  },
  {
    media: { id: "motion-iconic-tour", title: "Iconic Living property film", type: "video", src: "/motion-films/iconic-living-tour.mp4", poster: "/motion-films/iconic-living-tour-poster.jpg", bg: "#17191e", aspect: "9 / 16" },
    heading: "A Place to Arrive",
    paragraph: "A vertical property tour introduces Iconic Living through its quiet interiors and visitor-facing details, finishing with a clear location and invitation to visit.",
  },
  {
    media: { id: "motion-iconic-materials", title: "Iconic Living material story", type: "video", src: "/motion-films/iconic-living-materials.mp4", poster: "/motion-films/iconic-living-materials-poster.jpg", bg: "#29231e", aspect: "9 / 16" },
    heading: "Sandstone / Walnut",
    paragraph: "A residential interiors piece moves from a finished living space to its warm material palette, using room details and colour cards to create an aspirational design story.",
  },
  {
    media: { id: "motion-producer-guide", title: "Five-step guide for new producers", type: "video", src: "/motion-films/producer-guide.mp4", poster: "/motion-films/producer-guide-poster.jpg", bg: "#111419", aspect: "9 / 16" },
    heading: "Before the First Take",
    paragraph: "A fast, educational reel for emerging producers turns early production decisions into readable chapters, from planning distribution to casting and getting the film made.",
  },
  {
    media: { id: "motion-skin-treatment", title: "Skincare treatment reel", type: "video", src: "/motion-films/skin-treatment.mp4", poster: "/motion-films/skin-treatment-poster.jpg", bg: "#1a1512", aspect: "9 / 16" },
    heading: "A Moment to Reset",
    paragraph: "A treatment-led beauty reel uses close-up care and a short on-screen narrative to present a relaxing facial service, then closes with a direct booking prompt.",
  },
  {
    media: { id: "motion-design-process", title: "Interior design process film", type: "video", src: "/motion-films/design-process.mp4", poster: "/motion-films/design-process-poster.jpg", bg: "#e8e3da", aspect: "9 / 16" },
    heading: "From Line to Living Room",
    paragraph: "An interior-design story starts as an architectural sketch and resolves into a completed room, making the transformation from first idea to lived-in space the central reveal.",
  },
  {
    media: { id: "motion-outdoor-living", title: "Outdoor living property film", type: "video", src: "/motion-films/outdoor-living.mp4", poster: "/motion-films/outdoor-living-poster.jpg", bg: "#34382e", aspect: "9 / 16" },
    heading: "Room to Step Outside",
    paragraph: "A home-and-garden campaign links the interiors to outdoor entertaining, using a new collection announcement to frame the property as a complete lifestyle.",
  },
] satisfies { media: BrandMedia; heading: string; paragraph: string }[];

const filmMotion: Brand = {
  slug: "film-and-motion", title: "Film & Motion", category: "Film & Motion", coverColor: "#0a0b0f", coverMark: "↗",
  heroImage: "/motion-films/showreel-mosaic.webp", coverImage: "/work-covers/film-motion-cover.webp", href: "/work/film-and-motion", items: [],
  tagline: "Short-form films and reels shaped to give every story its own point of view.",
  services: ["Creative Direction", "Campaign Films", "Social Reels", "Editing"], year: "2026", washColor: "rgba(31, 37, 57, .52)",
  blocks: [
    { kind: "text", heading: "Selected Motion", paragraphs: [
      "Seven short films move between beauty, interiors, property, and filmmaking itself. Each piece starts with the needs of its subject, finding a distinct rhythm and visual language for the story it has to tell.",
      "The collection brings campaign films and social-first edits together in one place, pairing clear narratives with close detail, considered pacing, and purposeful on-screen type.",
    ] },
    { kind: "film-collection", films: motionFilmStories },
    { kind: "text", heading: "Made to Move", paragraphs: [
      "From an intimate skincare close-up to a room revealed from its first sketch, these films are designed for the way people watch today: quickly, vertically, and with a strong visual idea at the centre.",
      "Sound stays off during autoplay. Turn it on for any film to hear its original audio.",
    ] },
  ],
};

export const brands: Brand[] = [
  sophia,
  coffeeBrand,
  stargazer,
];

const socialPostRows = [
  ["2-days-countdown", "2 days until Black Friday", "Health Globe", "A final-week countdown turns the Black Friday wellness and peel package into a clear, time-sensitive offer. The price, included peel options, and booking contact stay visible for quick decisions.", "https://healthglobe.ca/"],
  ["4-days-countdown", "4 days until Black Friday", "Health Globe", "This countdown creative introduces the clinic’s wellness and peel offer with a clean price callout and a concise choice between stimulating and restorative peels.", "https://healthglobe.ca/"],
  ["6-days-wellness-post", "6 days until Black Friday", "Health Globe", "The opening countdown post builds anticipation for a limited wellness package, pairing treatment imagery with a direct value proposition and contact details.", "https://healthglobe.ca/"],
  ["artboard-1", "We build teams", "DANZ Management Consulting", "A culture-focused recruitment message reframes hiring as team building. The photograph of colleagues celebrating supports the promise of helping organizations find people who work well together.", "https://danzmci.com/about-us/"],
  ["canadaday-post-copy", "Glow bright this Canada Day", "SkinKouture", "A seasonal greeting connects Canada Day to the brand’s skincare voice with a restrained, premium layout and a polished beauty-led message.", "https://skinkouture.com/"],
  ["canadaday-post", "Happy Canada Day", "SkinKouture", "A warm Canada Day greeting pairs a celebratory maple-leaf graphic with the clinic’s refined cream and rose palette, keeping the post community-minded and recognizably on-brand.", "https://skinkouture.com/"],
  ["design-2-copy-2", "Happy Victoria Day", "DANZ Management Consulting", "A Victoria Day greeting adapts the consulting brand for a Canadian holiday, using a quiet maple motif and clear date to keep the message timely and professional.", "https://danzmci.com/about-us/"],
  ["eden-art-hannah", "Eden Art Gallery feature", "Eden Art Gallery / Hannah Nah", "A portrait-led location feature introduces Hannah Nah in front of the gallery’s distinctive sculpture. The image and contact overlay make this feel like a personal visit or local discovery post.", ""],
  ["fathers-day-2", "Happy Father’s Day", "Stargazer Media Finance", "A cinematic Father’s Day greeting uses a film still and restrained title treatment to connect a personal celebration with the brand’s screen-media world.", "https://www.stargazermediafinance.com/about/"],
  ["fathers-day", "Happy Father’s Day", "Stargazer Media Finance", "A second Father’s Day creative brings the same film-inspired tone into a brighter, more graphic composition, balancing the message with a clear date and family imagery.", "https://www.stargazermediafinance.com/about/"],
  ["lastday-countdownpost", "Last day: Black Friday", "Health Globe", "The closing countdown creates urgency for the wellness package while repeating its treatment choices, price, and clinic contact so the offer remains actionable.", "https://healthglobe.ca/"],
  ["new-themed", "Holiday Glow Special", "Health Globe", "A seasonal treatment offer presents a paired skincare package and limited-time price. The soft aqua palette and close-up facial image position the promotion around a calm, restorative experience.", "https://healthglobe.ca/"],
  ["phinney-post-3", "Bank of Canada rate update", "Phinney Real Estate", "A market update translates a central-bank rate change into a quick, high-contrast social graphic. The building image anchors the financial headline in the property market.", "https://phinneyrealestate.com/"],
  ["post-3", "What our users say", "Teamingway", "A testimonial card turns customer feedback into social proof, highlighting improved team communication and an easy-to-scan five-star review.", "https://teamingway.com/"],
  ["post-5", "Tasks marked done", "Teamingway", "A product-led post focuses on visible progress: completed tasks, clear ownership, and team-wide visibility. The illustration reinforces the platform’s collaborative workflow message.", "https://teamingway.com/"],
  ["post-1", "Pay off your mortgage sooner", "Mortgagepedia", "An educational real-estate post introduces practical strategies for paying down a Canadian mortgage sooner, with an approachable couple and a direct question-led headline.", "https://www.mortgagepedia.ca/03-about"],
  ["post-8", "Haircut guide", "SkinKouture", "A service guide lays out popular haircut options in a simple visual menu, helping salon clients compare styles while keeping the clinic’s established beauty palette and contact details.", "https://skinkouture.com/"],
] as const;

const socialItems: PortfolioItem[] = socialPostRows.map(([slug, title], index) => ({
  id: `social-${index + 1}`,
  title,
  image: `/social-posts/${slug}.webp`,
  coverColor: ["#e4f3ef", "#f3e8de", "#151514", "#edf0f2"][index % 4],
  aspect: index === 7 ? "1 / 1" : "4 / 5",
}));
const socialMedia = (item: PortfolioItem): BrandMedia => ({ id: item.id, title: item.title, type: "image", src: item.image, bg: item.coverColor, aspect: item.aspect });

export const socialCollection: Brand = {
  slug: "social-media-engagement", title: "Social Media Engagement", category: "Social Media", coverColor: "#161816", coverMark: "↗",
  heroImage: "/social-posts/social-hero.webp", coverImage: "/work-covers/social-cover.webp", href: "/work/social-media-engagement", items: socialItems,
  tagline: "A collection of real social campaigns, shaped around each brand’s voice, audience, and moment.",
  services: ["Social Campaigns", "Content Design", "Art Direction", "17 Posts"], year: "2026", washColor: "rgba(73, 105, 88, .42)",
  blocks: [
    { kind: "text", heading: "Built for the Feed", paragraphs: [
      "This collection brings together 17 supplied social posts for wellness and beauty, consulting, real estate, mortgage education, film finance, an art-gallery feature, and a collaboration platform. Each piece uses the visual language of its own brand rather than a single template.",
      "The short briefs below describe the message and design intent visible in each supplied image. Brand context is drawn from the linked public websites where an official source was identifiable; the captions are portfolio descriptions, not quoted client briefs.",
    ] },
    { kind: "social-posts", posts: socialPostRows.map(([slug, , brand, paragraph, href], index) => ({
      media: socialMedia(socialItems[index]), brand, heading: socialItems[index].title, paragraph,
      ...(href ? { source: { label: "BRAND CONTEXT ↗", href } } : {}),
    })) },
  ],
};

export const allProjects: Brand[] = [...brands, filmMotion, socialCollection];
export const workCards: PortfolioCollection[] = allProjects;
export const brandBySlug = (slug: string) => brands.find((brand) => brand.slug === slug);
export const projectBySlug = (slug: string) => allProjects.find((project) => project.slug === slug);
