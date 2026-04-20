const fs   = require('fs');
const path = require('path');
const { getContent }                        = require('./content');
const { fetchPlacesData, parseHours, detectVibe } = require('./places');

const VIBES = {
  modern: {
    PRIMARY_COLOR:'#0f172a',SECONDARY_COLOR:'#1e293b',ACCENT_COLOR:'#818cf8',
    BG_COLOR:'#f8fafc',TEXT_COLOR:'#1e293b',NAV_BG:'rgba(15,23,42,0.96)',NAV_TEXT:'#f1f5f9',
    HERO_GRADIENT:'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)',
    HERO_TEXT_COLOR:'#f1f5f9',ACCENT_TEXT:'#818cf8',CARD_BG:'#ffffff',SECTION_ALT_BG:'#f1f5f9',
    FONT_PRIMARY_STACK:"'Sora', sans-serif",FONT_SECONDARY_STACK:"'Inter', sans-serif",
    FONT_URL:'https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=Inter:wght@300;400;500&display=swap',
  },
  luxury: {
    PRIMARY_COLOR:'#0a0a0a',SECONDARY_COLOR:'#2d1f0a',ACCENT_COLOR:'#c9a84c',
    BG_COLOR:'#faf9f7',TEXT_COLOR:'#1a1a1a',NAV_BG:'rgba(10,10,10,0.97)',NAV_TEXT:'#f5f0e8',
    HERO_GRADIENT:'linear-gradient(160deg, #0a0a0a 0%, #2d1f0a 100%)',
    HERO_TEXT_COLOR:'#f5f0e8',ACCENT_TEXT:'#c9a84c',CARD_BG:'#ffffff',SECTION_ALT_BG:'#f5f0e8',
    FONT_PRIMARY_STACK:"'Playfair Display', Georgia, serif",FONT_SECONDARY_STACK:"'Lato', sans-serif",
    FONT_URL:'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400&display=swap',
  },
  beachy: {
    PRIMARY_COLOR:'#1b4965',SECONDARY_COLOR:'#5fa8d3',ACCENT_COLOR:'#f4a261',
    BG_COLOR:'#fef9f0',TEXT_COLOR:'#2d3748',NAV_BG:'rgba(27,73,101,0.95)',NAV_TEXT:'#ffffff',
    HERO_GRADIENT:'linear-gradient(135deg, #1b4965 0%, #5fa8d3 100%)',
    HERO_TEXT_COLOR:'#ffffff',ACCENT_TEXT:'#e07b3a',CARD_BG:'#ffffff',SECTION_ALT_BG:'#e8f4f8',
    FONT_PRIMARY_STACK:"'Nunito', sans-serif",FONT_SECONDARY_STACK:"'Open Sans', sans-serif",
    FONT_URL:'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Open+Sans:wght@300;400&display=swap',
  },
  minimal: {
    PRIMARY_COLOR:'#1a1a1a',SECONDARY_COLOR:'#404040',ACCENT_COLOR:'#c4963a',
    BG_COLOR:'#ffffff',TEXT_COLOR:'#1a1a1a',NAV_BG:'rgba(255,255,255,0.97)',NAV_TEXT:'#1a1a1a',
    HERO_GRADIENT:'linear-gradient(180deg, #f0ede8 0%, #faf9f7 100%)',
    HERO_TEXT_COLOR:'#1a1a1a',ACCENT_TEXT:'#c4963a',CARD_BG:'#f9f9f9',SECTION_ALT_BG:'#f4f4f4',
    FONT_PRIMARY_STACK:"'DM Serif Display', Georgia, serif",FONT_SECONDARY_STACK:"'DM Sans', sans-serif",
    FONT_URL:'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap',
  },
  bold: {
    PRIMARY_COLOR:'#2b2d42',SECONDARY_COLOR:'#3d405b',ACCENT_COLOR:'#ef233c',
    BG_COLOR:'#edf2f4',TEXT_COLOR:'#2b2d42',NAV_BG:'rgba(43,45,66,0.97)',NAV_TEXT:'#ffffff',
    HERO_GRADIENT:'linear-gradient(135deg, #2b2d42 0%, #ef233c 100%)',
    HERO_TEXT_COLOR:'#ffffff',ACCENT_TEXT:'#ef233c',CARD_BG:'#ffffff',SECTION_ALT_BG:'#d9e2e8',
    FONT_PRIMARY_STACK:"'Space Grotesk', sans-serif",FONT_SECONDARY_STACK:"'Space Grotesk', sans-serif",
    FONT_URL:'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;600;700&display=swap',
  },
};

