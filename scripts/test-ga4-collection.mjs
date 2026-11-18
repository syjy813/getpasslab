import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, cp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fetchDailyPageViews } from './lib/facility-page-views.mjs';
const root = resolve(import.meta.dirname, '..');
const temp = await mkdtemp(join(tmpdir(), 'ga4-collection-'));
const path = '/facility-management/career/fixture-new/';
const token = 'fixture-credential-never-log';
const response = {
  dimensionHeaders: [{ name: 'date' }, { name: 'pagePath' }], metricHeaders: [{ name: 'screenPageViews' }],
  rowCount: 1, totals: [{ metricValues: [{ value: '6' }] }],
  rows: [{ dimensionValues: [{ value: '20261117' }, { value: path }], metricValues: [{ value: '6' }] }],
  metadata: { timeZone: 'Asia/Seoul' },
};
try {
  await mkdir(join(temp, 'scripts/lib'), { recursive: true });
  await mkdir(join(temp, 'src/content/facility'), { recursive: true });
  await mkdir(join(temp, 'src/config'), { recursive: true });
  await mkdir(join(temp, 'src/data'), { recursive: true });
  for (const script of ['scripts/lib/facility-page-views.mjs', 'scripts/sync-ga4-page-views.mjs', 'scripts/commit-ga4-page-views.mjs', 'src/config/facility.ts'])
    await cp(join(root, script), join(temp, script));
  await writeFile(join(temp, 'src/content/facility/fixture-new.md'), "---\nstatus: published\ncategory: career\nnavigationCategory: stories\ntitle: '새 글의 ''제목'''\npublishedAt: 2026-11-17\n---\n");
  await writeFile(join(temp, 'src/content/facility/fixture-draft.md'), '---\nstatus: draft\ncategory: career\n---\n');
  const output = join(temp, 'src/data/facility-page-views.json');
  async function run(body, status = 200, accessToken = token) {
    const stub = `globalThis.fetch=async()=>new Response(${JSON.stringify(JSON.stringify(body))},{status:${status}});`;
    return spawnSync(process.execPath, ['--import', `data:text/javascript,${encodeURIComponent(stub)}`, join(temp, 'scripts/sync-ga4-page-views.mjs')], {
      encoding: 'utf8', timeout: 5000,
      env: { ...process.env, GA4_ACCESS_TOKEN: accessToken, GA4_PROPERTY_ID: '547805075', GITHUB_SHA: 'fixture-source' },
    });
  }
  const success = await run(response);
  assert.equal(success.status, 0, success.stderr);
  const content = await readFile(output, 'utf8');
  const snapshot = JSON.parse(content);
  assert.equal(snapshot.articleCount, 1);
  assert.equal(snapshot.articles[path].title, "새 글의 '제목'");
  assert.equal(snapshot.articles[path].publishedAt, '2026-11-17');
  assert.equal(snapshot.articles[path].category, 'stories');
  assert.equal(snapshot.articles[path].views, 6);
  assert.equal(snapshot.collectionSchedule.hour, 9);
  assert.equal(snapshot.sourceCommit, 'fixture-source');
  assert.equal(snapshot.daily.totals.reduce((a,b)=>a+b,0),6);
  assert.equal(snapshot.daily.articles[path].at(-1),6);
  assert.ok(snapshot.daily.articles[path].includes(null));
  assert.ok(!(success.stdout + success.stderr).includes(token));
  console.log('PASS atomic snapshot includes newly published metadata, excludes drafts, preserves navigation category');
  for (const [body, status, accessToken] of [[response, 503, token], [{...response, metadata:{timeZone:'UTC'}}, 200, token], [response, 200, '']]) {
    const result = await run(body, status, accessToken);
    assert.equal(result.status, 1);
    assert.equal(await readFile(output, 'utf8'), content);
    assert.ok(!(result.stdout + result.stderr).includes(token));
  }
  console.log('PASS failed collection and incorrect timezone preserve last successful snapshot and redact credentials');
  const commitStub = `globalThis.fetch=async(url,options)=>{if(!String(url).startsWith('https://api.github.com/repos/syjy813/getpasslab/contents/src/data/facility-page-views.json'))throw Error('Unexpected write');if(options.method==='PUT'){const payload=JSON.parse(options.body);if(payload.branch!=='main'||!payload.message.includes('[skip ci]')||JSON.parse(Buffer.from(payload.content,'base64')).articleCount!==1)throw Error('Invalid write');return new Response('{}');}return new Response('{}',{status:404});};`;
  for (const [branch, expected] of [['main',0],['chore/ga4-auth-connection',1]]) {
    const result=spawnSync(process.execPath,['--import',`data:text/javascript,${encodeURIComponent(commitStub)}`,join(temp,'scripts/commit-ga4-page-views.mjs')],{
      encoding:'utf8',timeout:5000,env:{...process.env,GITHUB_TOKEN:token,GITHUB_REF:`refs/heads/${branch}`,GITHUB_REPOSITORY:'syjy813/getpasslab',GITHUB_EVENT_NAME:'schedule',GITHUB_OUTPUT:''},
    });
    assert.equal(result.status,expected,result.stderr);
    assert.ok(!(result.stdout+result.stderr).includes(token));
  }
  console.log('PASS publication writes only the approved snapshot on main and rejects the old development branch');
  const queries=[];
  await fetchDailyPageViews({propertyId:'547805075',token,now:new Date('2026-11-18T00:00:00Z'),fetchReport:async(_url,options)=>{
    queries.push(JSON.parse(options.body));return new Response(JSON.stringify(response));
  }});
  assert.equal(queries[0].dateRanges[0].endDate,'2026-11-17');
  console.log('PASS 09:00 KST collection queries through the prior calendar day');
} finally { await rm(temp, { recursive: true, force: true }); }
