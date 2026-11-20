# Portfolio deployment

The `main` branch contains the complete editable source. The `gh-pages` branch contains the generated website; GitHub Pages serves its root directory.

Run `npm ci` and `npm run build:pages` to build for `https://dhiren1178.github.io/portfolio/`. Pushes to `main` verify both builds and retain the GitHub Pages export as a workflow artifact. Publish the contents of that export to `gh-pages` to update the live site. Keep the repository's Pages publishing source set to `gh-pages` / root.

For the hosted root-domain version, run `npm run build:site`. Both commands clean Next's compiled cache before building, so JavaScript, routing, fonts, imagery, model files, and downloads use the same base path. Do not copy a root-domain build to GitHub Pages or patch only its HTML.

`npm run verify:export` checks a root build. For a Pages export, use `NEXT_PUBLIC_BASE_PATH=/portfolio npm run verify:export`.

Model runtime files are copied from pinned npm dependencies before building. Camera input requires HTTPS, a camera, permission, and WebGL. Saved B, L and Y poses run the CNN without camera access. The browser classifier is credited separately from the original project results.
