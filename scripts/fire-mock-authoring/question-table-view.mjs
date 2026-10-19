// Shared pure filtering/paging logic runs in the local preview and its data QA.
export function filterRows(rows, filters = {}) {
  const query = (filters.query || '').trim().toLocaleLowerCase();
  return rows.filter(row =>
    (!filters.subject || row.subjectId === Number(filters.subject)) &&
    (!filters.core || row.isCore === (filters.core === 'yes')) &&
    (!filters.type || row.questionType === filters.type) &&
    (!filters.review || row.reviewStatus === filters.review) &&
    (!query || [row.id, row.chapterTitle, row.question, row.sourceQuestionId || ''].join(' ').toLocaleLowerCase().includes(query))
  );
}
export function pageRows(rows, requested = 1, size = 50) {
  const pages = Math.max(1, Math.ceil(rows.length / size));
  const page = Math.max(1, Math.min(pages, requested));
  return {page, pages, rows: rows.slice((page - 1) * size, page * size)};
}
if (typeof document !== 'undefined') {
  const rows = JSON.parse(document.getElementById('question-data').textContent);
  const labels = {source_reconstruction:'핵심 원본', source_variant:'핵심 변형', general:'일반 기본', advanced:'일반 심화'};
  const statusLabels = {draft_complete:'초안 작성',ocr_review_required:'OCR 대조 필요',source_visual_review_required:'원문 대조 필요'};
  let currentPage = 1;
  const controls = ['subject','core','type','review','query'].map(id => document.getElementById(id));
  function cell(text) { const td=document.createElement('td'); td.textContent=text; return td; }
  function draw() {
    const filters=Object.fromEntries(controls.map(el=>[el.id,el.value]));
    const filtered=filterRows(rows,filters); const view=pageRows(filtered,currentPage); currentPage=view.page;
    document.getElementById('result-count').textContent=`검색 결과 ${filtered.length.toLocaleString()}개 · ${view.page}/${view.pages}쪽`;
    const body=document.getElementById('rows'); body.replaceChildren();
    for(const q of view.rows) {
      const tr=document.createElement('tr');
      tr.append(cell(q.id),cell(q.subjectName),cell(q.isCore?'핵심':'—'),cell(labels[q.questionType]),cell(q.chapterTitle),cell('검수대기'),cell(statusLabels[q.contentStatus]));
      const detail=cell(''); const disclosure=document.createElement('details');const summary=document.createElement('summary');
      summary.textContent=q.question.replace(/\s+/g,' ').slice(0,120);disclosure.append(summary);
      const text=document.createElement('pre');
      text.textContent=[q.question,'',...(q.choices?q.choices.map((c,i)=>`${i+1}. ${c}`):['선택지 분리 미완료. 아래 제공 원문을 대조해 주세요.']),
        '',`정답 표시: ${q.answerNumber}번 (미검수)`,q.explanation||'해설 분리 미완료',
        q.sourceQuestionId?`원본 연결: ${q.sourceQuestionId}`:'',q.rawSourceText?'\n제공된 추출 원문\n'+q.rawSourceText:''].join('\n');
      disclosure.append(text);detail.append(disclosure);tr.append(detail,cell('비공개'));body.append(tr);
    }
    if(!view.rows.length){const tr=document.createElement('tr');const td=cell('조건에 맞는 문항이 없습니다.');td.colSpan=9;tr.append(td);body.append(tr);}
    document.getElementById('prev').disabled=view.page===1;document.getElementById('next').disabled=view.page===view.pages;
  }
  controls.forEach(el=>el.addEventListener(el.id==='query'?'input':'change',()=>{currentPage=1;draw();}));
  document.getElementById('prev').addEventListener('click',()=>{currentPage--;draw();});
  document.getElementById('next').addEventListener('click',()=>{currentPage++;draw();});
  document.getElementById('reset').addEventListener('click',()=>{controls.forEach(el=>el.value='');currentPage=1;draw();});
  draw();
}
