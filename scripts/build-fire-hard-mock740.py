"""Build 740 additional application-based drafts, retaining the existing 1240 items.

Ten new case pairings per chapter, with compound conclusions, minimum-repair
sets and three-case audits. Difficulty is an editorial target, not measured data.
Final textbook/authority/answer/distractor review remains one combined pass.
"""
from pathlib import Path
import collections, hashlib, json, os, random, re, runpy

ROOT=Path(__file__).resolve().parents[1]
P=ROOT/'docs/drafts/fire-level2-mock-exam'
SOURCE=ROOT/'scripts/fire-mock-authoring/hard-cases.txt'
BASE='c353846e7b8091e2e9f9e448ea9567eda8f1f9bf'
PRESERVE=['core500.json','general740.json','editorial-review.json','general-editorial.json',
  'chapter001-sample.json','combined-manifest.json','general-validation.json','validation.json','sample-review.md']

def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def save(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
def read(p):return json.loads(p.read_text())

def parse_cases():
    data={};n=None
    for line in SOURCE.read_text().splitlines():
        if not line or line.startswith('#'):continue
        if re.fullmatch(r'\[\d{3}\]',line):
            n=int(line[1:-1]);assert n not in data
            data[n]={'assumptions':None,'cases':[]};continue
        if line.startswith('@'):
            assert data[n]['assumptions'] is None
            data[n]['assumptions']=line[1:];continue
        fields=line.split('|');assert len(fields) in (4,5),(n,line)
        context,correct,wrong,reason=fields[:4];calcs=[]
        if len(fields)==5:
            for text in fields[4].split(';'):
                expression,output=text.split('=',1);expected,display=output.split(':',1)
                calcs.append({'expression':expression,'expected':expected,'display':display})
        i=len(data[n]['cases'])+1
        data[n]['cases'].append({'id':f'FSM2-HCASE-{n:03}-{i:02}', 'chapterId':f'FSM2-{n:03}',
          'context':context,'correctConclusion':correct,'misconclusion':wrong,'rationale':reason,
          'arithmetic':calcs})
    assert set(data)==set(range(1,75))
    assert all(len(v['cases'])==10 and v['assumptions'] for v in data.values())
    return data

def math_note(case):
    return '; '.join(x['expression'].replace('ceil','올림').replace('min','최솟값').replace('max','최댓값').replace('/','÷').replace('*','×')+' → '+x['display'] for x in case['arithmetic'])

def build():
    chapters=runpy.run_path(str(ROOT/'scripts/build-fire-general-mock740.py'))['chapters']()
    source=parse_cases();frozen={name:sha(P/name) for name in PRESERVE}
    rng=random.Random(202610197402);positions=[k for k in range(4) for _ in range(185)];rng.shuffle(positions)
    bank=[];notes=[];case_notes=[]
    repair_choices=['가만 수정','나만 수정','가, 나 모두 수정','수정할 항목 없음']
    for n,bundle in sorted(source.items()):
        c=chapters[n];cases=bundle['cases'];case_notes+=cases
        for i in range(10):
            qid=f'FSM2-MOCK-{n:03}-{i+11:02}'
            indices=[i,(i+3)%10] if i<8 else [i,(i+3)%10,(i+6)%10]
            chosen=[cases[j] for j in indices];labels=['가','나','다'][:len(chosen)]
            prefix=f"[{c['title']} · 복합 사례]\n{bundle['assumptions']}"
            context='\n\n'.join(f'{label}. {case["context"]}' for label,case in zip(labels,chosen))
            if i<4:
                fmt='compound-conclusions';shown=None
                stem=prefix+'\n\n'+context+'\n\n가와 나의 판단을 모두 옳게 연결한 것은?'
                def verdict(flags):return ' / '.join(f'{label}: '+case['correctConclusion' if good else 'misconclusion'] for label,case,good in zip(labels,chosen,flags))
                correct=verdict([True,True]);wrong=[verdict(t) for t in ([False,True],[True,False],[False,False])]
            elif i<8:
                fmt='minimum-repair-set';shown=[bool(rng.getrandbits(1)) for _ in chosen]
                evaluations='\n\n'.join(f'{label}의 기록: '+case['correctConclusion' if good else 'misconclusion'] for label,case,good in zip(labels,chosen,shown))
                stem=prefix+'\n\n'+context+'\n\n'+evaluations+'\n\n사례 조건을 그대로 적용할 때 반드시 수정해야 하는 기록을 빠짐없이 고른 것은?'
                failed=[label for label,good in zip(labels,shown) if not good]
                correct='수정할 항목 없음' if not failed else '가, 나 모두 수정' if len(failed)==2 else failed[0]+'만 수정'
                wrong=[v for v in repair_choices if v!=correct]
            else:
                fmt='three-case-audit';shown=[bool(rng.getrandbits(1)) for _ in chosen]
                evaluations='\n\n'.join(f'{label}의 검토 의견: '+case['correctConclusion' if good else 'misconclusion'] for label,case,good in zip(labels,chosen,shown))
                stem=prefix+'\n\n'+context+'\n\n'+evaluations+'\n\n제시된 검토 의견을 각각 판단했을 때 옳은 의견은 모두 몇 개인가?'
                correct=f'{sum(shown)}개';wrong=[f'{k}개' for k in range(4) if k!=sum(shown)]
            explanation=[]
            for label,case in zip(labels,chosen):
                sentence=f"{label}: {case['correctConclusion']}. 근거: {case['rationale']}."
                if case['arithmetic']:sentence+=' 계산: '+math_note(case)+'.'
                explanation.append(sentence)
            if shown is not None:
                explanation.append('제시 기록 판정: '+' / '.join(f"{label} {'옳음' if good else '수정 필요'}" for label,good in zip(labels,shown))+'.')
            rng.shuffle(wrong);a=positions[len(bank)];choices=wrong[:];choices.insert(a,correct)
            bank.append({'id':qid,'chapterId':c['id'],'subjectId':c['subjectId'],'tags':['심화'],
              'question':stem,'choices':choices,'answerIndex':a,'explanation':'\n\n'.join(explanation)})
            notes.append({'id':qid,'chapterId':c['id'],'caseRefs':[s['id'] for s in chosen],
              'format':fmt,'shownJudgments':shown,'applicationJudgments':len(chosen),
              'difficultyTarget':'hard','difficultyCalibration':'not-measured',
              'difficultyMechanisms':['independent-case-applications','partial-correctness-distractors']+
                (['arithmetic-with-conditions'] if any(s['arithmetic'] for s in chosen) else []),
              'sourceQuestionId':None,'sourceIsOfficialExam':False,
              'reviewStatus':'draft','publicationApproved':False,
              'remainingChecks':['combined-textbook-pages-primary-authority-answer-distractor-similarity-and-difficulty-review']})
    assert len(bank)==740
    save(P/'hard740.json',bank)
    save(P/'hard-editorial.json',{'basisCommit':BASE,'sourcePath':str(SOURCE.relative_to(ROOT)),
      'sourceSHA256':sha(SOURCE),'chapterBasis':list(chapters.values()),'chapterAssumptions':{f'FSM2-{n:03}':v['assumptions'] for n,v in source.items()},
      'caseNotes':case_notes,'questions':notes,'reviewStatus':'draft','publicationApproved':False})
    general=read(P/'general740.json');core=read(P/'core500.json');allq=general+bank+core
    out=P/'review-all';out.mkdir(exist_ok=True);counts=[]
    for n,c in sorted(chapters.items()):
        groups=[('일반 기본문항',general),('일반 심화문항',bank),('핵심 변형문항',core)]
        selected=[(label,[q for q in qs if q['chapterId']==c['id']]) for label,qs in groups]
        lines=[f"# {c['id']} · {c['title']}",'',
          f"일반 기본 10개 + 일반 심화 10개 + 핵심 {len(selected[2][1])}개 · 내용 검수 대기 초안",'',
          '[전체 1,980문항 검토 목록](../review-all-index.md)','',
          f"근거 챕터: [{c['title']}]({os.path.relpath(ROOT/c['path'],out)})",'',
          '심화는 사례 조건을 2~3개 함께 적용하도록 설계한 난도 목표이며 실제 정답률로 검증된 등급이 아니다. 교재 쪽수·현행 근거·정답·오답·유사도는 전체를 한 번에 검토한다.','']
        for label,qs in selected:
            lines.extend([f'## {label}',''])
            for q in qs:
                lines.extend([f"### {q['id']}",'',q['question'],''])
                lines.extend(f'{i+1}. {s}' for i,s in enumerate(q['choices']))
                lines.extend(['',f"**정답: {q['answerIndex']+1}번**",'',f"해설: {q['explanation']}",''])
        (out/f'{n:03}.md').write_text('\n'.join(lines).rstrip()+'\n')
        counts.append({'chapterId':c['id'],'title':c['title'],'subjectId':c['subjectId'],
          'general':10,'hard':10,'core':len(selected[2][1]),'reviewFile':f'review-all/{n:03}.md'})
    index=['# 실전 모의고사 전체 검토 목록 — 1,980문항','',
      '**74개 챕터 × (기본 10개 + 심화 10개) = 일반 1,480개**, 별도 핵심 500개를 합쳐 총 **1,980개**다.','',
      '작성과 기본 구조·계산 확인 후 전체 내용 검수는 한 번에 진행할 수 있도록 대기한다. 기존 일반 740개·핵심 500개의 문제·정답·해설은 보존했다.','',
      '심화 740개는 2~3개 사례의 복합 결론, 수정 대상 전부 선택, 세 사례 평가를 이용한다. 실제 정답률·변별력은 측정하지 않았다.','',
      '| 챕터 | 과목 | 기본 | 심화 | 핵심 | 검토본 |','|---|---:|---:|---:|---:|---|']
    index += [f"| {x['chapterId']} {x['title']} | {x['subjectId']} | 10 | 10 | {x['core']} | [열기]({x['reviewFile']}) |" for x in counts]
    index+=['','## 일괄 검토 범위','','교재 쪽수·문맥 및 현행 공식 근거 대조 → 정답 독립 도출과 오답 제거 → 기본·심화·핵심 유사도 및 난도 조정 → 최종 승인 목록 확정 순서로 검토한다. 모든 문항은 초안이며 서비스 탑재 전이다.','']
    (P/'review-all-index.md').write_text('\n'.join(index))
    old=P/'review-index.md';oldtext=old.read_text()
    banner='> 최신 전체 검토본: [기본·심화·핵심 1,980문항](review-all-index.md). 아래는 심화 추가 전 1,240문항 목록이다.\n\n'
    if not oldtext.startswith(banner):old.write_text(banner+oldtext)
    save(P/'combined1980-manifest.json',{'version':2,'createdDate':'2026-10-19','basisCommit':BASE,
      'generalBaseCount':740,'generalHardCount':740,'generalTotalCount':1480,'coreCount':500,'totalCount':1980,
      'chapterCount':74,'generalPerChapter':20,'hardPerChapter':10,
      'questionFiles':['general740.json','hard740.json','core500.json'],
      'reviewIndex':'review-all-index.md','chapters':counts,'preservedInputs':frozen,
      'hardFormats':dict(collections.Counter(q['format'] for q in notes)),
      'hardSubjectCounts':dict(collections.Counter(q['subjectId'] for q in bank)),
      'hardCaseCount':len(case_notes),'arithmeticCaseCount':sum(bool(s['arithmetic']) for s in case_notes),
      'arithmeticExpressionCount':sum(len(s['arithmetic']) for s in case_notes),
      'sourcePath':str(SOURCE.relative_to(ROOT)),'sourceSHA256':sha(SOURCE),
      'reviewPolicy':'one-combined-editorial-pass','reviewStatus':'draft','publicationApproved':False})
    assert all(sha(P/name)==expected for name,expected in frozen.items())
    print(json.dumps({'addedHardQuestions':len(bank),'generalTotal':1480,'core':500,'combined':len(allq),
      'chapters':len(chapters),'formats':dict(collections.Counter(q['format'] for q in notes)),
      'semanticReview':'deferred-to-combined-pass'},ensure_ascii=False))

if __name__=='__main__':build()
