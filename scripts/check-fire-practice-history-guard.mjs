import assert from 'node:assert/strict';
import { mkdtemp, mkdir, copyFile, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const personaAudit='docs/audits/2026-10-20-fire-persona-corrections';
const personaRelease=JSON.parse(await readFile(personaAudit+'/release.json','utf8'));
const standardFiles=['scripts/read-before-global-chapter-readability.mjs','docs/audits/2026-10-26-global-chapter-readability/review.json','scripts/fire-mock-authoring/standardization.mjs',...['revision.json','review.json','assertions.json','before-rows.json','replacements.json'].map(n=>'docs/releases/2026-10-21-fire-standard-questions/'+n)];
const personaFiles=['docs/audits/2026-10-22-all-chapter-hierarchy/review.json',...standardFiles,'scripts/read-before-fire-persona-corrections.mjs',personaAudit+'/release.json',...personaRelease.files.flatMap(r=>[r.path,...(r.originalFile?[r.originalFile]:[])])];
const audit = 'docs/audits/2026-10-20-fire-level2-practice';
const release = JSON.parse(await readFile(audit + '/release.json', 'utf8'));
const helper = 'scripts/read-before-fire-practice.mjs';
const root = await mkdtemp(path.join(tmpdir(), 'getpasslab-fire-practice-guard-'));
const put = async (file, data) => { await mkdir(path.dirname(path.join(root, file)), { recursive: true }); await writeFile(path.join(root, file), data); };
const run = code => spawnSync(process.execPath, ['--input-type=module', '-e', `import {readFile,readdir} from './${helper}';${code}`], { cwd: root, encoding: 'utf8' });
try {
  const article = Object.keys(release.articles).find(file => release.articles[file].htmlShell);
  for (const file of [...personaFiles,helper, audit + '/release.json', audit + '/baseline.json', article, release.articles[article].htmlShell, ...release.files.flatMap(row => [row.path, ...(row.originalFile ? [row.originalFile] : [])])]) {
    await mkdir(path.dirname(path.join(root, file)), { recursive: true });
    await copyFile(file, path.join(root, file));
  }
  const source = release.files.find(row => row.originalFile);
  const sourceRead = `await readFile(${JSON.stringify(source.path)});`;
  assert.equal(run(sourceRead).status, 0);
  await put(source.path, 'changed'); assert.notEqual(run(sourceRead).status, 0);
  await put(source.path, await readFile(source.path));
  await put(source.originalFile, 'changed'); assert.notEqual(run(sourceRead).status, 0);
  await put(source.originalFile, await readFile(source.originalFile));
  const articleRead = `await readFile(${JSON.stringify(article)});`;
  assert.equal(run(articleRead).status, 0);
  const shell = release.articles[article].htmlShell;
  await put(shell, 'changed original HTML shell'); assert.notEqual(run(articleRead).status, 0);
  await put(shell, await readFile(shell));
  await put(article, (await readFile(article, 'utf8')).replace('</article>', 'unreviewed</article>'));
  assert.notEqual(run(articleRead).status, 0);
  const added = release.files.find(row => !row.originalFile && row.path.includes('/pages/'));
  const directory = path.dirname(added.path);
  const scan = `if((await readdir(${JSON.stringify(directory)})).length)throw Error('unexpected file');`;
  assert.equal(run(scan).status, 0);
  await put(added.path, 'changed'); assert.notEqual(run(scan).status, 0);
  await put(added.path, await readFile(added.path));
  await put(directory + '/unexpected.txt', 'unexpected'); assert.notEqual(run(scan).status, 0);
  await rm(path.join(root, directory, 'unexpected.txt'));
  await rm(path.join(root, added.path));
  assert.notEqual(run(`await readFile(${JSON.stringify(added.path)});`).status, 0);
  console.log('[Fire practice history guard] 10 isolated approved/prohibited source, original, article, inventory and deletion checks PASS');
} finally { await rm(root, { recursive: true, force: true }); }
