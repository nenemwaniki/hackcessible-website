import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('..', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

test('site-wide routes and contact address stay canonical', async () => {
  const files = await Promise.all(['index.html', 'cohorts.html', 'people.html', 'contact.html', 'site.js', 'enhancements.js'].map(read));
  const source = files.join('\n');
  assert.doesNotMatch(source, /href="(?:index|groups)\.html"[^>]*>[^<]*Cohort/i);
  for (const match of source.matchAll(/mailto:([^?"'&]+)/g)) assert.equal(match[1], 'nbi.cime@aku.edu');
  assert.match(files[4], /href="cohorts\.html">Cohorts/);
});

test('reported typography, light theme and footer hover fixes are present', async () => {
  const [home, styles] = await Promise.all([read('index.html'), read('enhancements.css')]);
  assert.match(home, /<div class="word-band"[^>]*><span>Listen<\/span><span>Co-design<\/span><span>Prototype<\/span><span>Learn<\/span>/);
  assert.match(styles, /:root\{--paper:#f2f3f7/);
  assert.match(styles, /\.what-we-do h2,\.page-head h1\{letter-spacing:-\.04em\}/);
  assert.match(styles, /\.foot a\{text-decoration:none\}/);
  assert.match(styles, /@media\(max-width:760px\)\{[\s\S]*?\.word-band\{grid-template-columns:1fr/);
  assert.match(styles, /\.door h3\{font-size:clamp\(32px,10vw,42px\)/);
});

test('lightbox controls sit within image bounds with stronger contrast', async () => {
  const [js, styles] = await Promise.all([read('enhancements.js'), read('enhancements.css')]);
  assert.match(js, /lightbox-stage"><div class="lightbox-media">/);
  assert.match(styles, /\.lightbox-close\{position:absolute;top:14px;right:14px\}/);
  assert.match(styles, /\.lightbox-nav\{[^}]*inset:50% 14px auto/);
  assert.match(styles, /background:rgba\(8,10,16,\.68\)/);
});

test('People keeps Sheffield as inspiration and labels M5 Engineering', async () => {
  const people = await read('people.html');
  assert.match(people, /<strong>M5 Engineering<\/strong>/);
  assert.match(people, /Model inspiration[\s\S]*University of Sheffield/);
  assert.doesNotMatch(people, /not presented as an official programme partner/);
});

test('every form control has an explicit accessible name', async () => {
  const [contact, enhancements] = await Promise.all([read('contact.html'), read('enhancements.js')]);
  for (const match of contact.matchAll(/<(input|textarea)\b([^>]*)>/g)) {
    const id = match[2].match(/\bid="([^"]+)"/)?.[1];
    assert.ok(id, `${match[1]} is missing an id`);
    assert.match(contact, new RegExp(`<label[^>]*for="${id}"`));
  }
  assert.match(enhancements, /<input[^>]*aria-label="Quick jump"/);
});
