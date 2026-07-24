import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('..', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

test('homepage Explore uses three compact, distinctly coloured cards on one row', async () => {
  const [home, baseStyles, experienceStyles] = await Promise.all([read('index.html'), read('styles.css'), read('experience-updates.css')]);
  const styles = baseStyles + experienceStyles;

  // Headline spans the content area (no forced break).
  assert.doesNotMatch(home, /Assistive technology<br>that fits real lives\./);

  // Three equal cards on a single row.
  assert.match(styles, /\.door-grid\{[^}]*grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
  assert.match(styles, /\.door-cohorts,\.door-people,\.door-interest\{grid-column:auto;min-height:0/);

  // Each card a distinct colour.
  assert.match(styles, /\.door-cohorts\{background:var\(--blue\)/);
  assert.match(styles, /\.door-people\{background:var\(--coral\)/);
  assert.match(styles, /\.door-interest\{background:var\(--yellow\)/);

  // Text carousel reduced to 38px.
  assert.match(styles, /\.word-band\{[^}]*font-size:38px/);
});

test('Cohort 2026 pins both the TimeKeeper/Sawa pill and the left case header while copy scrolls', async () => {
  const [cohorts, baseStyles, experienceStyles] = await Promise.all([read('cohorts.html'), read('styles.css'), read('experience-updates.css')]);
  const styles = baseStyles + experienceStyles;

  assert.match(cohorts, /id="caseSwitchIndicator"/);
  // Toggle stays sticky, with a defined colour and bolder label.
  assert.match(styles, /\.case-switch\{[^}]*position:sticky/);
  assert.match(styles, /\.case-switch button\{[^}]*font-weight:800/);
  // Left header now pinned too (only the right-hand copy scrolls).
  assert.match(styles, /\.case-panel aside\{position:sticky/);
  // Moments cards resized to 581 x 435.75 (4:3) with rounded edges.
  assert.match(styles, /\.moments\{[^}]*repeat\(2,minmax\(0,581px\)\)/);
  assert.match(styles, /\.moments img\{[^}]*border-radius:24px/);
});

test('Contact adopts the reference sponsor/interest pill toggle', async () => {
  const [contact, styles] = await Promise.all([read('contact.html'), read('styles.css')]);

  assert.match(contact, /class="contact-switch"/);
  assert.match(contact, /data-mode="sponsor"/);
  assert.match(contact, /data-mode="interest"/);
  assert.match(contact, /class="contact-panels"/);
  assert.match(styles, /\.contact-switch\{[^}]*position:sticky/);
  assert.match(styles, /\.contact-switch button\[aria-pressed="true"\]\{background:var\(--ink\)/);
});

test('People carousel reveals roles on hover and shows the Sheffield crest', async () => {
  const [people, baseStyles, experienceStyles] = await Promise.all([read('people.html'), read('styles.css'), read('experience-updates.css')]);
  const styles = baseStyles + experienceStyles;

  // Hover-driven popover (no click-modal dialog).
  assert.match(people, /id="personPop"/);
  assert.match(people, /addEventListener\("pointerover"/);
  assert.doesNotMatch(people, /showModal\(\)/);
  // Crest asset used.
  assert.match(people, /images\/uos-crest\.svg/);
  assert.match(styles, /\.person-pop\.show\{opacity:1/);
});

test('Site-wide motion: SPA-lite transitions with route veil header overdrop and liquid glass nav', async () => {
  const [js, styles] = await Promise.all([read('site.js'), read('styles.css')]);

  // SPA-lite navigation with route-veil header overdrop.
  assert.match(js, /page-exit/);
  assert.match(js, /page-enter-start/);
  assert.match(js, /navigate\(/);
  assert.match(js, /route-veil/);
  // Word-by-word reveal still present.
  assert.match(js, /className="rw"/);
  // Navbar shrink on scroll.
  assert.match(js, /navShell\.classList\.toggle\("scrolled"/);
  // Liquid glass nav: specular sheen, glass tokens, 980px scrolled.
  assert.match(styles, /--glass-bg:/);
  assert.match(styles, /--glass-specular:/);
  assert.match(styles, /\.nav::before\{/);
  assert.match(styles, /\.nav-shell\.scrolled \.nav\{[^}]*max-width:980px/);
  // Page transitions & route veil CSS.
  assert.match(styles, /\.page-exit\{opacity:0/);
  assert.match(styles, /\.route-veil\{position:fixed/);
  // Dark mode palette & radial background gradient.
  assert.match(styles, /radial-gradient/);
  assert.match(styles, /\.page-enter-start\{opacity:0/);
  // Word reveal CSS.
  assert.match(styles, /\.rw\{display:inline-block;opacity:0/);
  // Cursor shrunk; nav-link hover no longer a full black fill.
  assert.match(styles, /\.pointer\{[^}]*width:12px;height:12px/);
  assert.match(styles, /\.nav-link:hover\{background:color-mix/);
  // No custom scroll hijack.
  assert.doesNotMatch(js, /addEventListener\("wheel"/);
});
