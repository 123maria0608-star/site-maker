# Local Website Generator

Generate a complete, ready-to-deploy static website for any small business in under 60 seconds.
No internet connection required. No API keys. No monthly fees. Unlimited sites.

---

## Folder Structure

```
/
├── generate.js          ← Run this to create a site
├── content.js           ← Pre-written copy library (edit to customize)
├── templates/
│   ├── cafe/            ← Template for cafes, restaurants, bakeries, diners
│   ├── salon/           ← Template for salons, spas, barbershops
│   └── generic/         ← Template for any other business type
└── sites/
    └── business-name/   ← Your generated websites land here
        ├── index.html
        ├── styles.css
        └── script.js
```

---

## How to Run

**Requirements:** Node.js installed (v14 or newer).
Check with: `node --version`

**Step 1 — Open your terminal and navigate to this folder:**
```bash
cd /path/to/this/folder
```

**Step 2 — Run the generator:**
```bash
node generate.js
```

**Step 3 — Answer the prompts:**
```
Business name:          Sunrise Cafe
Business type:          cafe
City / location:        Austin, TX
Vibe:                   modern
```

**Step 4 — Open your site:**
```bash
open sites/sunrise-cafe/index.html
```

That's it. A complete website is now in `sites/sunrise-cafe/`.

---

## Business Types Supported

| You type…             | Template used |
|-----------------------|---------------|
| cafe, coffee, bakery, restaurant, diner, bistro | **cafe** |
| salon, spa, barbershop, barber, nail | **salon** |
| gym, fitness, yoga, realtor, agency, studio, clinic, photography, cleaning, plumbing, generic | **generic** |

If the type isn't recognized, it falls back to the **generic** template.

---

## Vibe / Style Options

| Vibe      | Look & Feel                              | Best For                          |
|-----------|------------------------------------------|-----------------------------------|
| `modern`  | Dark navy/slate + indigo accents         | Tech-forward, hip spots           |
| `luxury`  | Black + gold, Playfair Display serif     | High-end salons, fine dining      |
| `beachy`  | Ocean blue + warm coral, rounded fonts   | Beach towns, casual/fun vibes     |
| `minimal` | White + warm gold, clean serif           | Clean, editorial, boutique brands |
| `bold`    | Dark slate + red, heavy type             | Gyms, agencies, bold brands       |

---

## Deploying Your Site

Each generated site is pure HTML/CSS/JS — no build step needed.

**Option A — Netlify Drop (easiest, free):**
1. Go to [netlify.com/drop](https://app.netlify.com/drop)
2. Drag the `sites/business-name/` folder onto the page
3. Get a live URL instantly

**Option B — GitHub Pages (free, custom domain support):**
1. Create a new GitHub repo
2. Copy the contents of `sites/business-name/` into it
3. Go to Settings → Pages → Deploy from main branch

**Option C — Vercel:**
```bash
npm i -g vercel
cd sites/business-name
vercel
```

---

## Customizing Content

**To edit the pre-written copy** (taglines, about text, services, etc.):
Open `content.js` and edit any of the arrays. The generator picks from them randomly,
so adding more entries gives you more variety per generation.

**To add a new business type mapping:**
In `generate.js`, add to the `TEMPLATE_MAP` object:
```js
'brewery': 'cafe',   // maps to the cafe template
'medispa': 'salon',  // maps to the salon template
```

**To add a new vibe:**
In `generate.js`, add a new entry to the `VIBES` object following the same structure.

**To add a new template** (e.g., a `restaurant` template):
1. Create a folder: `templates/restaurant/`
2. Add `index.html`, `styles.css`, `script.js` using the same `{{PLACEHOLDER}}` syntax
3. Map business types to it in `TEMPLATE_MAP`

---

## Placeholder Reference

These are replaced automatically in every template file:

| Placeholder               | Example value                        |
|---------------------------|--------------------------------------|
| `{{BUSINESS_NAME}}`       | Sunrise Cafe                         |
| `{{CITY}}`                | Austin, TX                           |
| `{{TAGLINE}}`             | Where Every Cup Tells a Story        |
| `{{ABOUT}}`               | Full about paragraph                 |
| `{{HERO_SUBTITLE}}`       | Short hero subtitle                  |
| `{{PHONE}}`               | (555) 000-0000                       |
| `{{EMAIL}}`               | hello@sunrisecafe.com                |
| `{{HOURS_MON_FRI}}`       | 7:00 AM – 6:00 PM                    |
| `{{HOURS_SAT}}`           | 8:00 AM – 5:00 PM                    |
| `{{HOURS_SUN}}`           | 9:00 AM – 4:00 PM                    |
| `{{SERVICE_1_NAME}}`      | House Espresso                       |
| `{{SERVICE_1_DESC}}`      | Our signature blend...               |
| `{{SERVICE_1_PRICE}}`     | $4                                   |
| `{{HIGHLIGHT_1}}`         | Single-Origin Beans                  |
| `{{TESTIMONIAL_1}}`       | Working with this team...            |
| `{{PRIMARY_COLOR}}`       | #0f172a                              |
| `{{ACCENT_COLOR}}`        | #818cf8                              |
| `{{FONT_URL}}`            | Google Fonts URL                     |
| `{{YEAR}}`                | 2026                                 |

---

## Tips

- Run the generator multiple times for the same business type — the about text and tagline
  are picked randomly from pools, so you get variation.
- After generating, open the HTML file and do a quick find/replace for the phone number,
  address, and email before sending to the client.
- The sites folder is gitignored-friendly — each generated site is self-contained.
