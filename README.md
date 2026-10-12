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
- `/work/brand-identity/nova-labs`
- `/work/brand-identity/aurora-finance`
- `/work/brand-identity/pixel-roots`
- `/work/brand-identity/zenith-studio`
- `/work/social-media-posts`

Project content lives in `lib/portfolio-data.ts`. Local mock artwork is in `public/mock/`; regenerate it with `node scripts/generate-mocks.mjs`.