const TEMPLATE_MAP = {
  cafe:'cafe',coffee:'cafe',espresso:'cafe',bakery:'cafe',patisserie:'cafe','coffee shop':'cafe',
  coffeeshop:'cafe',diner:'cafe',bistro:'cafe',restaurant:'cafe',eatery:'cafe',boba:'cafe',
  taqueria:'cafe',mexican:'cafe',tacos:'cafe',taco:'cafe',burrito:'cafe','taco shop':'cafe',
  torta:'cafe',carnitas:'cafe','street food':'cafe','comida mexicana':'cafe',
  salon:'salon',spa:'salon',barbershop:'salon',barber:'salon','hair salon':'salon',
  'beauty salon':'salon',nail:'salon','nail salon':'salon',lash:'salon',
  generic:'generic',business:'generic',realtor:'generic',fitness:'generic',gym:'generic',
  yoga:'generic',pilates:'generic',agency:'generic',studio:'generic',clinic:'generic',
  law:'generic',dental:'generic',plumbing:'generic',cleaning:'generic',photography:'generic',
  'auto repair':'generic',auto:'generic',mechanic:'generic',automotive:'generic',
};

// Food-type business types that get the cafe template
const FOOD_TYPES = new Set([
  'cafe','coffee','espresso','bakery','patisserie','coffee shop','coffeeshop',
  'diner','bistro','restaurant','eatery','boba',
  'taqueria','mexican','tacos','taco','burrito','taco shop','torta','carnitas',
  'street food','comida mexicana',
]);

