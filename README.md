# Transport Support Initiative — Fuel Subsidy Impact (NG)

Researching how fuel subsidy removal affects transport across Nigerian organizations, homes, schools & NGOs in Abuja — and piloting practical support.

Live site: https://<your-username>.github.io/fuel-subsidy-impact-ng/

## Pages
- `index.html` — Home + live counters
- `about.html`, `research.html`, `programs.html`
- `dashboard.html` — 6 Chart.js charts from `assets/data/responses.json`
- `survey.html` — anonymous survey (mailto fallback)
- `privacy.html`

## Local preview
```bash
python -m http.server 8000
# open http://localhost:8000
```

## Deploy (GitHub Pages)
1. Create repo `fuel-subsidy-impact-ng` on GitHub
2. `git init -b main && git add . && git commit -m "Launch site" && git remote add origin https://github.com/<you>/fuel-subsidy-impact-ng.git && git push -u origin main`
3. Repo Settings → Pages → Deploy from branch → `main` / root
