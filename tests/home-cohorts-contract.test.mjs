import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('..', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

test('homepage uses the reference destination-card layout and an unrestricted programme headline', async () => {
  const [home, baseStyles, experienceStyles] = await Promise.all([read('index.html'), read('styles.css'), read('experience-updates.css')]);
  const styles = baseStyles + experienceStyles;

  assert.doesNotMatch(home, /Assistive technology<br>that fits real lives\./);
  assert.match(styles, /\.door-grid\{[^}]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(styles, /\.door-cohorts\{grid-column:1 \/ -1/);
  assert.match(styles, /\.door\{[^}]*min-height:372\.609375px/);
  assert.match(styles, /\.door-cohorts\{[^}]*min-height:339\.453125px/);
  assert.match(styles, /\.door-people,\.door-interest\{min-height:372\.609375px/);
});

test('Cohort 2026 keeps only its animated TimeKeeper/Sawa pill switcher sticky', async () => {
  const [cohorts, baseStyles, experienceStyles] = await Promise.all([read('cohorts.html'), read('styles.css'), read('experience-updates.css')]);
  const styles = baseStyles + experienceStyles;

  assert.match(cohorts, /id="caseSwitchIndicator"/);
  assert.match(styles, /\.case-switch\{[^}]*position:sticky/);
  assert.match(styles, /\.case-switch-indicator\{[^}]*display:block/);
  assert.match(styles, /\.case-panel aside\{position:static/);
});
