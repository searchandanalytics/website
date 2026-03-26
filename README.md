# Rajeev AI Search — Static Site (GitHub Pages)

This repo is a **pure static** website (HTML/CSS/JS) designed to publish on **GitHub Pages**.

## Structure
- `/index.html` — homepage
- `/css/styles.css` — global styles (dark by default + light toggle)
- `/js/ai-network.js` — AI-search network canvas background
- `/js/main.js` — theme toggle
- `/insights/` — Tech / Insights hub
- `/insights/posts/` — posts (HTML) + optional Markdown source

## Deploy on GitHub Pages (no build)
1. Create a GitHub repo (e.g. `rajeev-aisearch`).
2. Upload all files from this folder to the repo root.
3. In GitHub: **Settings → Pages**
   - Source: `Deploy from a branch`
   - Branch: `main` / folder: `/ (root)`
4. Your site will be live at `https://<username>.github.io/<repo>/`

### Custom domain
- In **Settings → Pages**, add your domain (e.g. `rajeev-aisearch.com`)
- Add a `CNAME` file at repo root containing your domain.
- Point DNS records to GitHub Pages per GitHub instructions.

## Adding a new Tech / Insights post
1. Copy an existing file in `/insights/posts/`
2. Update the title + meta + content
3. Link it from `/insights/index.html` and the homepage insights preview cards

## Notes
- The site uses **absolute paths** (`/css/...`) which works best with a custom domain.
- If you publish to a repo path like `/repo/`, switch to relative paths or configure a custom domain.
