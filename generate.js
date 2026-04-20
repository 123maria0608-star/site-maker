#!/usr/bin/env node

const readline = require('readline');
const fs       = require('fs');
const path     = require('path');
const { getContent }       = require('./content');
const { fetchPlacesData, parseHours } = require('./places');

let GOOGLE_PLACES_KEY = process.env.GOOGLE_PLACES_KEY || null;
try { GOOGLE_PLACES_KEY = GOOGLE_PLACES_KEY || require('./google-places').apiKey; } catch (_) {}

// ─── Vibe Configurations ──────────────────────────────────────────────────────

const VIBES = {
  modern: {
    PRIMARY_COLOR:    '#0f172a',
    SECONDARY_COLOR:  '#1e293b',
    ACCENT_COLOR:     '#818cf8',
    BG_COLOR:         '#f8fafc',
    TEXT_COLOR:       '#1e293b',
    NAV_BG:           'rgba(15,23,42,0.96)',
    NAV_TEXT:         '#f1f5f9',
    HERO_GRADIENT:    'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)',
    HERO_TEXT_COLOR:  '#f1f5f9',
    ACCENT_TEXT:      '#818cf8',
    CARD_BG:          '#ffffff',
    SECTION_ALT_BG:   '#f1f5f9',
    FONT_PRIMARY_STACK:   "'Sora', sans-serif",
    FONT_SECONDARY_STACK: "'Inter', sans-serif",
    FONT_URL: 'https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=Inter:wght@300;400;500&display=swap',
  },
  luxury: {
    PRIMARY_COLOR:    '#0a0a0a',
    SECONDARY_COLOR:  '#2d1f0a',
    ACCENT_COLOR:     '#c9a84c',
    BG_COLOR:         '#faf9f7',
    TEXT_COLOR:       '#1a1a1a',
    NAV_BG:           'rgba(10,10,10,0.97)',
    NAV_TEXT:         '#f5f0e8',
    HERO_GRADIENT:    'linear-gradient(160deg, #0a0a0a 0%, #2d1f0a 100%)',
    HERO_TEXT_COLOR:  '#f5f0e8',
    ACCENT_TEXT:      '#c9a84c',
    CARD_BG:          '#ffffff',
    SECTION_ALT_BG:   '#f5f0e8',
    FONT_PRIMARY_STACK:   "'Playfair Display', Georgia, serif",
    FONT_SECONDARY_STACK: "'Lato', sans-serif",
    FONT_URL: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400&display=swap',
  },
  beachy: {
    PRIMARY_COLOR:    '#1b4965',
    SECONDARY_COLOR:  '#5fa8d3',
    ACCENT_COLOR:     '#f4a261',
    BG_COLOR:         '#fef9f0',
    TEXT_COLOR:       '#2d3748',
    NAV_BG:           'rgba(27,73,101,0.95)',
    NAV_TEXT:         '#ffffff',
    HERO_GRADIENT:    'linear-gradient(135deg, #1b4965 0%, #5fa8d3 100%)',
    HERO_TEXT_COLOR:  '#ffffff',
    ACCENT_TEXT:      '#e07b3a',
    CARD_BG:          '#ffffff',
    SECTION_ALT_BG:   '#e8f4f8',
    FONT_PRIMARY_STACK:   "'Nunito', sans-serif",
    FONT_SECONDARY_STACK: "'Open Sans', sans-serif",
    FONT_URL: 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Open+Sans:wght@300;400&display=swap',
  },
  minimal: {
    PRIMARY_COLOR:    '#1a1a1a',
    SECONDARY_COLOR:  '#404040',
    ACCENT_COLOR:     '#c4963a',
    BG_COLOR:         '#ffffff',
    TEXT_COLOR:       '#1a1a1a',
    NAV_BG:           'rgba(255,255,255,0.97)',
    NAV_TEXT:         '#1a1a1a',
    HERO_GRADIENT:    'linear-gradient(180deg, #f0ede8 0%, #faf9f7 100%)',
    HERO_TEXT_COLOR:  '#1a1a1a',
    ACCENT_TEXT:      '#c4963a',
    CARD_BG:          '#f9f9f9',
    SECTION_ALT_BG:   '#f4f4f4',
    FONT_PRIMARY_STACK:   "'DM Serif Display', Georgia, serif",
    FONT_SECONDARY_STACK: "'DM Sans', sans-serif",
    FONT_URL: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap',
  },
  bold: {
    PRIMARY_COLOR:    '#2b2d42',
    SECONDARY_COLOR:  '#3d405b',
    ACCENT_COLOR:     '#ef233c',
    BG_COLOR:         '#edf2f4',
    TEXT_COLOR:       '#2b2d42',
    NAV_BG:           'rgba(43,45,66,0.97)',
    NAV_TEXT:         '#ffffff',
    HERO_GRADIENT:    'linear-gradient(135deg, #2b2d42 0%, #ef233c 100%)',
    HERO_TEXT_COLOR:  '#ffffff',
    ACCENT_TEXT:      '#ef233c',
    CARD_BG:          '#ffffff',
    SECTION_ALT_BG:   '#d9e2e8',
    FONT_PRIMARY_STACK:   "'Space Grotesk', sans-serif",
    FONT_SECONDARY_STACK: "'Space Grotesk', sans-serif",
    FONT_URL: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;600;700&display=swap',
  },
};

