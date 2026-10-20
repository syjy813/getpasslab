"""Check the draft package, independently recomputing all declared calculations.

This deliberately does NOT certify all legal, medical or semantic answers.
"""
from pathlib import Path
from datetime import date, timedelta
import json, math, collections, re, hashlib, subprocess
ROOT=Path(__file__).resolve().parents[1]
P=ROOT/'docs/drafts/fire-level2-mock-exam'
bank=json.loads((P/'core500.json').read_text());editorial=json.loads((P/'editorial-review.json').read_text())
sample=json.loads((P/'chapter001-sample.json').read_text())
assert len(bank)==len(editorial)==500
assert len(sample)==10
assert len({x['id'] for x in bank})==500
assert len({x['sourceQuestionId'] for x in editorial})==500
assert len({x['question'] for x in bank})==500,'duplicate question stems require editorial correction'
assert {x['id'] for x in bank}=={x['id'] for x in editorial}
by_id={q['id']:q for q in bank}
assert all(by_id[e['id']]['answerIndex']!=e['sourceDisplayedAnswer']-1 for e in editorial)
assert collections.Counter(x['answerIndex'] for x in bank)=={0:125,1:125,2:125,3:125}
for q in bank+sample:
    assert len(q['choices'])==len(set(q['choices']))==4,q['id']
    assert q['answerIndex'] in range(4),q['id']
    assert q['question'].strip() and q['explanation'].strip(),q['id']
    assert set(re.findall('[㉠-㉭]',' '.join(q['choices'])))<=set(re.findall('[㉠-㉭]',q['question'])),q['id']
    assert not re.search(r'그림|사진|평면도|체계도|흐름도',q['question']),q['id']
    assert q['tags']==(['핵심'] if q in bank else []),q['id']
calcs=[]
for e in editorial:
    assert e['reviewStatus']=='draft' and e['publicationApproved'] is False
    c=e['chapter'];assert hashlib.sha256((ROOT/c['path']).read_bytes()).hexdigest()==c['sha256']
    x=e['calculation']
    if not x:continue
    op=x['operation']
    if op=='divide':actual=x['inputs'][0]/x['inputs'][1]
    elif op=='sumCeil':actual=sum(math.ceil(a/x['divisor']) for a in x['inputs'])
    elif op=='ceil':actual=math.ceil(x['area']/x['divisor'])
    elif op=='auditorium':actual=sum(math.ceil(a/4-1) for a in x['inputs'])
    elif op=='extinguishers':actual=math.ceil(math.ceil(x['area']/x['unitArea'])/x['rating'])
    elif op=='simpleTools':actual=(x['sand']+x['vermiculite'])/2
    elif op=='minutes':actual=x['start']+x['duration']
    elif op=='date':actual=(date.fromisoformat(x['start'])+timedelta(days=x['duration'])).isoformat()
    elif op=='apartmentRange':actual=[x['people']*300,(x['people']+1)*300-1]
    elif op=='pump':
        assert math.isclose(x['ratedFlow']*1.5,x['expectedFlow'])
        assert math.isclose(x['ratedPressure']*.65,x['expectedPressure']);actual=None
    elif op=='outdoor':
        assert min(x['n'],2)*350==x['expectedFlow']
        assert min(x['n'],2)*350*20/1000==x['expectedWater'];actual=None
    else:raise AssertionError(op)
    if actual is not None:
        assert (math.isclose(actual,x['expected']) if isinstance(actual,(int,float)) else actual==x['expected']),e['id']
    answer=by_id[e['id']]['choices'][by_id[e['id']]['answerIndex']]
    if op in ['ceil','sumCeil','auditorium','extinguishers']:
        assert int(re.findall(r'(\d+)個',answer)[-1] if '個' in answer else re.findall(r'(\d+)개',answer)[-1])==actual,e['id']
    elif op=='divide':assert math.isclose(float(re.search(r'\d+(?:\.\d+)?',answer)[0]),actual,abs_tol=.005),e['id']
    elif op=='simpleTools':assert float(re.search(r'\d+(?:\.\d+)?',answer)[0])==actual,e['id']
    elif op=='minutes':
        h,m=map(int,answer.split(':'));assert h*60+m==actual,e['id']
    elif op=='pump':assert [float(n) for n in re.findall(r'\d+(?:\.\d+)?',answer)]==[x['expectedFlow'],x['expectedPressure']],e['id']
    elif op=='outdoor':assert [float(n) for n in re.findall(r'\d+(?:\.\d+)?',answer)]==[x['expectedWater'],x['expectedFlow']],e['id']
    elif op=='date':assert answer==f'{date.fromisoformat(actual).year}년 {date.fromisoformat(actual).month}월 {date.fromisoformat(actual).day}일',e['id']
    elif op=='apartmentRange':assert [int(n) for n in re.findall(r'\d+',answer.replace(',',''))]==actual,e['id']
    calcs.append(e['id'])
changed=subprocess.check_output(['git','diff','--name-only','HEAD','--','src','public'],cwd=ROOT,text=True).strip()
assert not changed,'published source/public must stay unchanged for this draft-only package'
result={'questions':500,'sampleQuestions':10,'sourceLinksUnique':500,'sourceSets':dict(collections.Counter(x['sourceSet'] for x in editorial)),'chapterCounts':dict(sorted(collections.Counter(x['chapterId'] for x in bank).items())),'answerDistribution0Based':dict(collections.Counter(x['answerIndex'] for x in bank)),'independentlyRecomputedCalculations':len(calcs),'calculationQuestionIds':calcs,'structure':'PASS','existingPublishedFiles':'UNCHANGED','editorialStatus':'DRAFT_NOT_APPROVED_FOR_PUBLICATION','semanticAnswerVerification':'NOT_COMPLETE','officialPastExamAuthentication':False,'limitations':['Text-only reconstructions of diagram questions preserve broad chapter concepts, not necessarily the exact source diagram inference','Wording-only variants are explicitly recorded and are not claimed to be wholly new numerical cases','All 500 require final item-by-item answer, distractor, current-basis and theory-coverage review before publication']}
(P/'validation.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in result.items() if k in ['questions','sampleQuestions','sourceLinksUnique','independentlyRecomputedCalculations','structure','editorialStatus','semanticAnswerVerification']},ensure_ascii=False))
