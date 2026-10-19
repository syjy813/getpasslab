"""Check draft packaging and arithmetic, NOT a substitute for combined editorial review."""
from pathlib import Path
from decimal import Decimal, ROUND_CEILING
import ast, collections, hashlib, json, math, re, subprocess

ROOT=Path(__file__).resolve().parents[1]
P=ROOT/'docs/drafts/fire-level2-mock-exam'
BASE='0064a481df0ec9012a1c891037569cec5619ead7'

def read(p):return json.loads(p.read_text())
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def compute(expression):
    # Independent Decimal evaluator; no eval or reuse of the rendering script.
    def walk(n):
        if isinstance(n,ast.Expression):return walk(n.body)
        if isinstance(n,ast.Constant) and type(n.value) in (int,float):return Decimal(str(n.value))
        if isinstance(n,ast.BinOp):
            a,b=walk(n.left),walk(n.right)
            if isinstance(n.op,ast.Add):return a+b
            if isinstance(n.op,ast.Sub):return a-b
            if isinstance(n.op,ast.Mult):return a*b
            if isinstance(n.op,ast.Div):return a/b
        if isinstance(n,ast.Call) and isinstance(n.func,ast.Name) and n.func.id=='ceil' and len(n.args)==1 and not n.keywords:
            return walk(n.args[0]).to_integral_value(rounding=ROUND_CEILING)
        raise AssertionError(ast.dump(n))
    return walk(ast.parse(expression,mode='eval'))

