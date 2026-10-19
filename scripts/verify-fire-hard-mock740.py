"""Validate preservation, composition keys and arithmetic of the 740 hard drafts.

This is data QA. It neither proves case truth nor calibrates exam difficulty.
"""
from pathlib import Path
from decimal import Decimal, ROUND_CEILING
import ast, collections, hashlib, json, re, subprocess
ROOT=Path(__file__).resolve().parents[1]
P=ROOT/'docs/drafts/fire-level2-mock-exam'
BASE='c353846e7b8091e2e9f9e448ea9567eda8f1f9bf'

def read(p):return json.loads(p.read_text())
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def arithmetic(expr):
    def solve(n):
        if isinstance(n,ast.Expression):return solve(n.body)
        if isinstance(n,ast.Constant) and type(n.value) in (int,float):return Decimal(str(n.value))
        if isinstance(n,ast.BinOp):
            a,b=solve(n.left),solve(n.right)
            if isinstance(n.op,ast.Add):return a+b
            if isinstance(n.op,ast.Sub):return a-b
            if isinstance(n.op,ast.Mult):return a*b
            if isinstance(n.op,ast.Div):return a/b
        if isinstance(n,ast.Call) and isinstance(n.func,ast.Name) and not n.keywords:
            args=[solve(a) for a in n.args]
            if n.func.id=='ceil' and len(args)==1:return args[0].to_integral_value(rounding=ROUND_CEILING)
            if n.func.id=='min' and args:return min(args)
            if n.func.id=='max' and args:return max(args)
        raise AssertionError(ast.dump(n))
    return solve(ast.parse(expr,mode='eval'))

