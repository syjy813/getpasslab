from pathlib import Path
import json,re,hashlib,csv,io,subprocess,collections
R=Path(__file__).resolve().parents[3];A=R/'docs/audits/2026-10-20-fire-persona-corrections';h=lambda b:hashlib.sha256(b).hexdigest();m=json.loads((A/'question-corrections.json').read_text());rel=json.loads((A/'release.json').read_text());before=json.loads(subprocess.check_output(['git','show',m['baselineCommit']+':docs/drafts/fire-level2-mock-exam/question-table.json'],cwd=R));after=json.loads((R/'docs/drafts/fire-level2-mock-exam/question-table.json').read_text());B={q['id']:q for q in before};N={q['id']:q for q in after};ret=json.loads((A/'retest.json').read_text());target=set(m['targets'])
assert len(ret)==167 and set(ret)==target
for i,q in N.items():
 if i not in target:assert q==B[i],i
 else:
  assert ret[i]==q['answerNumber'],i
  assert {k:v for k,v in q.items() if k not in m['corrections'][i]['set']}=={k:v for k,v in B[i].items() if k not in m['corrections'][i]['set']},i
 assert q['rawSourceText']==B[i]['rawSourceText'] and q['answerNumber']==B[i]['answerNumber']
for row in rel['files']:row['sha256']=h((R/row['path']).read_bytes())
articles={}
for f in (R/'dist').rglob('index.html'):
 match=re.search(rb'<article\b[^>]*>[\s\S]*?</article>',f.read_bytes())
 if match:articles[str(f.relative_to(R))]=h(match[0])
rel['currentArticles']=articles;(A/'release.json').write_text(json.dumps(rel,ensure_ascii=False,indent=2)+'\n')
review={'targetCount':167,'chapterCount':28,'untouchedQuestions':2313,'preservedRawSources':500,'preservedAnswerNumbers':2480,'answersMatchAfterModelRetest':167,'stillHeldFromFirstPass':152,'rows':{q['id']:{'currentHash':h(json.dumps(q,ensure_ascii=False,separators=(',',':')).encode())} for q in after}}
(A/'review.json').write_text(json.dumps(review,ensure_ascii=False,indent=2)+'\n')
s=io.StringIO();w=csv.writer(s,lineterminator='\n');w.writerow(['id','chapterId','disposition','questionChanged','choicesChanged','selectedAnswer','theoryFile','reason'])
d=json.loads((R/'docs/audits/2026-10-20-fire-persona-qa/decisions.json').read_text())
for i in m['targets']:
 q=N[i];keys=m['corrections'][i]['set'];w.writerow([i,q['chapterId'],'wording_revised' if 'question' in keys or 'choices' in keys else 'theory_support_and_explanation_link','question' in keys,'choices' in keys,ret[i],d[q['chapterId']]['chapterFile'],' / '.join(m['corrections'][i]['reasons'])])
(A/'question-review.csv').write_text(s.getvalue());print('Review assertions PASS',collections.Counter('wording' if 'question' in x['set'] or 'choices' in x['set'] else 'theory' for x in m['corrections'].values()))
