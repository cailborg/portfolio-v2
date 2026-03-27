#!/usr/bin/env node
/**
 * Scrapes photo posts from fortrainingporpoisesonly.tumblr.com
 * and saves them to public/shuffle/ with a manifest.json index.
 *
 * Usage: npm run scrape
 * Re-run whenever you publish new posts to your blog.
 */

import { createWriteStream, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { pipeline } from 'stream/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'shuffle');
const MANIFEST_PATH = path.join(OUTPUT_DIR, 'manifest.json');
const BLOG = 'fortrainingporpoisesonly';

// Tumblr legacy API v1 — no auth required, server-side only
const API_BASE = `https://${BLOG}.tumblr.com/api/read/json`;

mkdirSync(OUTPUT_DIR, { recursive: true });

async function fetchPage(start) {
  const url = `${API_BASE}?type=photo&num=50&start=${start}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  let text = await res.text();
  // Strip JSONP wrapper: "var tumblr_api_read = {...};"
  text = text.replace(/^var tumblr_api_read\s*=\s*/, '').replace(/;\s*$/, '');
  return JSON.parse(text);
}

function getBestPhotoUrl(post) {
  // Try largest resolution first
  for (const size of [1280, 500, 400, 250, 100]) {
    const key = `photo-url-${size}`;
    if (post[key]) return post[key];
  }
  // Fallback: photos array (newer post format)
  if (post.photos && post.photos.length > 0) {
    const photo = post.photos[0];
    if (photo['photo-url-1280']) return photo['photo-url-1280'];
    if (photo['photo-url-500']) return photo['photo-url-500'];
  }
  return null;
}

async function downloadImage(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} downloading ${url}`);
  await pipeline(res.body, createWriteStream(destPath));
}

function extFromUrl(url) {
  const match = url.match(/\.(jpe?g|png|gif|webp)(\?|$)/i);
  return match ? match[1].toLowerCase().replace('jpeg', 'jpg') : 'jpg';
}

async function main() {
  console.log(`Scraping photos from ${BLOG}.tumblr.com...`);

  // Load existing manifest to skip already-downloaded files
  let existing = new Set();
  if (existsSync(MANIFEST_PATH)) {
    const prev = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
    existing = new Set(prev);
    console.log(`  Found ${existing.size} previously downloaded images`);
  }

  const allUrls = [];
  let start = 0;
  let total = 0;

  while (true) {
    console.log(`  Fetching posts ${start}–${start + 49}...`);
    let data;
    try {
      data = await fetchPage(start);
    } catch (err) {
      console.error(`  Failed to fetch page at start=${start}:`, err.message);
      break;
    }

    const posts = data.posts || [];
    if (posts.length === 0) break;

    if (total === 0) {
      total = data['posts-total'] || '?';
      console.log(`  Total photo posts: ${total}`);
    }

    for (const post of posts) {
      const photoUrl = getBestPhotoUrl(post);
      if (!photoUrl) continue;
      allUrls.push(photoUrl);
    }

    start += posts.length;
    if (posts.length < 50) break;
  }

  console.log(`\nFound ${allUrls.length} photos. Downloading new ones...`);

  const manifest = [];
  let downloaded = 0;
  let skipped = 0;

  for (let i = 0; i < allUrls.length; i++) {
    const url = allUrls[i];
    const ext = extFromUrl(url);
    const filename = `${i}.${ext}`;
    const destPath = path.join(OUTPUT_DIR, filename);
    const manifestEntry = `/shuffle/${filename}`;

    manifest.push(manifestEntry);

    if (existing.has(manifestEntry) && existsSync(destPath)) {
      skipped++;
      continue;
    }

    try {
      await downloadImage(url, destPath);
      downloaded++;
      process.stdout.write(`  [${i + 1}/${allUrls.length}] Downloaded ${filename}\r`);
    } catch (err) {
      console.error(`\n  Error downloading ${url}: ${err.message}`);
    }
  }

  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`\n\nDone!`);
  console.log(`  Downloaded: ${downloaded} new images`);
  console.log(`  Skipped:    ${skipped} already cached`);
  console.log(`  Total:      ${manifest.length} images in manifest`);
  console.log(`  Manifest:   public/shuffle/manifest.json`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
