# Home in 3D

An interactive 3D model of the Dehu Road home, built with Vite and three.js. It shows the floors, the courtyard, the sun's path over the day, a Vastu grid, and a Now/Improved comparison.

## Run locally
```bash
npm install
npm run dev        # http://localhost:5173
```

## Deploy

**Vercel**: push this folder to GitHub, then choose "Import Project" on vercel.com. The preset is Vite, the build command is `npm run build`, and the output folder is `dist`.

**GitHub Pages**: copy `deploy/github-pages.yml` to `.github/workflows/pages.yml` and push it. Then, in the repo's Settings → Pages, set Source to "GitHub Actions".

**Netlify**: use the same build command, with `dist` as the publish directory.

**Docker** (good practice for containers):
```bash
docker build -t home3d .
docker run -p 8080:80 home3d   # http://localhost:8080
```
This is a multi-stage build: Node builds the static files, and nginx serves them. The final image is about 50 MB.

## Edit
- `src/data.js`: room notes, problems, fixes and costs.
- `src/main.js`: geometry. All sizes are in feet. +x is east and −z is north. The house's north-west corner sits at (0, 0).
- `src/style.css`: page styling.
