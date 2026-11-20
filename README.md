# Dhiren Sharma · AI Engineering Portfolio

A Next.js portfolio covering Earth observation, computer vision, agentic workflows, and production machine learning.

## Run locally

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Requires Node.js 18.17 or later. Live camera tracking needs WebGL and localhost or HTTPS. Model runtime files are copied from the installed packages before the dev server and production build.

```sh
npm run lint
npm run build
npm start
```

For static hosting, set `NEXT_PUBLIC_SITE_URL` to the public origin and `PORTFOLIO_STATIC_EXPORT=1` before running `npm run build`. Serve the resulting `out/` directory over HTTPS with directory indexes enabled. If you have a confirmed GitHub profile, set `NEXT_PUBLIC_GITHUB_URL` before building to show it on the Contact page.

## Highlights

- `/projects/vegetation-height` — ISRO case study, three-date NASA satellite image comparison, and an interactive public canopy-height map for Delhi Ridge and Rondônia.
- `/projects/devpilot-ai` — sample issue walkthrough, unified and split code diff, browser-run regression tests, and local patch review.
- `/mission` — orbital simulation with a Blue Marble ground map and optional 3D globe.
- `/research` — notebook with project methodology, results, and limitations.
- `/projects/sign-language` — local webcam inference with MediaPipe and a published CNN, plus three saved hand poses.

See [Phase 14 notes](PHASE14_NOTES.md) for asset attribution and demo details. The deployment domain and social links are configured in `lib/config/site.ts`.
