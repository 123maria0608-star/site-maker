const express = require('express');
const path    = require('path');

const { generateSite }      = require('./generator-core');
const { pushSiteToGitHub }  = require('./github');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// GitHub token: env var takes priority, then local config file
let GITHUB_TOKEN = process.env.GITHUB_TOKEN || null;
try { GITHUB_TOKEN = GITHUB_TOKEN || require('./google-places').githubToken || null; } catch (_) {}

app.post('/generate', async (req, res) => {
  const { businessName, businessType, city, vibe } = req.body;
  if (!businessName || !businessType || !city || !vibe) {
    return res.status(400).json({ error: 'Missing fields' });
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
    const { slug, files } = await generateSite(businessName, businessType, city, vibe, send);

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Website generator running on http://localhost:${PORT}`));
