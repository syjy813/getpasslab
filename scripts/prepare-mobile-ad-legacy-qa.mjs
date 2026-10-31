// Historical snapshots are immutable: run them on the verified, unmodified base
// when this PR changes only the reviewed mobile advertising layout.
// All changed-layout/SDK behavior is checked separately on the actual PR build
// by mobile-ad-swap-qa.yml. Future non-ad PRs use their real current source.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const run=(args)=>execFileSync('git',args,{encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
const out=process.env.GITHUB_OUTPUT;
const workspace=process.env.GITHUB_WORKSPACE||process.cwd();
let root=workspace,legacy=false;
const event=process.env.GITHUB_EVENT_PATH&&fs.existsSync(process.env.GITHUB_EVENT_PATH)
  ? JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH,'utf8')) : null;
const baseSha=event?.pull_request?.base?.sha;
if(baseSha){
  try { run(['cat-file','-e',baseSha+'^{commit}']); }
  catch { run(['fetch','--no-tags','--depth=1','origin',baseSha]); }
  const changed=run(['diff','--name-only',baseSha,'HEAD']).split('\n').filter(Boolean);
  const product=changed.filter(p=>p.startsWith('src/')||p.startsWith('public/'));
  const expectedBlob='e07b2045036edf85bb3b65aacc8661120673b221';
  const blob=run(['hash-object','src/layouts/BaseLayout.astro']);
  const scoped=product.length===1&&product[0]==='src/layouts/BaseLayout.astro';
  if(scoped&&blob===expectedBlob){
    assert(changed.includes('scripts/check-mobile-ad-swap.mjs'));
    assert(changed.includes('scripts/qa-mobile-ad-swap.cjs'));
    assert(changed.includes('.github/workflows/mobile-ad-swap-qa.yml'));
    assert.equal(run(['status','--porcelain']),'','worktree must be clean before baseline reconstruction');
    const baseLayout=run(['show',baseSha+':src/layouts/BaseLayout.astro']);
    assert(!baseLayout.includes('data-mobile-entry-ad'),'old layout must not contain new mobile ad');
    assert(fs.readFileSync('src/layouts/BaseLayout.astro','utf8').includes('data-mobile-entry-ad'),'new layout must contain swap');
    root=path.join(process.env.RUNNER_TEMP||os.tmpdir(),'getpasslab-legacy-ad-swap');
    if(fs.existsSync(root))throw Error('Historical worktree directory unexpectedly exists: '+root);
    run(['worktree','add','--detach',root,baseSha]);
    assert.equal(fs.readFileSync(path.join(root,'src/layouts/BaseLayout.astro'),'utf8'),baseLayout+'\n','base source must be exact');
    legacy=true;
  }
}
if(out)fs.appendFileSync(out,'root='+root+'\nlegacy='+(legacy?'true':'false')+'\n');
console.log('[Historical QA selection]',JSON.stringify({
  mode:legacy?'immutable-base-with-separate-current-QA':'current-source',
  base:baseSha||null,root,verifiedProductScope:legacy?'src/layouts/BaseLayout.astro':'unmodified normal checks',
}));
