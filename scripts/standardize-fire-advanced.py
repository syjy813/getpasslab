"""Replace the compound-case pool with ordinary four-choice chapter questions.

Historical authored inputs and publication evidence stay immutable. This explicit
revision records before snapshots, chapter fingerprints and option-level evidence.
It does not estimate human difficulty or claim a new textbook-page audit.
"""
from pathlib import Path
import collections, hashlib, json, random, re, runpy

ROOT = Path(__file__).resolve().parents[1]
P = ROOT / 'docs/drafts/fire-level2-mock-exam'
A = ROOT / 'docs/releases/2026-10-21-fire-standard-questions'
def digest(b): return hashlib.sha256(b).hexdigest()
def dump(p, v): p.write_text(json.dumps(v, ensure_ascii=False, indent=2)+'\n')
def compact(v): return json.dumps(v, ensure_ascii=False, separators=(',', ':'))

def main():
    A.mkdir(parents=True, exist_ok=True)
    table_path = P/'question-table.json'
    old_bytes = table_path.read_bytes()
    old = json.loads(old_bytes)
    assert digest(old_bytes) == '5e8aff95c51806879e76211c126efe502ee9994b05a5366940d59c889590b1de', 'run only against the reviewed production baseline'
    author = runpy.run_path(str(ROOT/'scripts/build-fire-general-mock740.py'))
    chapters, cards = author['chapters'](), author['cards']()
    # Carry forward the three approved general-pool clarifications and supply
    # missing subjects when a fact becomes a standalone alternative.
    fixes = {
      (27,1): ('대형소화기는 운반대·바퀴와 A급 10단위·B급 20단위 이상 등 해당 요건을 확인한다', None),
      (56,0): ('이동이 어려운 피난약자는 이동 곤란 정도와 보조기구·인원에 맞춰 안전한 피난 방법을 정한다', None),
      (56,1): ('시각장애인에게 보행을 안내할 때는 보조자의 팔·어깨를 잡게 하고 방향·거리·문턱을 구체적으로 알린다', None),
      (56,3): ('청각 정보를 인지하기 어려운 사람에게 표정·몸짓·빛·짧은 글 등 시각 정보를 사용한다', None),
      (58,7): ('반응 있는 성인·1세 이상 소아가 말·효과적인 기침이 불가능한 심한 이물 기도폐쇄이고 복부 밀어내기 제외 조건이 없으면, 등 두드리기 5회 후 효과가 없을 때 복부 밀어내기 5회를 교대한다', None),
      (65,4): ('트래킹은 오염·습기로 절연물 표면에 탄화 도전 경로가 생기는 현상이다', None),
      (73,7): ('옷에 불이 붙으면 멈추고 바닥에 엎드려 얼굴을 보호하며 구른다', None),
      (74,8): ('해당 사업장용 보일러의 고체연료는 본체에서 수평 2m 이상 또는 불연 별도 구획 조건을 확인한다', None),
    }
    for (n,i),(supported,wrong) in fixes.items():
        cards[n][i]['supported']=supported
        if wrong: cards[n][i]['misconception']=wrong
    # Simple, single-building classification. Other upper-grade conditions and
    # statutory exclusions are expressly absent; no paired-case inference.
    grade_cases = [
      ('지상 48층, 높이 205m인 아파트', '특급', '아파트는 높이 200m 이상이면 특급이다.'),
      ('지상 28층, 높이 125m인 아파트', '1급', '아파트는 특급에 해당하지 않고 높이가 120m 이상이면 1급이다.'),
      ('지상 12층, 높이 45m, 연면적 8,000㎡인 업무시설', '1급', '아파트 외 건축물은 특급에 해당하지 않고 지상 11층 이상이면 1급이다.'),
      ('지상 4층, 높이 18m, 연면적 2,400㎡이며 옥내소화전설비 설치 대상인 업무시설', '2급', '상위 등급에 해당하지 않는 옥내소화전설비 설치 대상은 2급이다.'),
      ('지상 3층, 높이 12m, 연면적 900㎡이며 자동화재탐지설비만 설치 대상인 근린생활시설', '3급', '상위 등급에 해당하지 않는 자동화재탐지설비 설치 대상은 3급이다.'),
      ('가연성가스를 250t 저장하는 시설', '2급', '가연성가스 저장량이 100t 이상 1,000t 미만이면 2급이다.'),
      ('가연성가스를 1,200t 저장하는 시설', '1급', '가연성가스 저장량이 1,000t 이상이면 1급이다.'),
      ('지상 31층, 높이 110m인 아파트', '1급', '특급에 해당하지 않는 아파트는 30층 이상이면 1급이다.'),
      ('지상 32층, 높이 110m, 연면적 20,000㎡인 업무시설', '특급', '아파트 외 건축물은 지하층을 포함하여 30층 이상이면 특급이다.'),
      ('지상 5층, 높이 20m, 연면적 4,000㎡이며 스프링클러설비 설치 대상인 업무시설', '2급', '상위 등급에 해당하지 않는 스프링클러설비 설치 대상은 2급이다.'),
    ]
    rows=[]; reviews={}; before={}; facts={}
    rng=random.Random(20261021740)
    for n,fs in cards.items():
        for i,f in enumerate(fs): facts[f'{n:03}-{i+1:02}']={**f,'chapterId':chapters[n]['id']}
    for row in old:
        if row['questionType']!='advanced': rows.append(row); continue
        before[row['id']]=row
        n=int(row['chapterId'][-3:]); i=int(row['id'][-2:])-11
        key=row['answerNumber']-1
        new={**row, 'questionType':'general', 'difficulty':'basic', 'tags':[]}
        if n==1:
            context,answer,reason=grade_cases[i]
            new['question']='다음 대상물의 소방안전관리 등급은?\n\n'+context+'이다.\n\n※ 제시된 조건 외에 상위 등급 조건이나 법정 제외 사유는 없다.'
            options=[x for x in ['특급','1급','2급','3급'] if x!=answer]
            options.insert(key,answer)
            new['choices']=options
            evidence={'format':'single-building-grade','correctText':answer,'rationale':reason,'context':context}
            new['explanation']=reason
        else:
            fs=cards[n]
            # Opposite polarity to base items 1–8, and ordinary alternatives
            # instead of the old combination tasks at 9–10. New fact subsets
            # are deliberately different from the base pool's +1,+3,+6.
            positive=i>=6
            indices=[i,(i+2)%10,(i+4)%10,(i+7)%10]
            answer_kind='supported' if positive else 'misconception'
            other_kind='misconception' if positive else 'supported'
            options=[{'card':f'{n:03}-{j+1:02}','true':not positive,'text':fs[j][other_kind]} for j in indices[1:]]
            rng.shuffle(options)
            options.insert(key,{'card':f'{n:03}-{i+1:02}','true':positive,'text':fs[i][answer_kind]})
            new['question']=f"{chapters[n]['title']}에 대한 설명으로 {'옳은' if positive else '옳지 않은'} 것은?"
            new['choices']=[o['text'] for o in options]
            new['explanation']=f"{row['answerNumber']}번이 {'옳은' if positive else '옳지 않은'} 설명이다.\n\n"+'\n'.join(f"{j+1}번: {facts[o['card']]['supported']}." for j,o in enumerate(options))
            evidence={'format':'single-correct' if positive else 'single-incorrect','options':options}
        assert len(new['choices'])==len(set(new['choices']))==4
        rows.append(new)
        reviews[new['id']]={**evidence,'chapter':chapters[n]['path'],'chapterSHA256':chapters[n]['sha256'], 'answerNumber':new['answerNumber'], 'afterSHA256':digest(compact(new).encode()),'difficultyTarget':'ordinary-practice','humanCalibration':'not-measured'}
    assert len(before)==740 and len(rows)==2480
    dump(A/'assertions.json', facts)
    dump(A/'before-rows.json', before)
    dump(A/'review.json', reviews)
    dump(A/'replacements.json',{q['id']:{k:q[k] for k in ['question','choices','explanation','questionType','difficulty','tags']} for q in rows if q['id'] in before})
    dump(table_path,rows)
    revision={'version':1,'baselineCommit':'0510b593daab6ea652222e538056eb3c5a785aa6','beforeTableSHA256':digest(old_bytes),'tableSHA256':digest(table_path.read_bytes()),'replacedCount':740,'preservedCount':1740,'publishedCount':2328,'heldCount':152,'beforeRowsSHA256':digest((A/'before-rows.json').read_bytes()),'assertionsSHA256':digest((A/'assertions.json').read_bytes()),'reviewSHA256':digest((A/'review.json').read_bytes()),'historicalInputsPreserved':True,'reviewMethod':'chapter-facts-and-approved-clarifications; four-option truth derivation; duplicate checks; model editorial review','textbookPageAudit':'not-repeated','humanDifficulty':'not-measured'}
    revision['replacementsSHA256']=digest((A/'replacements.json').read_bytes())
    dump(A/'revision.json',revision)
    meta=json.loads((P/'question-table-manifest.json').read_text())
    meta['tableSHA256']=revision['tableSHA256']
    meta['standardizationRevision']='docs/releases/2026-10-21-fire-standard-questions/revision.json'
    meta['summary']=[r for r in meta['summary'] if r['type']!='advanced']
    general=next(r for r in meta['summary'] if r['type']=='general')
    general.update(label='일반',subject1=980,subject2=500,total=1480)
    dump(P/'question-table-manifest.json',meta)
    html=(P/'question-table.html').read_text()
    html=re.sub(r'(<script id="question-data" type="application/json">)[\s\S]*?(</script>)',lambda m:m[1]+compact(rows).replace('<','\\u003c')+m[2],html)
    html=html.replace('<tr><td>일반 기본</td><td>490</td><td>250</td><td>740</td></tr><tr><td>일반 심화</td><td>490</td><td>250</td><td>740</td></tr>','<tr><td>일반</td><td>980</td><td>500</td><td>1,480</td></tr>')
    html=html.replace('일반 기본','일반').replace('일반 심화','이전 심화(0개)')
    (P/'question-table.html').write_text(html)
    view=ROOT/'scripts/fire-mock-authoring/question-table-view.mjs'
    view.write_text(view.read_text().replace("general:'일반 기본', advanced:'일반 심화'", "general:'일반', advanced:'이전 심화(0개)'"))
    print(json.dumps({'replaced':len(before),'counts':dict(collections.Counter(q['questionType'] for q in rows))}))

if __name__=='__main__': main()
