import { mkdir, writeFile } from "node:fs/promises";

const root = new URL("../public/mock/", import.meta.url);
const sets = {
  nova: ["Primary identity", "Logo system", "Business card", "Lab notes", "Packaging", "Launch campaign", "Studio signage", "Digital guidelines"],
  aurora: ["Wordmark", "App identity", "Member card", "Annual report", "Campaign", "Editorial system", "Wayfinding", "Product launch"],
  pixel: ["Brand mark", "Pixel language", "Seed packet", "Market poster", "Packaging family", "Social launch", "Store display", "Field guide"],
  zenith: ["Studio identity", "Signature mark", "Portfolio system", "Print suite", "Exhibition poster", "Studio objects", "Motion language", "Art direction"],
  social: ["New season", "A little reminder", "Now open", "Sunday ritual", "Meet the makers", "Limited release", "Big news", "Made for today", "Save the date", "Good things grow", "Your next chapter", "Thank you"],
};
const palettes = {
  nova: ["#ecc41f", "#193c41", "#87aca6", "#f4e8cb"], aurora: ["#f25a2a", "#272d48", "#a78bc3", "#f1d5c1"],
  pixel: ["#cfff4a", "#185d43", "#f1bd45", "#e98251"], zenith: ["#a9dcff", "#252d59", "#6d70b5", "#eee8de"],
  social: ["#f061f5", "#f1c850", "#82d8bd", "#ed765b", "#8295e8", "#f2e4cf"],
};
const colors = ["#ecc41f", "#f25a2a", "#cfff4a", "#a9dcff", "#f061f5"];
const brands = ["NOVA LABS", "AURORA FINANCE", "PIXEL ROOTS", "ZENITH STUDIO"];
const safe = (text) => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

function artwork(label, palette, seed, width = 1600, height = 900, hero = false) {
  const [a, b, c, paper] = palette;
  const size = hero ? 150 : Math.min(width, height) * .14;
  const title = safe(label.toUpperCase());
  const index = seed % 4;
  const motif = [
    `<circle cx="${width * .72}" cy="${height * .45}" r="${Math.min(width, height) * .33}" fill="${c}" opacity=".86"/><circle cx="${width * .72}" cy="${height * .45}" r="${Math.min(width, height) * .19}" fill="${a}"/>`,
    `<path d="M${width * .55} 0h${width * .45}v${height}H${width * .76}C${width * .6} ${height * .67} ${width * .94} ${height * .35} ${width * .55} 0Z" fill="${c}"/><circle cx="${width * .75}" cy="${height * .48}" r="${Math.min(width, height) * .17}" fill="${a}"/>`,
    `<path d="M${width * .62} ${height * .08}C${width * .95} ${height * .02} ${width * .96} ${height * .88} ${width * .58} ${height * .9}C${width * .27} ${height * .91} ${width * .43} ${height * .11} ${width * .62} ${height * .08}Z" fill="${c}"/><circle cx="${width * .7}" cy="${height * .49}" r="${Math.min(width, height) * .12}" fill="${a}"/>`,
    `<rect x="${width * .58}" y="${height * .16}" width="${width * .32}" height="${height * .68}" rx="${Math.min(width, height) * .16}" fill="${c}" transform="rotate(12 ${width * .74} ${height * .5})"/><circle cx="${width * .74}" cy="${height * .49}" r="${Math.min(width, height) * .12}" fill="${a}"/>`,
  ][index];
  const font = Math.round(size * .18);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient><filter id="noise"><feTurbulence baseFrequency=".7" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values=".4 0 0 0 .2 .4 0 0 0 .2 .4 0 0 0 .2 0 0 0 .12 0"/></filter></defs><rect width="100%" height="100%" fill="url(#g)"/>${motif}<path d="M0 ${height * .78}Q${width * .22} ${height * .61} ${width * .43} ${height * .81}T${width} ${height * .72}V${height}H0Z" fill="${paper}" opacity=".13"/><rect width="100%" height="100%" filter="url(#noise)" opacity=".14"/><text x="${width * .075}" y="${height * .19}" fill="${paper}" font-family="Arial,sans-serif" font-size="${Math.max(14, font * .25)}" letter-spacing="5">STUDIO / VISUAL SYSTEM</text><text x="${width * .075}" y="${height * .52}" fill="${paper}" font-family="Arial,sans-serif" font-size="${font}" font-weight="600" letter-spacing="-3">${title}</text><text x="${width * .078}" y="${height * .61}" fill="${paper}" font-family="Arial,sans-serif" font-size="${Math.max(14, font * .25)}" letter-spacing="4">IDENTITY · OBJECT · CULTURE</text><text x="${width * .92}" y="${height * .91}" text-anchor="end" fill="${paper}" font-family="monospace" font-size="${Math.max(12, font * .2)}">PRØDUX — ${String(seed).padStart(2, "0")}</text></svg>`;
}

await mkdir(root, { recursive: true });
let seed = 1;
for (const [prefix, titles] of Object.entries(sets)) {
  for (let i = 0; i < titles.length; i++) {
    const ratio = i % 3 === 1 ? [1000, 1250] : i % 3 === 2 ? [1000, 1000] : [1600, 900];
    await writeFile(new URL(`${prefix}-${i + 1}.svg`, root), artwork(titles[i], palettes[prefix], seed++, ratio[0], ratio[1]));
  }
}
for (let i = 0; i < brands.length; i++) await writeFile(new URL(`${["nova", "aurora", "pixel", "zenith"][i]}-hero.svg`, root), artwork(brands[i], [colors[i], palettes[["nova", "aurora", "pixel", "zenith"][i]][1], palettes[["nova", "aurora", "pixel", "zenith"][i]][2], "#fffaf0"], seed++, 1600, 900, true));
await writeFile(new URL("social-hero.svg", root), artwork("A little something", palettes.social, seed++, 1600, 900, true));
console.log(`Generated ${seed - 1} local SVG mock images in public/mock.`);
