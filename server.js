const express = require('express');
const path    = require('path');
const fs      = require('fs');

const { generateSite, slugify } = require('./generator-core');
const { pushSiteToGitHub }      = require('./github');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// GitHub token: env var takes priority, then local config file
let GITHUB_TOKEN = process.env.GITHUB_TOKEN || null;
try { GITHUB_TOKEN = GITHUB_TOKEN || require('./google-places').githubToken || null; } catch (_) {}

app.post('/generate', async (req, res) => {
  const { businessName, businessType, city, extraNotes } = req.body;
  // vibe is now optional — auto-detected if not supplied
  const vibe = req.body.vibe || null;

  if (!businessName || !businessType || !city) {
    return res.status(400).json({ error: 'Missing fields: businessName, businessType, city are required.' });
  }

  // Server-Sent Events
  res.setHeader('Content-Type',  'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection',    'keep-alive');
  res.flushHeaders();

  const send = (obj) => {
    res.write(`data: ${JSON.stringify(obj)}\n\n`);
    if (res.flush) res.flush();
  };

  try {
    const { slug, files } = await generateSite(businessName, businessType, city, vibe, send, extraNotes);

    if (!GITHUB_TOKEN) {
      send({ step: 'error', msg: 'No GitHub token configured. Set GITHUB_TOKEN env var on Render.' });
      return res.end();
    }

    send({ step: 'github', msg: 'Pushing to GitHub...' });
    const { repoUrl, liveUrl } = await pushSiteToGitHub(slug, files, GITHUB_TOKEN);

    send({ step: 'done', slug, repoUrl, liveUrl });
  } catch (err) {
    send({ step: 'error', msg: err.message });
  }

  res.end();
});

app.post('/update-site', async (req, res) => {
  const { slug, password, updates } = req.body;
  if (!slug || !password) {
    return res.status(400).json({ error: 'slug and password are required' });
  }

  // Verify password: first 6 chars of slug
  const expectedPw = slug.slice(0, 6);
  if (password !== expectedPw) {
    return res.status(403).json({ error: 'Invalid password' });
  }

  // Load stored meta
  const metaPath = path.join(__dirname, 'sites', slug, 'meta.json');
  if (!fs.existsSync(metaPath)) {
    return res.status(404).json({ error: 'Site meta not found. Please regenerate the site.' });
  }

  let meta;
  try { meta = JSON.parse(fs.readFileSync(metaPath, 'utf8')); }
  catch (e) { return res.status(500).json({ error: 'Failed to read site meta' }); }

  try {
    const { businessName, businessType, city, extraNotes } = meta;

    // Regenerate the site
    const { files } = await generateSite(businessName, businessType, city, null, () => {}, extraNotes);

    if (!GITHUB_TOKEN) {
      return res.status(500).json({ error: 'No GitHub token configured' });
    }

    const { repoUrl, liveUrl } = await pushSiteToGitHub(slug, files, GITHUB_TOKEN);
    res.json({ ok: true, slug, repoUrl, liveUrl, updates });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Website generator running on http://localhost:${PORT}`));