def main():
    general=read(P/'general740.json');core=read(P/'core500.json')
    editorial=read(P/'general-editorial.json');manifest=read(P/'combined-manifest.json')
    sample=read(P/'chapter001-sample.json');allq=general+core
    assert len(general)==len(editorial)==740
    assert len(core)==500 and len(allq)==1240
    assert len({q['id'] for q in allq})==1240
    assert len({q['question'] for q in allq})==1240,'exact duplicate stems require correction'
    assert general[:10]==sample,'preserve the original 001 sample'
    assert collections.Counter(q['chapterId'] for q in general)=={f'FSM2-{n:03}':10 for n in range(1,75)}
    assert collections.Counter(q['subjectId'] for q in general)=={1:490,2:250}
    assert collections.Counter(q['answerIndex'] for q in general)=={k:185 for k in range(4)}
    by_id={q['id']:q for q in general};by_edit={e['id']:e for e in editorial}
    assert set(by_id)==set(by_edit)
    for n in range(2,75):
        decisions=[e['targetDecision'] for e in editorial if e['chapter']['id']==f'FSM2-{n:03}']
        assert len(decisions)==len(set(decisions))==10,n
    numerical=[]
    for q in allq:
        assert set(q)=={'id','chapterId','subjectId','tags','question','choices','answerIndex','explanation'},q['id']
        assert len(q['choices'])==len(set(q['choices']))==4,q['id']
        assert all(isinstance(v,str) and v.strip() for v in q['choices']),q['id']
        assert type(q['answerIndex']) is int and q['answerIndex'] in range(4),q['id']
        assert q['question'].strip() and q['explanation'].strip(),q['id']
        assert not re.search(r'(?:다음|아래|위|첨부)(?:의|와|\s)*(?:그림|사진|평면도|체계도|흐름도)|(?:그림|사진|평면도|체계도|흐름도)(?:을|를)\s*(?:보고|참고)',q['question']),q['id']
        assert q['tags']==(['핵심'] if q['id'].startswith('FSM2-CORE-') else []),q['id']
    for e in editorial:
        assert e['reviewStatus']=='draft' and e['publicationApproved'] is False,e['id']
        c=e['chapter'];assert c['id']==by_id[e['id']]['chapterId']
        assert digest(ROOT/c['path'])==c['sha256'],e['id']
        assert c['subjectId']==by_id[e['id']]['subjectId']
        q=by_id[e['id']]
        if not e['assertions']:continue
        texts=q['choices']+[q['question']]
        assert not any(re.search(r'같은 조건|같은 범례|같은 높이|같은 선택|같은 정격|같은 기준|그 서식',t) for t in texts),e['id']
        if e['numericItem']:
            a=e['assertions'][0]['calculation'];actual=compute(a['expression'])
            answer=q['choices'][q['answerIndex']].replace(',','')
            shown=Decimal(re.findall(r'\d+(?:\.\d+)?',answer)[-1])
            assert abs(shown-actual)<=Decimal('0.0050001'),(q['id'],shown,actual)
            numerical.append(q['id'])
        elif e['format'] in ('single-best-answer','single-incorrect-answer'):
            positive=e['format']=='single-best-answer'
            assert q['choices'][q['answerIndex']]==e['assertions'][0]['supported' if positive else 'misconception']
            for a in e['assertions']:
                assert a['supported' if a['shownTrue'] else 'misconception'] in q['choices'],e['id']
        elif e['format']=='assertion-combination':
            expected=[a['label'] for a in e['assertions'] if a['shownTrue']]
            labels=[a['label'] for a in e['assertions']]
            correct=(', '.join(labels)+' 모두 옳다' if len(expected)==len(labels) else ', '.join(labels)+' 모두 틀리다' if not expected else ', '.join(expected)+'만 옳다')
            assert q['choices'][q['answerIndex']]==correct,e['id']
            for a in e['assertions']:assert a['supported' if a['shownTrue'] else 'misconception'] in q['question'],e['id']
    arithmetic=[]
    for a in manifest['arithmeticAssertions']:
        actual=compute(a['expression']);expected=Decimal(str(a['expected']))
        assert abs(actual-expected)<Decimal('0.000000001'),a
        shown=Decimal(re.findall(r'\d+(?:\.\d+)?',a['supported'].replace(',',''))[-1])
        assert abs(shown-actual)<=Decimal('0.0050001'),a
        arithmetic.append({'chapterId':a['chapterId'],'card':a['card'],'expression':a['expression'],'actual':str(actual)})
    for name,saved_sha in manifest['preservedInputs'].items():
        assert digest(P/name)==saved_sha,name
        committed=subprocess.check_output(['git','show',f'{BASE}:docs/drafts/fire-level2-mock-exam/{name}'],cwd=ROOT)
        assert hashlib.sha256(committed).hexdigest()==saved_sha,name
    assert digest(ROOT/'scripts/fire-mock-authoring/chapter-facts.txt')==manifest['generalSourceSHA256']
    assert digest(ROOT/'scripts/fire-mock-authoring/numerical-items.json')==manifest['numericalSourceSHA256']
    rendered=[]
    for c in manifest['chapters']:
        assert c['general']==10
        text=(P/c['reviewFile']).read_text()
        expected=[q for q in allq if q['chapterId']==c['chapterId']]
        assert len(re.findall(r'^### FSM2-',text,re.M))==len(expected)
        for q in expected:
            assert text.count('### '+q['id']+'\n')==1,q['id']
            assert f"**정답: {q['answerIndex']+1}번**" in text
            rendered.append(q['id'])
        for link in re.findall(r'\]\(([^)]+)\)',text):
            if not link.startswith('http'):assert ((P/c['reviewFile']).parent/link).resolve().is_file(),link
    assert len(rendered)==len(set(rendered))==1240
    for sub in ('src','public'):
        assert not subprocess.check_output(['git','diff','--name-only',BASE,'--',sub],cwd=ROOT,text=True).strip()
    result={'generalQuestions':740,'coreQuestions':500,'combinedQuestions':1240,
      'generalPerChapter':10,'chapters':74,'generalSubjectCounts':{'1':490,'2':250},
      'answerDistribution0Based':{str(k):185 for k in range(4)},
      'uniqueIds':1240,'exactUniqueStems':1240,'readableChapterFiles':74,
      'renderedQuestionIdsUnique':1240,'generalFormatCounts':manifest['generalFormatCounts'],
      'arithmeticAssertionsIndependentlyRecomputed':len(arithmetic),
      'directNumericalAnswersChecked':len(numerical),'numericalQuestionIds':numerical,
      'arithmeticResults':arithmetic,'preservedInputs':manifest['preservedInputs'],
      'structureAndPackaging':'PASS','existingPublishedFiles':'UNCHANGED',
      'semanticAnswerVerification':'DEFERRED_TO_ONE_COMBINED_REVIEW',
      'textbookPageVerification':'PENDING_COMBINED_REVIEW',
      'reviewStatus':'draft','publicationApproved':False,
      'limitations':['Assertion consistency checks trace the authored key, not an independent truth proof.',
        'Chapter hashes preserve the writing basis; per-item textbook pages and current primary authority require combined editorial review.',
        'Near-duplicate concepts, distractor plausibility, difficulty and format repetition require editorial review.']}
    (P/'general-validation.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({k:v for k,v in result.items() if k in ('generalQuestions','combinedQuestions','chapters','arithmeticAssertionsIndependentlyRecomputed','directNumericalAnswersChecked','structureAndPackaging','semanticAnswerVerification')},ensure_ascii=False))

if __name__=='__main__':main()
