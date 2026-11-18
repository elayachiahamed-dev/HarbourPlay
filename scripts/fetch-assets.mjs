// Downloads every original Figma asset listed in scripts/assets.json into /assets.
// Usage: node scripts/fetch-assets.mjs   (needs internet access to www.figma.com)
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { base, files } = JSON.parse(await readFile(join(root, 'scripts/assets.json'), 'utf8'));
let ok = 0, fail = 0;
for (const [path, id] of Object.entries(files)) {
  try {
    const res = await fetch(base + id, { redirect: 'follow' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const buf = Buffer.from(await res.arrayBuffer());
    if (!buf.length) throw new Error('empty file');
    const out = join(root, 'assets', path);
    await mkdir(dirname(out), { recursive: true });
    await writeFile(out, buf);
    ok++; console.log('ok  ', path, buf.length + ' B');
  } catch (e) { fail++; console.error('FAIL', path, e.message); }
}
console.log(`\n${ok} downloaded, ${fail} failed.`);
if (fail) console.log('Expired URLs? Re-export the nodes with Figma MCP download_assets and update scripts/assets.json.');
process.exit(fail ? 1 : 0);
