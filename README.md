# S&K portfolio

Next.js App Router portfolio with the scroll driven 7×4 landing page and an infinite, scrollable work showcase.

## Run locally

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000. Run a production build with `pnpm build`.

## Portfolio routes

- `/work` — four brand identity projects and the social media collection.
- `/work/brand-identity/sophia`
- `/work/brand-identity/aurora-finance`
- `/work/brand-identity/pixel-roots`
- `/work/brand-identity/zenith-studio`
- `/work/social-media-posts`

Project content lives in `lib/portfolio-data.ts`. Brand detail pages use a block model (`text`, `full`, `pair`, and `video`) to arrange case-study content. Add or edit each brand's blocks, copy, services, and palette there. Local artwork is in `public/mock/`; regenerate the SVG mock artwork with `node scripts/generate-mocks.mjs`.