def main():
    hard=read(P/'hard740.json');general=read(P/'general740.json');core=read(P/'core500.json')
    edit=read(P/'hard-editorial.json');manifest=read(P/'combined1980-manifest.json')
    cases={c['id']:c for c in edit['caseNotes']};notes={e['id']:e for e in edit['questions']}
    chapters={c['id']:c for c in edit['chapterBasis']};allq=general+hard+core
    assert len(hard)==len(cases)==len(notes)==740
    assert len({c['context'] for c in cases.values()})==740
    assert len(general)==740 and len(core)==500 and len(allq)==1980
    assert len({q['id'] for q in allq})==1980
    assert len({q['question'] for q in allq})==1980
    assert collections.Counter(q['chapterId'] for q in general+hard)=={f'FSM2-{i:03}':20 for i in range(1,75)}
    assert collections.Counter(q['chapterId'] for q in hard)=={f'FSM2-{i:03}':10 for i in range(1,75)}
    assert collections.Counter(q['answerIndex'] for q in hard)=={i:185 for i in range(4)}
    assert collections.Counter(q['answerIndex'] for q in allq)=={i:495 for i in range(4)}
    assert collections.Counter(q['subjectId'] for q in hard)=={1:490,2:250}
    assert {q['id'] for q in hard}=={f'FSM2-MOCK-{n:03}-{i:02}' for n in range(1,75) for i in range(11,21)}
    assert set(chapters)=={f'FSM2-{n:03}' for n in range(1,75)}
    assert sha(ROOT/edit['sourcePath'])==edit['sourceSHA256']==manifest['sourceSHA256']
    for c in chapters.values():assert sha(ROOT/c['path'])==c['sha256'],c['id']
    for c in cases.values():
        assert c['correctConclusion']!=c['misconclusion'],c['id']
        assert all(c[k].strip() for k in ['context','correctConclusion','misconclusion','rationale'])
    usages=collections.Counter();formats=collections.Counter();calc_questions=[]
    for q in hard:
        assert set(q)=={'id','chapterId','subjectId','tags','question','choices','answerIndex','explanation'}
        assert q['tags']==['심화'] and len(q['choices'])==len(set(q['choices']))==4,q['id']
        assert type(q['answerIndex']) is int and q['answerIndex'] in range(4),q['id']
        assert all(v.strip() for v in q['choices']) and q['explanation'].strip(),q['id']
        assert not re.search(r'(?:다음|아래|위|첨부)(?:의|와|\s)*(?:그림|사진|평면도|흐름도)',q['question']),q['id']
        e=notes[q['id']];selected=[cases[k] for k in e['caseRefs']];usages.update(e['caseRefs'])
        assert len(selected)==len(set(e['caseRefs']))==e['applicationJudgments']>=2
        assert all(c['chapterId']==q['chapterId'] for c in selected)
        assert q['subjectId']==chapters[q['chapterId']]['subjectId']
        assert e['reviewStatus']=='draft' and e['publicationApproved'] is False
        assert e['difficultyCalibration']=='not-measured'
        labels=['가','나','다'][:len(selected)]
        for label,c in zip(labels,selected):
            assert f'{label}. {c["context"]}' in q['question'],q['id']
            assert c['rationale'] in q['explanation'] and c['correctConclusion'] in q['explanation'],q['id']
        actual_answer=q['choices'][q['answerIndex']]
        fmt=e['format'];formats[fmt]+=1
        if fmt=='compound-conclusions':
            expected=' / '.join(f'{label}: {c["correctConclusion"]}' for label,c in zip(labels,selected))
            assert actual_answer==expected,q['id']
            # All four answer patterns must exist, so distractors cannot omit a case.
            patterns=set()
            for option in q['choices']:
                segments=re.split(r' / (?=나: )',option);assert len(segments)==2,(q['id'],option)
                pattern=[]
                for label,c,segment in zip(labels,selected,segments):
                    assert segment in [f'{label}: {c["correctConclusion"]}',f'{label}: {c["misconclusion"]}']
                    pattern.append(segment==f'{label}: {c["correctConclusion"]}')
                patterns.add(tuple(pattern))
            assert patterns=={(True,True),(False,True),(True,False),(False,False)}
        else:
            flags=e['shownJudgments'];assert len(flags)==len(selected)
            for label,c,good in zip(labels,selected,flags):
                assessment=c['correctConclusion' if good else 'misconclusion']
                assert assessment in q['question'],q['id']
            if fmt=='minimum-repair-set':
                wrong=[label for label,flag in zip(labels,flags) if not flag]
                expected='수정할 항목 없음' if not wrong else '가, 나 모두 수정' if len(wrong)==2 else wrong[0]+'만 수정'
                assert actual_answer==expected,q['id']
            elif fmt=='three-case-audit':
                assert actual_answer==str(len([v for v in flags if v]))+'개',q['id']
            else:raise AssertionError(fmt)
        if any(c['arithmetic'] for c in selected):calc_questions.append(q['id'])
    assert set(usages)==set(cases) and min(usages.values())>=2
    calculations=[]
    for c in cases.values():
        for x in c['arithmetic']:
            result=arithmetic(x['expression']);expected=Decimal(x['expected'])
            assert abs(result-expected)<Decimal('0.00000001'),(c['id'],x,result)
            display=x['display'].replace(',','')
            if re.fullmatch(r'\d{1,2}:\d{2}',display):
                h,m=map(int,display.split(':'));assert result==h*60+m
            else:
                number=re.search(r'\d+(?:\.\d+)?',display)[0]
                precision=len(number.partition('.')[2]);tol=Decimal(1).scaleb(-precision)/2 if precision else Decimal('0.0000001')
                assert abs(result-Decimal(number))<=tol+Decimal('0.00000001'),(c['id'],display,result)
            found=[q for q in hard if c['id'] in notes[q['id']]['caseRefs']]
            assert found and all(x['display'] in q['explanation'] for q in found),c['id']
            calculations.append({'caseId':c['id'],'expression':x['expression'],'computed':str(result),'display':x['display']})
    for name,digest in manifest['preservedInputs'].items():
        assert sha(P/name)==digest,name
        old=subprocess.check_output(['git','show',f'{BASE}:docs/drafts/fire-level2-mock-exam/{name}'],cwd=ROOT)
        assert hashlib.sha256(old).hexdigest()==digest,name
    assert not subprocess.check_output(['git','diff','--name-only',BASE,'--','src','public'],cwd=ROOT,text=True).strip()
    # The old 1240-question review files remain as a historical snapshot.
    assert not subprocess.check_output(['git','diff','--name-only',BASE,'--',str((P/'review').relative_to(ROOT))],cwd=ROOT,text=True).strip()
    included=[]
    for c in manifest['chapters']:
        page=P/c['reviewFile'];text=page.read_text()
        qs=[q for q in allq if q['chapterId']==c['chapterId']]
        assert len(re.findall(r'^### FSM2-',text,re.M))==len(qs)
        assert c['general']==10 and c['hard']==10
        for q in qs:
            assert text.count('### '+q['id']+'\n')==1
            assert q['question'] in text and q['explanation'] in text
            assert f"**정답: {q['answerIndex']+1}번**" in text
            included.append(q['id'])
        for target in re.findall(r'\]\(([^)]+)\)',text):
            if not target.startswith('http'):assert (page.parent/target).resolve().is_file(),target
    assert len(included)==len(set(included))==1980
    assert len(re.findall(r'review-all/\d{3}\.md',(P/'review-all-index.md').read_text()))==74
    result={'additionalHard':740,'generalTotal':1480,'core':500,'combinedTotal':1980,'chapters':74,
      'generalPerChapter':20,'hardPerChapter':10,'distinctHardCaseContexts':len(cases),
      'hardSubjectCounts':{'1':490,'2':250},'hardAnswerPositions0Based':{str(k):185 for k in range(4)},
      'combinedAnswerPositions0Based':{str(k):495 for k in range(4)},'formats':dict(formats),
      'minimumApplicationJudgments':2,'caseUseCountRange':[min(usages.values()),max(usages.values())],
      'arithmeticCases':sum(bool(c['arithmetic']) for c in cases.values()),
      'independentlyRecomputedExpressions':len(calculations),'questionsWithArithmeticCases':len(calc_questions),
      'calculations':calculations,'preservedInputs':manifest['preservedInputs'],
      'readableChapterFiles':74,'exactUniqueQuestionStems':1980,'uniqueIds':1980,
      'structureCompositionArithmeticAndPreservation':'PASS',
      'semanticAnswerVerification':'DEFERRED_TO_COMBINED_REVIEW','textbookPageVerification':'PENDING_COMBINED_REVIEW',
      'difficultyCalibration':'NOT_MEASURED','reviewStatus':'draft','publicationApproved':False,
      'limits':['Composite-key checks verify consistency with authored case conclusions, not independent truth of those conclusions.',
        'Cases are reused across different pairings; semantic overlap, distractor quality and exam difficulty need the combined editorial pass.',
        'No UI integration, deployment or user answer-rate measurement was performed.']}
    (P/'hard-validation.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({k:v for k,v in result.items() if k in ['additionalHard','combinedTotal','chapters','independentlyRecomputedExpressions','questionsWithArithmeticCases','structureCompositionArithmeticAndPreservation','semanticAnswerVerification']},ensure_ascii=False))

if __name__=='__main__':main()