// ─── Template Routing ─────────────────────────────────────────────────────────

const TEMPLATE_MAP = {
  cafe: 'cafe',        coffee: 'cafe',       espresso: 'cafe',
  bakery: 'cafe',      patisserie: 'cafe',   'coffee shop': 'cafe',
  coffeeshop: 'cafe',  diner: 'cafe',        bistro: 'cafe',
  restaurant: 'cafe',  eatery: 'cafe',       boba: 'cafe',
  salon: 'salon',      spa: 'salon',         barbershop: 'salon',
  barber: 'salon',     'hair salon': 'salon','beauty salon': 'salon',
  nail: 'salon',       'nail salon': 'salon',lash: 'salon',
  generic: 'generic',  business: 'generic',  realtor: 'generic',
  fitness: 'generic',  gym: 'generic',       yoga: 'generic',
  pilates: 'generic',  agency: 'generic',    studio: 'generic',
  clinic: 'generic',   law: 'generic',       dental: 'generic',
  plumbing: 'generic', cleaning: 'generic',  photography: 'generic',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ask(rl, question) {
  return new Promise(resolve => rl.question(question, a => resolve(a.trim())));
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function replacePlaceholders(text, vars) {
  return Object.entries(vars).reduce((str, [k, v]) => {
    return str.split(`{{${k}}}`).join(v ?? '');
  }, text);
}

function copyTemplate(src, dest, vars) {
  fs.mkdirSync(dest, { recursive: true });
  for (const file of fs.readdirSync(src)) {
    const srcPath  = path.join(src, file);
    const destPath = path.join(dest, file);
    if (fs.statSync(srcPath).isFile()) {
      const raw = fs.readFileSync(srcPath, 'utf8');
      fs.writeFileSync(destPath, replacePlaceholders(raw, vars), 'utf8');
    }
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log('');
  console.log('  ╔══════════════════════════════════════════════╗');
  console.log('  ║     Local Website Generator  v1.0           ║');
  console.log('  ║     Google Places + real photos included.   ║');
  console.log('  ╚══════════════════════════════════════════════╝');
  console.log('');

  const businessName = await ask(rl, '  Business name:                           ');
  const businessType = await ask(rl, '  Business type (cafe/salon/gym/etc):      ');
  const city         = await ask(rl, '  City / location:                         ');
  const vibe         = await ask(rl, '  Vibe (modern/luxury/beachy/minimal/bold): ');

  rl.close();

  const templateKey  = TEMPLATE_MAP[businessType.toLowerCase()] ?? 'generic';
  const vibeKey      = vibe.toLowerCase().replace(/\s+/g, '');
  const vibeConfig   = VIBES[vibeKey] ?? VIBES.modern;
  const resolvedVibe = VIBES[vibeKey] ? vibeKey : 'modern';

  const content = getContent(templateKey, businessName, city);
  const slug    = slugify(businessName);
  const outputDir = path.join(__dirname, 'sites', slug);

  const vars = {
    BUSINESS_NAME: businessName,
    CITY:          city,
    BUSINESS_TYPE: businessType,
    YEAR:          new Date().getFullYear().toString(),
    ...vibeConfig,
    ...content,
    // placeholders — overridden below if Places data found
    EXTRA_STYLES:       '',
    HERO_PHOTO_DIV:     '',
    PHOTOS_SECTION:     '',
    GOOGLE_RATING:      '',
  };

  console.log('');

  // ── Google Places enrichment ───────────────────────────────────────────────
  if (GOOGLE_PLACES_KEY) {
    fs.mkdirSync(outputDir, { recursive: true });
    const gp = await fetchPlacesData(businessName, city, GOOGLE_PLACES_KEY, outputDir);

    if (gp) {
      const { place, photoFiles } = gp;

      if (place.formatted_phone_number) vars.PHONE   = place.formatted_phone_number;
      if (place.formatted_address)      vars.CITY    = place.formatted_address;

      const hrs = parseHours(place.opening_hours?.weekday_text);
      if (hrs) {
        if (hrs.monFri) vars.HOURS_MON_FRI = hrs.monFri;
        if (hrs.sat)    vars.HOURS_SAT     = hrs.sat;
        if (hrs.sun)    vars.HOURS_SUN     = hrs.sun;
      }

      // Real Google reviews → replace fake testimonials
      if (place.reviews && place.reviews.length > 0) {
        const topReviews = [...place.reviews]
          .filter(r => r.text && r.text.length > 20)
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3);
        topReviews.forEach((r, i) => {
          vars[`TESTIMONIAL_${i + 1}`]        = r.text.replace(/"/g, '\u201c').replace(/"/g, '\u201d');
          vars[`TESTIMONIAL_${i + 1}_AUTHOR`] = r.author_name;
        });
      }

      // Google rating badge
      if (place.rating) {
        const stars = Math.round(place.rating);
        const starStr = '★'.repeat(stars) + '☆'.repeat(5 - stars);
        const count = place.user_ratings_total ? ` · ${place.user_ratings_total.toLocaleString()} reviews` : '';
        vars.GOOGLE_RATING = `<div class="google-rating"><span class="g-stars">${starStr}</span> ${place.rating}${count} on Google</div>`;
      }

      // Hero photo background
      if (photoFiles.length > 0) {
        vars.HERO_PHOTO_DIV = `<div class="hero__photo" style="background-image:url('${photoFiles[0]}')"></div>`;
      }

      // Photos gallery section
      if (photoFiles.length > 0) {
        const imgs = photoFiles.map(f =>
          `        <img src="${f}" alt="${businessName}" loading="lazy">`
        ).join('\n');
        vars.PHOTOS_SECTION = `
  <!-- ── Photos ── -->
  <section class="photos-section">
    <div class="container">
      <div class="section-header">
        <span class="section-label">See For Yourself</span>
        <h2 class="section-title">Photos</h2>
      </div>
      <div class="photos-grid">
${imgs}
      </div>
    </div>
  </section>`;
      }

      // Inject extra CSS for photos + rating badge
      vars.EXTRA_STYLES = `<style>
  .hero__photo{position:absolute;inset:0;background-size:cover;background-position:center;opacity:.32;}
  .photos-section{padding:5rem 0;background:var(--section-alt);}
  .photos-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem;}
  .photos-grid img{width:100%;height:220px;object-fit:cover;border-radius:var(--radius);transition:transform var(--transition),box-shadow var(--transition);}
  .photos-grid img:hover{transform:scale(1.025);box-shadow:var(--shadow-lg);}
  .google-rating{display:flex;align-items:center;gap:.45rem;justify-content:center;margin-top:.5rem;font-size:.88rem;opacity:.7;}
  .g-stars{color:#f9ab00;letter-spacing:.05em;}
</style>`;
    }
  } else {
    console.log('  (No Google Places key found — skipping live data)');
  }

  // ── Build site ─────────────────────────────────────────────────────────────
  console.log('  Building your site...');

  const templateDir = path.join(__dirname, 'templates', templateKey);
  copyTemplate(templateDir, outputDir, vars);

  console.log('');
  console.log('  ✓ Done! Your website is ready.\n');
  console.log(`  📁 Folder:    sites/${slug}/`);
  console.log(`  🎨 Template:  ${templateKey}  |  Vibe: ${resolvedVibe}`);
  console.log(`  🌐 Preview:   open sites/${slug}/index.html`);
  console.log('');
  console.log('  Files generated:');
  console.log(`    sites/${slug}/index.html`);
  console.log(`    sites/${slug}/styles.css`);
  console.log(`    sites/${slug}/script.js`);
  console.log('');
  console.log('  To deploy: drag the folder into Netlify Drop, Vercel, or GitHub Pages.');
  console.log('');
}

main().catch(err => {
  console.error('\n  Error:', err.message);
  process.exit(1);
});
