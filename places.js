const https = require('https');
const fs    = require('fs');
const path  = require('path');

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('JSON parse failed')); }
      });
    }).on('error', reject);
  });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const attempt = (targetUrl) => {
      const file = fs.createWriteStream(destPath);
      https.get(targetUrl, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          file.close();
          fs.unlink(destPath, () => {});
          attempt(res.headers.location);
          return;
        }
        if (res.statusCode !== 200) {
          file.close();
          fs.unlink(destPath, () => {});
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        res.pipe(file);
        file.on('finish', () => file.close(resolve));
        file.on('error', (err) => { fs.unlink(destPath, () => {}); reject(err); });
      }).on('error', (err) => { fs.unlink(destPath, () => {}); reject(err); });
    };
    attempt(url);
  });
}

function parseHours(weekdayText) {
  if (!weekdayText || !weekdayText.length) return null;
  const map = {};
  weekdayText.forEach(line => {
    const idx = line.indexOf(': ');
    if (idx !== -1) map[line.slice(0, idx).toLowerCase()] = line.slice(idx + 2);
  });
  const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  const wdHours  = weekdays.map(d => map[d]).filter(Boolean);
  const allSame  = wdHours.length === 5 && wdHours.every(h => h === wdHours[0]);
  return {
    monFri: allSame ? wdHours[0] : (map['monday'] || wdHours[0] || ''),
    sat:    map['saturday'] || 'Closed',
    sun:    map['sunday']   || 'Closed',
  };
}

async function fetchPlacesData(businessName, city, apiKey, outputDir) {
  try {
    const query     = encodeURIComponent(`${businessName} ${city}`);
    const searchRes = await httpsGet(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${apiKey}`
    );

    if (!searchRes.results || searchRes.results.length === 0) {
      console.log('  ⚠  No Places results found — using template defaults.');
      return null;
    }

    const placeId = searchRes.results[0].place_id;
    const fields  = 'name,formatted_address,formatted_phone_number,opening_hours,rating,user_ratings_total,reviews,photos,website';
    const detRes  = await httpsGet(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${apiKey}`
    );

    if (!detRes.result) return null;
    const place = detRes.result;

    // Download photos
    const photoFiles = [];
    if (place.photos && place.photos.length > 0) {
      fs.mkdirSync(path.join(outputDir, 'photos'), { recursive: true });
      const num = Math.min(place.photos.length, 6);
      process.stdout.write(`  Downloading ${num} photos`);
      for (let i = 0; i < num; i++) {
        const ref  = place.photos[i].photo_reference;
        const dest = path.join(outputDir, 'photos', `photo-${i + 1}.jpg`);
        try {
          await downloadFile(
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${ref}&key=${apiKey}`,
            dest
          );
          photoFiles.push(`photos/photo-${i + 1}.jpg`);
          process.stdout.write('.');
        } catch (_) { /* skip failed photo */ }
      }
      console.log(' done');
    }

    return { place, photoFiles };
  } catch (e) {
    console.log(`  ⚠  Google Places error: ${e.message}`);
    return null;
  }
}

module.exports = { fetchPlacesData, parseHours };
