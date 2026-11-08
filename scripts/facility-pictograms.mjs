// Semantic, editable facility-employment pictograms. 104 × 104 local coordinates.
// These illustrate the card topic; they are not official logos or legal symbols.
function gearOutline(cx,cy){
  return Array.from({length:32},(_,i)=>{
    const angle=(i*11.25-90)*Math.PI/180;
    const radius=[12.5,18,18,12.5][i%4];
    return (i?'L':'M')+(cx+Math.cos(angle)*radius).toFixed(2)+' '+(cy+Math.sin(angle)*radius).toFixed(2);
  }).join(' ')+'Z';
}
export const PICTOGRAMS = {
  'public-employer': {
    meaning: '공공기관 청사와 직접 고용',
    svg: '<path fill="#E9F5E6" d="M10 36L52 10l42 26Z"/><path d="M8 37h88M15 89h74M10 97h84"/><path fill="#E9F5E6" d="M20 44h12v37H20zM46 44h12v37H46zM72 44h12v37H72z"/><circle cx="52" cy="26" r="5" fill="#12523C" stroke="none"/>'
  },
  subsidiary: {
    meaning: '모회사와 별도 법인인 자회사의 연결',
    svg: '<rect x="7" y="8" width="37" height="47" rx="5" fill="#E9F5E6"/><path d="M18 21h6m8 0h2M18 33h6m8 0h2M21 55V44h10v11M25 56v29h27"/><rect x="57" y="44" width="38" height="52" rx="5" fill="#E9F5E6"/><path d="M68 58h6m8 0h2M68 71h6m8 0h2M71 96V83h10v13"/><circle cx="25" cy="84" r="5" fill="#12523C" stroke="none"/>'
  },
  'service-contractor': {
    meaning: '별도 전문업체와 맺는 위탁·근로계약',
    svg: '<rect x="9" y="30" width="33" height="61" rx="4" fill="#E9F5E6"/><path d="M19 43h5m8 0h1M19 56h5m8 0h1M21 91V73h10v18"/><path fill="#FFFFFF" d="M49 11h30l14 15v65H49Z"/><path d="M79 11v17h14M59 40h23M59 53h14M59 77l7-7 7 7 9-9"/><path d="M34 69h15" stroke-width="6"/>'
  },
  'average-pay': {
    meaning: '여러 직원의 보수 집계와 평균값',
    svg: '<path d="M12 12v77h80"/><path fill="#E9F5E6" d="M24 61h13v28H24zM46 32h13v57H46zM68 46h13v43H68z"/><path d="M17 48h73" stroke-dasharray="8 6"/><circle cx="77" cy="23" r="18" fill="#FFFFFF"/><path d="M65 18l5 13 7-16 7 16 5-13M64 23h26" stroke-width="3.8"/>'
  },
  'job-offer': {
    meaning: '특정 직위와 제시 급여가 있는 채용공고',
    svg: '<rect x="15" y="9" width="66" height="84" rx="7" fill="#FFFFFF"/><path fill="#E9F5E6" d="M15 9h66v22H15Z"/><path d="M27 20h27M29 46h28M29 58h37M29 70h20"/><rect x="57" y="66" width="38" height="29" rx="5" fill="#E9F5E6"/><path d="M68 66v-7h16v7M58 78h36M73 77v6"/>'
  },
  'legal-employer': {
    meaning: '근로계약 상대방으로 확인할 회사의 신원',
    svg: '<rect x="8" y="20" width="75" height="66" rx="8" fill="#E9F5E6"/><path d="M8 39h75M23 13h11v14M56 13h11v14"/><circle cx="31" cy="55" r="8" fill="#FFFFFF"/><path d="M18 74q2-13 13-13t13 13M53 53h17M53 65h12"/><circle cx="78" cy="78" r="19" fill="#FFFFFF"/><path d="M68 78l7 7 13-15"/>'
  },
  worksite: {
    meaning: '근무 사업장 위치와 관리할 설비·업무',
    svg: '<g data-part="building"><rect x="8" y="18" width="40" height="76" rx="3" fill="#E9F5E6"/><path d="M19 33h5m10 0h4M19 48h5m10 0h4M19 63h5M21 94V78h14v16"/></g><g data-part="pin"><path fill="#FFFFFF" d="M93 24c0 13-14 27-14 27S65 37 65 24a14 14 0 0 1 28 0Z"/><circle cx="79" cy="24" r="5"/></g><g data-part="gear" data-teeth="8"><path fill="#E9F5E6" d="'+gearOutline(79,80)+'"/><circle cx="79" cy="80" r="6" fill="#FFFFFF"/></g>'
  },
  qualification: {
    meaning: '자격증·경력 증빙과 요건 확인',
    svg: '<rect x="15" y="9" width="69" height="72" rx="5" fill="#FFFFFF"/><path fill="#E9F5E6" d="M25 22h49v17H25Z" stroke="none"/><path d="M29 29h38M29 49h38M29 61h22"/><path fill="#E9F5E6" d="M60 72l-3 24 13-7 13 7-4-24Z"/><circle cx="70" cy="65" r="18" fill="#E9F5E6"/><path d="M61 65l6 6 12-13"/>'
  },
  'shift-calendar': {
    meaning: '교대 일정과 주간·야간 근무표',
    svg: '<g data-part="calendar"><rect x="8" y="17" width="88" height="78" rx="7" fill="#FFFFFF"/><path fill="#E9F5E6" d="M8 25q0-8 8-8h72q8 0 8 8v16H8Z"/><path d="M29 9v16M75 9v16M8 41h88"/></g><g data-part="sun"><circle cx="32" cy="68" r="8" fill="#E9F5E6"/><path d="M14 68h4M46 68h4M32 50v4M32 82v4"/></g><g data-part="moon" transform="translate(56 47) scale(1.55)" stroke-width="3.2"><path fill="#E9F5E6" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></g>'
  },
  'pay-components': {
    meaning: '기본급·수당·상여로 구성된 급여명세',
    svg: '<path fill="#FFFFFF" d="M13 9h61v79l-10-5-10 5-10-5-10 5-10-5-11 5Z"/><path fill="#E9F5E6" d="M24 20h39v15H24Z" stroke="none"/><path d="M25 27h35M24 47h18m12 0h8M24 60h18m12 0h8M24 73h18"/><ellipse cx="77" cy="72" rx="18" ry="7" fill="#E9F5E6"/><path fill="#E9F5E6" d="M59 72v17c0 9 36 9 36 0V72c0 9-36 9-36 0Z"/><path d="M59 81c0 9 36 9 36 0"/>'
  },
  'contract-term': {
    meaning: '계약기간·정년과 적용 시점 확인',
    svg: '<path fill="#FFFFFF" d="M13 9h44l15 15v65H13Z"/><path fill="#E9F5E6" d="M57 9v17h15Z"/><path d="M26 38h32M26 51h24M26 72l7-7 7 7 9-9"/><circle cx="77" cy="75" r="22" fill="#E9F5E6"/><path d="M77 61v15l10 6M77 53v4M99 75h-4M77 97v-4M55 75h4"/>'
  }
};

export function semanticIconSvg(name,cx,cy,size){
  const icon=PICTOGRAMS[name];
  if(!icon)return null;
  return '<g class="semantic-pictogram" data-icon="'+name+'" transform="translate('+(cx-size/2)+' '+(cy-size/2)+') scale('+(size/104)+')" fill="none" stroke="#12523C" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">'+icon.svg+'</g>';
}
