// Historical release guard runner.
// Archived SHA assertions execute against the original, immutable release.
// Current PR source, DOM and visual checks execute against the current checkout.
// Never mutate current checkout, golden audit records or audit scripts.
const {mkdtempSync,symlinkSync,rmSync,existsSync}=require('node:fs');
const {tmpdir}=require('node:os');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const assert=require('node:assert/strict');

const PINNED_ARCHIVE='c7f856c1919dd5eebd6260f920d15b639c0c1dba';
const current=process.cwd();
const command=process.argv.slice(2).join(' ');
assert(command&&command.includes('scripts/check-'),'explicit historical check command required');
const requested=process.env.REVIEW_BASE_SHA || PINNED_ARCHIVE;
assert.equal(requested,PINNED_ARCHIVE,'audit archive must be the immutable verified release');
const root=mkdtempSync(path.join(tmpdir(),'getpasslab-archived-audit-'));
const archived=path.join(root,'release');
const run=(bin,args,options={})=>{
  const result=spawnSync(bin,args,{cwd:options.cwd||current,encoding:'utf8',stdio:'inherit',env:process.env});
  if(result.error)throw result.error;
  assert.equal(result.status,0,bin+' '+args.join(' ')+' failed with '+result.status);
};
try {
  assert(existsSync(path.join(current,'node_modules')),'node_modules must be installed in current checkout');
  run('git',['fetch','--no-tags','--depth=1','origin',requested]);
  run('git',['worktree','add','--detach',archived,requested]);
  symlinkSync(path.join(current,'node_modules'),path.join(archived,'node_modules'),'dir');
  // Old sources and output are only built in this isolated checkout.
  // No archived artifact is copied into the current build.
  run('npm',['run','build'],{cwd:archived});
  run('bash',['-euo','pipefail','-c',command],{cwd:archived});
  console.log('[Archived history] PASS original SHA='+requested+' native head remains untouched');
} finally {
  spawnSync('git',['worktree','remove','--force',archived],{cwd:current,stdio:'pipe'});
  rmSync(root,{recursive:true,force:true});
}
