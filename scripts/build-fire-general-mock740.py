"""Render 74 x 10 unpublished general mock items for one later editorial pass.

The 001 sample and core500 are preserved. Hand-authored assertions are paired with
explicit misconceptions; rendering handles options, IDs and review navigation only.
It does not certify the assertions or imply that final textbook/legal review is done.
"""
from pathlib import Path
import collections, hashlib, json, os, random, re

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'docs/drafts/fire-level2-mock-exam'
SRC=ROOT/'scripts/fire-mock-authoring'

def read_json(p):return json.loads(p.read_text())
def save(p,value):p.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()

def chapters():
    result={}
    for p in (ROOT/'src/content/chapters/fire-safety-manager-level2').rglob('*.md'):
        t=p.read_text();n=int(re.search(r'chapter_id:\s*[\"\']?FSM2-(\d+)',t)[1])
        result[n]={'id':f'FSM2-{n:03}','title':re.search(r'^title:\s*(.+)$',t,re.M)[1].strip().strip(chr(34)+chr(39)),
          'subjectId':int(re.search(r'^subject_id:\s*(\d+)',t,re.M)[1]),
          'path':str(p.relative_to(ROOT)),'sha256':sha(p),
          'sections':re.findall(r'^##\s+(.+)$',t,re.M)}
    assert set(result)==set(range(1,75))
    return result

def cards():
    result={};n=None
    for s in (SRC/'chapter-facts.txt').read_text().splitlines():
        if not s or s.startswith('#'):continue
        if re.fullmatch(r'\[\d{3}\]',s):n=int(s[1:-1]);result[n]=[];continue
        p=s.split('|');assert len(p) in (3,6),(n,p)
        f={'focus':p[0],'supported':p[1],'misconception':p[2],'calculation':None}
        if len(p)==6:f['calculation']={'expression':p[3],'expected':float(p[4]),'unit':p[5]}
        result[n].append(f)
    assert set(result)==set(range(2,75))
    assert all(len(v)==10 for v in result.values())
    return result

POSITIVE=[
 '{title}에 관한 설명으로 옳은 것은?',
 '{title}의 기준을 적용한 판단 중 옳은 것은?',
 '다음 중 {title}의 개념과 조건을 정확히 설명한 것은?',
 '{title}를 학습한 뒤 정리한 내용이다. 옳게 정리한 것은?',
 '{title} 관련 사례를 판별할 때 타당한 판단은?',
 '{title}에 대한 검토 의견 중 적절한 것은?']
NEGATIVE=[
 '{title}에 관한 설명으로 옳지 않은 것은?',
 '{title}의 적용을 검토한 내용 중 잘못된 것은?']
# Avoid Korean particle errors in generic prompts without changing chapter titles.
POSITIVE[3]='「{title}」 학습 내용을 정리했다. 옳게 정리한 것은?'