function isFoodBusiness(businessType) {
  const bt = businessType.toLowerCase().trim();
  if (FOOD_TYPES.has(bt)) return true;
  for (const k of FOOD_TYPES) { if (bt.includes(k)) return true; }
  return false;
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function replacePlaceholders(text, vars) {
  return Object.entries(vars).reduce((s, [k, v]) => s.split(`{{${k}}}`).join(v ?? ''), text);
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

function readDirRecursive(dir, base) {
  base = base || dir;
  const result = {};
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel  = path.relative(base, full);
    if (entry.isDirectory()) Object.assign(result, readDirRecursive(full, base));
    else result[rel] = fs.readFileSync(full);
  }
  return result;
}

/** Parse extraNotes string for known override signals */
function parseExtraNotes(extraNotes) {
  const notes = (extraNotes || '').toLowerCase();
  return {
    enableDelivery: /doordash|uber\s*eats|grubhub|delivery|deliver/.test(notes),
    forceBilingual: /spanish|bilingue|bilingual|espa[nñ]ol/.test(notes),
  };
}

/** Generate delivery section HTML for food businesses */
function buildDeliverySection(businessName) {
  const urlName = encodeURIComponent(businessName);
  return `
  <section class="delivery-section">
    <div class="container">
      <div class="section-header reveal">
        <span class="label-chip" data-en="Order Online" data-es="Pide en Línea">Order Online</span>
        <h2 class="section-title" data-en="Get It Delivered" data-es="Pídelo a Domicilio">Get It Delivered</h2>
      </div>
      <div class="delivery-apps">
        <a href="https://www.ubereats.com/search?q=${urlName}" target="_blank" rel="noopener" class="delivery-app">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Uber_Eats_2020_logo.svg/200px-Uber_Eats_2020_logo.svg.png" alt="Uber Eats">
          <span>Order on Uber Eats</span>
        </a>
        <a href="https://www.doordash.com/search/store/${urlName}/" target="_blank" rel="noopener" class="delivery-app">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/DoorDash_Logo.svg/200px-DoorDash_Logo.svg.png" alt="DoorDash">
          <span>Order on DoorDash</span>
        </a>
        <a href="https://www.grubhub.com/search?queryText=${urlName}" target="_blank" rel="noopener" class="delivery-app">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Grubhub_logo.svg/200px-Grubhub_logo.svg.png" alt="Grubhub">
          <span>Order on Grubhub</span>
        </a>
      </div>
    </div>
  </section>`;
}

/** Generate bilingual toggle button HTML */
function buildBilingualToggle() {
  return `<button class="lang-toggle" id="langToggle" aria-label="Toggle language">EN | ES</button>`;
}

/** Generate owner portal HTML */
function buildOwnerPortal(slug, serverUrl) {
  const password = slug.slice(0, 6);
  return `
  <!-- Owner Portal (easter egg: click footer business name 5x fast) -->
  <div id="ownerPortal" style="display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.85);overflow-y:auto;">
    <div style="max-width:560px;margin:3rem auto;background:#1a1a2e;border-radius:16px;padding:2rem;color:#f0f0ff;font-family:system-ui,sans-serif;">
      <div id="portalLock">
        <h2 style="margin-bottom:1rem;font-size:1.2rem;">Owner Portal</h2>
        <p style="font-size:.85rem;opacity:.6;margin-bottom:1rem;">Enter your password to manage this site.</p>
        <input id="portalPw" type="password" placeholder="Password" style="width:100%;padding:.7rem 1rem;border-radius:8px;border:1px solid #333;background:#0d0d1a;color:#f0f0ff;font-size:1rem;margin-bottom:.75rem;">
        <button onclick="portalUnlock()" style="width:100%;padding:.75rem;background:#7c3aed;color:#fff;border:none;border-radius:8px;font-size:1rem;cursor:pointer;">Unlock</button>
        <button onclick="document.getElementById('ownerPortal').style.display='none'" style="width:100%;padding:.6rem;background:transparent;color:#666;border:1px solid #333;border-radius:8px;font-size:.9rem;cursor:pointer;margin-top:.5rem;">Cancel</button>
        <p id="portalError" style="color:#ef4444;font-size:.8rem;margin-top:.5rem;display:none;">Incorrect password.</p>
      </div>
      <div id="portalContent" style="display:none;">
        <h2 style="margin-bottom:1.5rem;font-size:1.2rem;">Edit Your Site</h2>
        <div id="portalFields"></div>
        <button onclick="portalPush()" style="width:100%;padding:.85rem;background:#10b981;color:#fff;border:none;border-radius:8px;font-size:1rem;font-weight:600;cursor:pointer;margin-top:1.5rem;">Push Update</button>
        <p id="portalStatus" style="font-size:.82rem;margin-top:.75rem;opacity:.7;"></p>
        <button onclick="document.getElementById('ownerPortal').style.display='none'" style="width:100%;padding:.6rem;background:transparent;color:#666;border:1px solid #333;border-radius:8px;font-size:.9rem;cursor:pointer;margin-top:.5rem;">Close</button>
      </div>
    </div>
  </div>
  <script>
  (function(){
    const SLUG='${slug}';
    const PW='${password}';
    const SERVER='${serverUrl || ''}';
    let clickCount=0, clickTimer=null;
    const footerName=document.querySelector('.footer__name');
    if(footerName){
      footerName.style.cursor='pointer';
      footerName.addEventListener('click',function(){
        clickCount++;
        clearTimeout(clickTimer);
        clickTimer=setTimeout(function(){ clickCount=0; },1500);
        if(clickCount>=5){ clickCount=0; document.getElementById('ownerPortal').style.display='block'; }
      });
    }
    window.portalUnlock=function(){
      const val=document.getElementById('portalPw').value;
      if(val===PW){
        document.getElementById('portalLock').style.display='none';
        document.getElementById('portalContent').style.display='block';
        buildPortalFields();
      } else {
        document.getElementById('portalError').style.display='block';
      }
    };
    function buildPortalFields(){
      const cards=document.querySelectorAll('.menu-card,.service-card');
      let html='';
      cards.forEach(function(card,i){
        const nameEl=card.querySelector('.menu-card__name,.service-card__name');
        const priceEl=card.querySelector('.menu-card__price,.service-card__price');
        const name=nameEl?nameEl.textContent.trim():'Item '+(i+1);
        const price=priceEl?priceEl.textContent.trim():'';
        html+='<div style="margin-bottom:1rem;"><label style="font-size:.75rem;opacity:.6;display:block;margin-bottom:.3rem;">'+name+' — Price</label>';
        html+='<input data-field="price_'+(i+1)+'" value="'+price+'" style="width:100%;padding:.6rem .85rem;border-radius:8px;border:1px solid #333;background:#0d0d1a;color:#f0f0ff;font-size:.9rem;"></div>';
      });
      // Phone & hours
      html+='<div style="margin-bottom:1rem;"><label style="font-size:.75rem;opacity:.6;display:block;margin-bottom:.3rem;">Phone</label>';
      const phoneEl=document.querySelector('.contact-item[href^="tel:"]');
      html+='<input data-field="phone" value="'+(phoneEl?phoneEl.querySelector('span').textContent.trim():'')+'" style="width:100%;padding:.6rem .85rem;border-radius:8px;border:1px solid #333;background:#0d0d1a;color:#f0f0ff;font-size:.9rem;"></div>';
      html+='<div style="margin-bottom:1rem;"><label style="font-size:.75rem;opacity:.6;display:block;margin-bottom:.3rem;">Hours (Mon-Fri)</label>';
      const hrsEl=document.querySelectorAll('.hours-time');
      html+='<input data-field="hours_mon_fri" value="'+(hrsEl[0]?hrsEl[0].textContent.trim():'')+'" style="width:100%;padding:.6rem .85rem;border-radius:8px;border:1px solid #333;background:#0d0d1a;color:#f0f0ff;font-size:.9rem;"></div>';
      document.getElementById('portalFields').innerHTML=html;
    }
    window.portalPush=function(){
      const inputs=document.querySelectorAll('#portalFields input');
      const updates={};
      inputs.forEach(function(inp){ updates[inp.dataset.field]=inp.value; });
      const statusEl=document.getElementById('portalStatus');
      statusEl.textContent='Pushing update...';
      fetch((SERVER||'')+'/update-site',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({slug:SLUG,password:PW,updates:updates})
      }).then(function(r){ return r.json(); }).then(function(data){
        if(data.ok) statusEl.textContent='Updated! Refresh in ~60s to see changes.';
        else statusEl.textContent='Error: '+(data.error||'unknown');
      }).catch(function(e){ statusEl.textContent='Network error: '+e.message; });
    };
  })();
  </script>`;
}

async function generateSite(businessName, businessType, city, vibe, log, extraNotes) {
  log = log || (() => {});

  const templateKey = TEMPLATE_MAP[businessType.toLowerCase().trim()] ?? 'generic';
  const isFood      = isFoodBusiness(businessType);

  // Parse extra notes for overrides
  const notesOpts = parseExtraNotes(extraNotes);
  const enableDelivery = isFood && (notesOpts.enableDelivery || isFood); // always show for food
  const forceBilingual = notesOpts.forceBilingual;

  const slug      = slugify(businessName);
  const outputDir = path.join(__dirname, 'sites', slug);

  // Determine server URL (for owner portal)
  const serverUrl = process.env.SERVER_URL || '';

  // Defaults — will be overridden by Places data if available
  let resolvedVibe = vibe || null;
  let placeData    = null;

  // ── Google Places ────────────────────────────────────────────────────────────
  let googleKey = process.env.GOOGLE_PLACES_KEY;
  if (!googleKey) {
    try { googleKey = require('./google-places').apiKey; } catch (_) {}
  }

  if (googleKey) {
    log({ step: 'places', msg: 'Searching Google Places...' });
    fs.mkdirSync(outputDir, { recursive: true });
    const gp = await fetchPlacesData(businessName, city, googleKey, outputDir);
    if (gp) placeData = gp;
  }

  // Auto-detect vibe if not provided
  if (!resolvedVibe) {
    if (placeData) {
      resolvedVibe = detectVibe(placeData.place, businessType);
    } else {
      resolvedVibe = detectVibe(null, businessType);
    }
  }

  const vibeKey    = resolvedVibe.toLowerCase().replace(/\s+/g, '');
  const vibeConfig = VIBES[vibeKey] ?? VIBES.modern;
  const content    = getContent(templateKey, businessName, city);

  const vars = {
    BUSINESS_NAME:    businessName,
    CITY:             city,
    BUSINESS_TYPE:    businessType,
    YEAR:             new Date().getFullYear().toString(),
    ...vibeConfig,
    ...content,
    EXTRA_STYLES:     '',
    HERO_PHOTO_DIV:   '',
    PHOTOS_SECTION:   '',
    GOOGLE_RATING:    '',
    DELIVERY_SECTION: '',
    BILINGUAL_TOGGLE: '',
    OWNER_PORTAL:     '',
    SERVER_URL:       serverUrl,
    // Internal hint — not rendered visibly but stored in vars
    EXTRA_NOTES_HINT: extraNotes || '',
  };

  // Apply Places data if we got it
  if (placeData) {
    const { place, photoFiles } = placeData;

    if (place.formatted_phone_number) vars.PHONE = place.formatted_phone_number;
    if (place.formatted_address)      vars.CITY  = place.formatted_address;

    const hrs = parseHours(place.opening_hours?.weekday_text);
    if (hrs) {
      if (hrs.monFri) vars.HOURS_MON_FRI = hrs.monFri;
      if (hrs.sat)    vars.HOURS_SAT     = hrs.sat;
      if (hrs.sun)    vars.HOURS_SUN     = hrs.sun;
    }

    if (place.reviews && place.reviews.length > 0) {
      const top = [...place.reviews]
        .filter(r => r.text && r.text.length > 20)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);
      top.forEach((r, i) => {
        vars[`TESTIMONIAL_${i + 1}`]        = r.text;
        vars[`TESTIMONIAL_${i + 1}_AUTHOR`] = r.author_name;
      });
    }

    if (place.rating) {
      const stars = Math.round(place.rating);
      const str   = '★'.repeat(stars) + '☆'.repeat(5 - stars);
      const count = place.user_ratings_total ? ` · ${place.user_ratings_total.toLocaleString()} reviews` : '';
      vars.GOOGLE_RATING = `<div class="google-rating"><span class="g-stars">${str}</span> ${place.rating}${count} on Google</div>`;
    }

    if (photoFiles.length > 0) {
      vars.HERO_PHOTO_DIV = `<div class="hero__photo" style="background-image:url('${photoFiles[0]}')"></div>`;
      const imgs = photoFiles.map(f => `        <img src="${f}" alt="${businessName}" loading="lazy">`).join('\n');
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

  // ── Delivery section ─────────────────────────────────────────────────────────
  if (enableDelivery && templateKey === 'cafe') {
    vars.DELIVERY_SECTION = buildDeliverySection(businessName);
  }

  // ── Bilingual toggle ─────────────────────────────────────────────────────────
  if ((isFood && templateKey === 'cafe') || forceBilingual) {
    vars.BILINGUAL_TOGGLE = buildBilingualToggle();
  }

  // ── Owner portal ─────────────────────────────────────────────────────────────
  vars.OWNER_PORTAL = buildOwnerPortal(slug, serverUrl);

  // ── Save meta.json ────────────────────────────────────────────────────────────
  fs.mkdirSync(outputDir, { recursive: true });
  const meta = { businessName, businessType, city, extraNotes: extraNotes || '', templateKey, vibeKey: VIBES[vibeKey] ? vibeKey : 'modern' };
  fs.writeFileSync(path.join(outputDir, 'meta.json'), JSON.stringify(meta, null, 2), 'utf8');

  // ── Build ────────────────────────────────────────────────────────────────────
  log({ step: 'build', msg: 'Building site...' });
  const templateDir = path.join(__dirname, 'templates', templateKey);
  copyTemplate(templateDir, outputDir, vars);

  const files = readDirRecursive(outputDir);
  return { slug, outputDir, files, templateKey, vibeKey: VIBES[vibeKey] ? vibeKey : 'modern' };
}

module.exports = { generateSite, slugify, isFoodBusiness };
