/* THE OUTLAWS — route + structure smoke test.  node smoke-test.js  */
const fs = require('fs');

const PAGES = fs.readdirSync('.').filter(n => n.endsWith('.html'));
const failures = [];

/* runtime parses */
try { new Function(fs.readFileSync('outlaws.js', 'utf8')); }
catch (e) { failures.push(`outlaws.js does not parse (${e.message})`); }

/* every internal href resolves to a real file */
const known = new Set(PAGES);
for (const page of PAGES) {
  const src = fs.readFileSync(page, 'utf8');

  for (const m of src.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|#|\{\{)/.test(href)) continue;
    const file = href.split(/[?#]/)[0];
    if (!known.has(file)) failures.push(`${page}: dead route → ${href}`);
  }

  /* placeholder hrefs are never acceptable in shipped chrome */
  if (/href="#"/.test(src)) failures.push(`${page}: placeholder href="#"`);

  /* canonical chrome */
  if (!src.includes('class="ol-hd"')) failures.push(`${page}: missing shared header`);
  if (!src.includes('class="ol-burger"')) failures.push(`${page}: missing mobile burger`);
  if (page !== 'auth.dc.html' && !src.includes('class="ol-ft"')) failures.push(`${page}: missing shared footer`);
  if (!src.includes('outlaws.js')) failures.push(`${page}: does not load the shared runtime`);

  /* buttons must do something */
  for (const b of src.match(/<button[^>]*>/g) || []) {
    if (/onClick=|ol-burger|ol-bell|ol-drawer-x|ol-sheet-x/.test(b)) continue;
    failures.push(`${page}: button with no handler → ${b.slice(0, 70)}`);
  }
}

if (failures.length) {
  console.error(`✗ ${failures.length} problem(s)\n` + failures.map(f => '  · ' + f).join('\n'));
  process.exit(1);
}
console.log(`✓ ${PAGES.length} pages — routes, chrome and handlers all clean`);
