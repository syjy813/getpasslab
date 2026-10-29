"""Record the exact UI delta against an already-built, immutable main baseline."""
import base64, difflib, gzip, hashlib, json, re, subprocess, sys
from pathlib import Path

baseline = Path(sys.argv[1])
base_ref = '6c70b14d1b94f1bcb0ca8035e1d7cf1866ac7631'
audit = Path('docs/audits/2026-10-29-certification-discovery')
audit.mkdir(parents=True, exist_ok=True)
digest = lambda b: hashlib.sha256(b).hexdigest()
tracked = subprocess.check_output(['git', 'ls-tree', '-r', '--name-only', base_ref, '--', 'src', 'public'], text=True).splitlines()
sources = sorted(str(p) for root in ['src', 'public'] for p in Path(root).rglob('*') if p.is_file())
before_sources = {}
changed = set(subprocess.check_output(['git', 'diff', '--name-only', base_ref], text=True).splitlines())
for name in sources:
    if name in tracked:
        before_sources[name] = subprocess.check_output(['git', 'show', f'{base_ref}:{name}']) if name in changed else Path(name).read_bytes()
before = {**before_sources, **{'dist/'+str(p.relative_to(baseline)):p.read_bytes() for p in baseline.rglob('*') if p.is_file() and p.suffix in ['.html', '.xml']}}
current = {name:Path(name).read_bytes() for name in sources}
current.update({str(p):p.read_bytes() for p in Path('dist').rglob('*') if p.is_file() and p.suffix in ['.html', '.xml']})
review = {'base':base_ref, 'current':{k:digest(v) for k,v in current.items()}, 'beforeInventory':sorted(before), 'changes':{}, 'additions':{}, 'chunks':{}, 'bundles':{}, 'removedBundles':{}}
def chunk(data):
    key=digest(data)
    review['chunks'].setdefault(key,base64.b64encode(data).decode())
    return key
for name, data in current.items():
    if name not in before:
        review['additions'][name]=digest(data)
        continue
    old=before[name]
    if old==data:continue
    # HTML tokens keep a small navigation edit from duplicating a whole lesson line.
    split=lambda value:re.split(rb'(?=<)|(?<=>)|(?<=\n)',value)
    a,b=split(old),split(data)
    offsets=[0]
    for line in b:offsets.append(offsets[-1]+len(line))
    patches=[{'at':offsets[j1],'before':chunk(b''.join(a[i1:i2])),'current':chunk(b''.join(b[j1:j2]))} for tag,i1,i2,j1,j2 in difflib.SequenceMatcher(None,a,b,autojunk=True).get_opcodes() if tag!='equal']
    review['changes'][name]={'sha256':digest(data),'beforeSHA256':digest(old),'patches':patches}
review['productFiles']=sorted(k for k in [*review['changes'],*review['additions']] if k.startswith(('src/','public/')))
for p in Path('dist/_astro').rglob('*'):
    if p.is_file() and p.suffix in ['.js','.css']:review['bundles'][str(p)]=digest(p.read_bytes())
for p in (baseline/'_astro').rglob('*'):
    if p.is_file() and p.suffix in ['.js','.css'] and not Path('dist/_astro',p.name).exists():review['removedBundles']['dist/_astro/'+p.name]=chunk(p.read_bytes())
payload=json.dumps(review,ensure_ascii=False,separators=(',',':')).encode()
temporary=audit/'review.json.gz.tmp'
with temporary.open('wb') as f:
    with gzip.GzipFile(fileobj=f,mode='wb',mtime=0) as z:z.write(payload)
temporary.replace(audit/'review.json.gz')
print(json.dumps({'sources':len(sources),'native':len(current),'productFiles':review['productFiles'],'changes':len(review['changes']),'compressedBytes':(audit/'review.json.gz').stat().st_size}))
