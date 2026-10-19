"""Build one management table: original500 + variant500 + general740 + hard740.

The core marker belongs to the user's original reconstruction rows. Existing
variant inputs retain their historical bytes; their old tag is normalized at
this management-table boundary. No row is approved for practice/publication.
"""
import argparse, collections, hashlib, html, json, re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
P=ROOT/'docs/drafts/fire-level2-mock-exam'

def read(p):return json.loads(p.read_text())
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def save(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')

def parse_original(row):
    text=row['sourceText'];sections=re.split(r'정[답탑]\s*및\s*해설',text,maxsplit=1)
    front=sections[0];parts=re.split(r'(?m)^\s*([1-4])\s*\n',front)
    if len(parts)==9 and parts[1::2]==['1','2','3','4']:
        choices=[s.strip() for s in parts[2::2]];method='number-lines'
    else:
        parts=re.split(r'(?m)^[ \t]*(?:\(([1-4])\)|([1-4])[.．])[ \t]*',front)
        numbers=[a or b for a,b in zip(parts[1::3],parts[2::3])]
        choices=[s.strip() for s in parts[3::3]] if len(parts)==13 and numbers==['1','2','3','4'] else None
        method='punctuated-numbers' if choices else 'raw-source-only'
    if choices and (len(choices)!=4 or any(not s for s in choices)):choices=None;method='raw-source-only'
    return choices,sections[1].strip() if len(sections)>1 else None,method

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--source',type=Path,required=True);args=ap.parse_args()
    original=read(args.source)['mapping'];assert len(original)==500
    paths=['general740.json','hard740.json','core500.json','editorial-review.json','general-editorial.json','hard-editorial.json']
    inputs={name:sha(P/name) for name in paths}
    ch={}
    for f in (ROOT/'src/content/chapters/fire-safety-manager-level2').rglob('*.md'):
        t=f.read_text();cid=re.search(r'chapter_id:\s*[\"\']?(FSM2-\d+)',t)[1]
        ch[cid]={'title':re.search(r'^title:\s*(.+)$',t,re.M)[1].strip().strip(chr(34)+chr(39)),
          'subjectId':int(re.search(r'^subject_id:\s*(\d+)',t,re.M)[1]),'path':str(f.relative_to(ROOT))}
    core_notes={r['id']:r for r in read(P/'editorial-review.json')}
    source_ids={r['sourceQuestionId'] for r in original};rows=[];parse_counts=collections.Counter()
    def base(qid,cid,kind,is_core,difficulty):
        subject=ch[cid]['subjectId']
        return {'id':qid,'subjectId':subject,'subjectName':f'{subject}과목','chapterId':cid,'chapterTitle':ch[cid]['title'],
          'questionType':kind,'isCore':is_core,'difficulty':difficulty,'reviewStatus':'pending',
          'contentStatus':'draft_complete','publicationStatus':'unpublished','examEligible':False,
          'sourceQuestionId':None,'sourceSet':None,'sourcePDFPage':None,'sourceIsOfficialExam':False,
          'sourceTextProvenance':None,'choicesExtraction':None,'tags':[],
          'question':None,'choices':None,'answerNumber':None,'explanation':None,'rawSourceText':None}
    for r in original:
        q=base(r['sourceQuestionId'],r['primaryChapter'],'source_reconstruction',True,'unrated')
        assert r['officialSubject']==q['subjectId']
        choices,reason,method=parse_original(r);parse_counts[method]+=1
        q.update({'contentStatus':'ocr_review_required' if 'OCR' in r['textProvenance'] else 'source_visual_review_required',
          'sourceQuestionId':r['sourceQuestionId'],'sourceSet':r['sourceSetLabel'],'sourcePDFPage':r['questionStartPage'],
          'sourceTextProvenance':r['textProvenance'],'choicesExtraction':method,'tags':['핵심'],
          'question':r['stem'].strip(),'choices':choices,'answerNumber':r['displayedAnswer'],
          'explanation':reason,'rawSourceText':r['sourceText']})
        rows.append(q)
    for file,kind,difficulty in [('core500.json','source_variant','unrated'),('general740.json','general','basic'),('hard740.json','advanced','advanced')]:
        for r in read(P/file):
            q=base(r['id'],r['chapterId'],kind,False,difficulty)
            assert q['subjectId']==r['subjectId']
            q.update({'tags':['핵심 변형'] if kind=='source_variant' else r['tags'],
              'question':r['question'],'choices':r['choices'],'answerNumber':r['answerIndex']+1,'explanation':r['explanation'],
              'choicesExtraction':'authored-four-choices'})
            if kind=='source_variant':
                e=core_notes[r['id']];assert e['sourceQuestionId'] in source_ids
                q.update({'sourceQuestionId':e['sourceQuestionId'],'sourceSet':e['sourceSet'],'sourcePDFPage':e['sourcePDFPage']})
            rows.append(q)
    assert len(rows)==2480 and len({q['id'] for q in rows})==2480
    rows.sort(key=lambda q:(q['subjectId'],q['chapterId'],not q['isCore'],q['questionType'],q['id']))
    save(P/'question-table.json',rows)
    names={'source_reconstruction':'핵심 원본','source_variant':'핵심 변형','general':'일반 기본','advanced':'일반 심화'}
    summary=[]
    for kind,label in names.items():
        counts=collections.Counter(q['subjectId'] for q in rows if q['questionType']==kind)
        summary.append({'type':kind,'label':label,'subject1':counts[1],'subject2':counts[2],'total':sum(counts.values())})
    manifest={'version':1,'sourceIndexSHA256':sha(args.source),'sourceIndexFilename':args.source.name,
      'inputSHA256':inputs,'tableSHA256':sha(P/'question-table.json'),'rowCount':2480,'coreOriginalCount':500,
      'authoredCount':1980,'originalAdditionalReferenceCount':500,'sourceOptionExtractionCounts':dict(parse_counts),
      'subjectCounts':dict(collections.Counter(q['subjectId'] for q in rows)),'summary':summary,
      'coreDefinition':'isCore=true exactly for the 500 user-provided original reconstruction rows',
      'answerNumberConvention':'1-based; original displayed answers and authored draft answers are unverified',
      'legacyInputs':'Historical pool files are preserved; use question-table.json for current type and core flags.',
      'semanticReview':'pending-one-combined-review','publicationStatus':'unpublished'}
    save(P/'question-table-manifest.json',manifest)
    lines=['# 통합 문항 관리표','',
      '[필터 가능한 관리표 열기](question-table.html) · [통합 데이터](question-table.json)','',
      '하나의 행은 원본 또는 작성 문항 한 개다. 원본 500개와 변형 500개를 별개로 관리한다. 기존 작성분 1,980개에 원본 참조 500행을 더한 관리표는 총 2,480행이다. 원본을 새로 집필한 수량에 더하지 않는다.','',
      '| 구분 | 1과목 | 2과목 | 합계 |','|---|---:|---:|---:|']
    lines += [f"| {r['label']} | {r['subject1']:,} | {r['subject2']:,} | {r['total']:,} |" for r in summary]
    lines += ['| **관리표 전체** | **1,488** | **992** | **2,480** |',
      '| 기존 작성분만 | 1,234 | 746 | 1,980 |','',
      '과목은 현재 챕터 배정 기준이다. 복원자료의 묶음명·연도·표시답은 공식 시험일이나 공식 확정답안의 인증을 의미하지 않는다.','',
      '## 컬럼 정의','',
      '| 컬럼 | 의미 |','|---|---|',
      '| `id` | 기존 문항 ID 또는 원본의 sourceQuestionId. ID를 새로 바꾸지 않음 |',
      '| `subjectId`, `subjectName` | 1과목 / 2과목. 모든 2,480행에 값 존재 |',
      '| `chapterId`, `chapterTitle` | 연결 챕터와 제목 |',
      '| `isCore` | 사용자 제공 원본 500행만 true. 화면에는 핵심 표시 |',
      '| `questionType` | source_reconstruction(원본), source_variant(변형), general(기본), advanced(심화) |',
      '| `difficulty` | 기본 / 심화 / 미지정. 핵심 여부와 난도를 분리 |',
      '| `reviewStatus` | 현재 전체 pending(검수대기) |',
      '| `contentStatus` | 초안 작성 / OCR 대조 필요 / 원문 시각 대조 필요 |',
      '| `publicationStatus`, `examEligible` | 현재 모두 unpublished·false. 등록과 시험 출제 가능 여부를 분리 |',
      '| `sourceQuestionId` | 원본은 자기 ID, 변형은 대응 원본 ID, 신규 기본·심화는 null |',
      '| `question`, `choices`, `answerNumber`, `explanation` | 지문·선택지·1부터 시작하는 정답번호·해설 |',
      '| `rawSourceText` | 원본 500개의 제공된 추출문. 누락된 선택지를 변형 문항으로 채우지 않음 |',
      '| `sourceSet`, `sourcePDFPage`, `sourceTextProvenance`, `choicesExtraction` | 원자료 묶음·위치·추출 및 분리 상태 |','',
      '## 원본과 변형의 표시','',
      '- 핵심: 전달받은 원본 500개',
      '- 핵심 변형: 그 원본 각각과 1:1로 연결된 별도 작성 500개. isCore=false',
      '- 일반 기본·심화: 각각 740개. isCore=false',
      '- 이전 core500.json의 파일명과 핵심 태그는 과거 변형 풀의 제작 이력이다. 최신 관리·필터는 이 통합표의 isCore와 questionType을 사용한다. 원본과 변형을 동일 문항으로 표시하지 않는다.','',
      '## 원문 대조 상태','',
      f"원본 500개 중 선택지 4개를 구조적으로 분리한 행은 {500-parse_counts['raw-source-only']}개, 안전하게 분리하지 못해 choices=null로 둔 행은 {parse_counts['raw-source-only']}개다. 모두 원본 표시답·OCR·그림·현행 근거의 내용 검수 전이다. 선택지 미분리를 정상 4지선다로 표시하지 않으며 rawSourceText를 보존했다.",'',
      '이 작업은 컬럼과 관리표 정리이며 원문 OCR 교정·정답 전수 검수·실서버 탑재가 아니다. 기존 작성 1,980개의 문제·선택지·답·해설 및 공개 src/public은 변경하지 않았다.','',
      '## 재생성','',
      '```bash','python3 scripts/build-fire-question-table.py --source /path/to/outline-data.json',
      'node scripts/verify-fire-question-table.mjs','```','']
    (P/'question-table.md').write_text('\n'.join(lines))
    # One self-contained review file. Its data are generated from the canonical table.
    template=(ROOT/'scripts/fire-mock-authoring/question-table-template.html').read_text()
    summary_html=''.join(f"<tr><td>{html.escape(x['label'])}</td><td>{x['subject1']:,}</td><td>{x['subject2']:,}</td><td>{x['total']:,}</td></tr>" for x in summary)
    template=template.replace('__SUMMARY_ROWS__',summary_html)
    tokens=re.search(r':root\s*\{([^}]+)\}',(ROOT/'src/styles/global.css').read_text(),re.S)[0]
    module=(ROOT/'scripts/fire-mock-authoring/question-table-view.mjs').read_text().replace('export ','')
    embedded=json.dumps(rows,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')
    (P/'question-table.html').write_text(template.replace('__TOKENS__',tokens).replace('__DATA__',embedded).replace('__SCRIPT__',module))
    banner='> 원본 500개까지 포함한 최신 [2,480행 통합 관리표](question-table.md)에서 과목·핵심 여부를 확인할 수 있다. 아래 목록은 작성 문항 1,980개 검토본이다.\n\n'
    index=P/'review-all-index.md'
    if not index.read_text().startswith(banner):index.write_text(banner+index.read_text())
    assert all(sha(P/f)==digest for f,digest in inputs.items())
    print(json.dumps({'managementRows':len(rows),'authoredQuestions':1980,'coreOriginals':500,'summary':summary,'sourceExtraction':dict(parse_counts)},ensure_ascii=False))

if __name__=='__main__':main()