def build():
    OUT.mkdir(parents=True,exist_ok=True)
    ch=chapters();data=cards();numeric=read_json(SRC/'numerical-items.json')
    sample=read_json(OUT/'chapter001-sample.json');core=read_json(OUT/'core500.json')
    immutable={p:sha(OUT/p) for p in ['core500.json','editorial-review.json','chapter001-sample.json']}
    general=list(sample);editorial=[]
    for q in sample:
        editorial.append({'id':q['id'],'chapter':ch[1], 'method':'preserved-chapter001-sample',
          'targetDecision':'대상물 등급 사례 판정','format':'case-single-best-answer',
          'assertions':[], 'numericItem':False,'sourceQuestionId':None,
          'textbookPageStatus':'pending-combined-editorial-review',
          'reviewStatus':'draft','publicationApproved':False,'remainingChecks':['combined-semantic-textbook-current-basis-and-distractor-review']})
    targets=[]
    used=collections.Counter(q['answerIndex'] for q in sample)
    for k in range(4):targets += [k]*(185-used[k])
    rng=random.Random(20261019740);rng.shuffle(targets);target_i=0
    for n,fs in sorted(data.items()):
        c=ch[n]
        for i,f in enumerate(fs):
            key=f'{n:03}-{i+1:02}';qid=f'FSM2-MOCK-{key}'
            support=[];is_numeric=key in numeric
            if is_numeric:
                stem,correct,wrong=numeric[key];fmt='numerical-case'
                assert f['calculation'],key
                reason=f"{f['supported']}. 계산: {f['calculation']['expression'].replace('ceil','올림').replace('/','÷').replace('*','×')} = {f['calculation']['expected']:g} {f['calculation']['unit']}."
                support=[{'card':i+1,**f,'shownTrue':True}]
            elif i<8:
                others=[(i+d)%10 for d in (1,3,6)]
                positive=i<6
                fmt='single-best-answer' if positive else 'single-incorrect-answer'
                stem=(POSITIVE[i] if positive else NEGATIVE[i-6]).format(title=c['title'])
                correct=f['supported'] if positive else f['misconception']
                wrong=[fs[j]['misconception'] if positive else fs[j]['supported'] for j in others]
                support=[{'card':i+1,**f,'shownTrue':positive}]+[{'card':j+1,**fs[j],'shownTrue':not positive} for j in others]
                if positive:
                    reason=f"옳은 판단은 ‘{f['supported']}’이다. 나머지 보기의 기준은 다음과 같이 바로잡는다: "+' / '.join(fs[j]['supported'] for j in others)
                else:
                    reason=f"잘못된 판단은 ‘{f['misconception']}’이다. 올바른 내용은 ‘{f['supported']}’이다. 나머지 보기는 각 조건에 맞는 설명이다."
            else:
                indices=[i,(i+3)%10] if i==8 else [i,(i+4)%10,(i+7)%10]
                truths=[bool(rng.getrandbits(1)) for _ in indices]
                # Use all truth patterns across chapters; no fixed answer-combination key.
                labels=['ㄱ','ㄴ','ㄷ'][:len(indices)]
                sentences=[]
                for label,j,t in zip(labels,indices,truths):
                    sentences.append(f'{label}. '+(fs[j]['supported'] if t else fs[j]['misconception']))
                    support.append({'card':j+1,**fs[j],'shownTrue':t,'label':label})
                stem=f"「{c['title']}」에 관한 다음 진술을 판단한 것으로 옳은 것은?\n\n"+'\n\n'.join(sentences)
                def verdict(ts):
                    selected=[label for label,t in zip(labels,ts) if t]
                    if len(selected)==len(labels):return ', '.join(labels)+' 모두 옳다'
                    if not selected:return ', '.join(labels)+' 모두 틀리다'
                    return ', '.join(selected)+'만 옳다'
                correct=verdict(truths)
                alternatives=[]
                for mask in range(2**len(indices)):
                    v=verdict([bool(mask & (1<<k)) for k in range(len(indices))])
                    if v!=correct:alternatives.append(v)
                wrong=rng.sample(alternatives,3);fmt='assertion-combination'
                reason=' '.join(f"{label}은 {'옳다' if t else '틀리다'}. {fs[j]['supported']}." for label,j,t in zip(labels,indices,truths))
            rng.shuffle(wrong);answer=targets[target_i];target_i+=1
            options=wrong[:];options.insert(answer,correct)
            general.append({'id':qid,'chapterId':c['id'],'subjectId':c['subjectId'], 'tags':[],
              'question':stem,'choices':options,'answerIndex':answer,'explanation':reason})
            editorial.append({'id':qid,'chapter':c,'method':'chapter-grounded-authored-assertions',
              'targetDecision':f['focus'],'format':fmt,'assertions':support,
              'numericItem':is_numeric,'sourceQuestionId':None,
              'textbookPageStatus':'pending-combined-editorial-review',
              'reviewStatus':'draft','publicationApproved':False,
              'remainingChecks':['combined-semantic-textbook-current-basis-and-distractor-review']})
    assert len(general)==len(editorial)==740
    assert target_i==730
    save(OUT/'general740.json',general);save(OUT/'general-editorial.json',editorial)
    review=OUT/'review';review.mkdir(exist_ok=True)
    manifest=[]
    for n,c in sorted(ch.items()):
        normal=[q for q in general if q['chapterId']==c['id']]
        special=[q for q in core if q['chapterId']==c['id']]
        lines=[f"# {c['id']} · {c['title']}",'',
          f"일반 {len(normal)}개 · 핵심 {len(special)}개 · 내용 검수 대기 초안",'',
          '[전체 검토 목록](../review-index.md)', '',
          f"근거 챕터: [{c['title']}]({os.path.relpath(ROOT/c['path'],review)})",'',
          '일반문항은 현재 챕터의 이론·조건을 바탕으로 작성했다. 교재 쪽수별 직접 대조·현행 근거·정답과 오답의 유일성은 두 풀을 합친 후 검토한다.','']
        for title,qs in [('일반 실전문항',normal),('핵심 변형문항',special)]:
            lines.extend([f'## {title}',''])
            for q in qs:
                lines.extend([f"### {q['id']}",'',q['question'],''])
                lines.extend(f'{k+1}. {v}' for k,v in enumerate(q['choices']))
                lines.extend(['',f"**정답: {q['answerIndex']+1}번**",'',f"해설: {q['explanation']}",''])
        (review/f'{n:03}.md').write_text('\n'.join(lines).rstrip()+'\n')
        manifest.append({'chapterId':c['id'],'title':c['title'],'subjectId':c['subjectId'],
          'general':len(normal),'core':len(special),'reviewFile':f'review/{n:03}.md'})
    index=['# 실전 모의고사 통합 검토 목록','',
      '74개 챕터 일반문항 740개와 핵심 변형문항 500개, 총 **1,240개**의 작성 초안이다.','',
      '사용자 요청에 따라 내용 검수는 전체 작성 뒤 한 번에 진행한다. 여기서는 초안 작성과 기본 구조 검사를 완료하고, 문항별 교재 대조·정답·오답·유사도 검토는 대기 상태로 둔다.','',
      '| 챕터 | 과목 | 일반 | 핵심 | 검토본 |','|---|---:|---:|---:|---|']
    for m in manifest:index.append(f"| {m['chapterId']} {m['title']} | {m['subjectId']} | {m['general']} | {m['core']} | [열기]({m['reviewFile']}) |")
    index+=['','각 검토본에는 해당 챕터의 두 풀과 정답·해설이 함께 있다. 핵심 문항이 없는 챕터도 일반 10개는 포함한다. 원본 복원문제의 제공처·연도는 실제 시험 인증 표시로 사용하지 않는다.','',
      '## 일괄 검토 순서','',
      '1. 교재의 쪽수·문맥과 현행 법령·기술기준·의학 지침 대조',
      '2. 정답 독립 도출, 오답 세 개의 틀린 이유와 조건 누락 확인',
      '3. 일반·핵심 간 유사도와 반복 개념, 난이도·문항 형식 조정',
      '4. 수치·단위·계산식·정답 위치와 해설 최종 확인',
      '5. 승인 문항 목록 확정 후 별도로 서비스 연결·화면 검증','']
    (OUT/'review-index.md').write_text('\n'.join(index))
    arithmetic=[{'chapterId':f'FSM2-{n:03}','card':i+1,'supported':f['supported'],**f['calculation']}
      for n,fs in sorted(data.items()) for i,f in enumerate(fs) if f['calculation']]
    save(OUT/'combined-manifest.json',{'version':1,'createdDate':'2026-10-19',
      'generalCount':740,'coreCount':500,'totalCount':1240,'chapterCount':74,
      'reviewPolicy':'one-combined-editorial-pass-after-all-drafts-exist',
      'reviewStatus':'draft','publicationApproved':False,
      'sourceBasis':'current corrected chapter theory; textbook page verification pending combined review',
      'generalSourceSHA256':sha(SRC/'chapter-facts.txt'),
      'numericalSourceSHA256':sha(SRC/'numerical-items.json'),
      'preservedInputs':immutable,'chapters':manifest,'arithmeticAssertions':arithmetic,
      'generalFormatCounts':dict(collections.Counter(e['format'] for e in editorial)),
      'generalSubjectCounts':dict(collections.Counter(q['subjectId'] for q in general)),
      'coreSubjectCounts':dict(collections.Counter(q['subjectId'] for q in core)),
      'questionFiles':['general740.json','core500.json'],
      'editorialFiles':['general-editorial.json','editorial-review.json']})
    assert all(sha(OUT/p)==s for p,s in immutable.items())
    print(json.dumps({'general':len(general),'core':len(core),'total':len(general)+len(core),
      'chapters':len(ch),'numericalCases':len(numeric),'review':'DRAFT; combined semantic review pending'},ensure_ascii=False))

if __name__=='__main__':build()
