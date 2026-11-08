// Exact transformation for episode 0: retain all prose/metadata except the
// actual modification date, and replace only the three known figure pairs.
export const integratedImageRoot='docs/audits/2026-11-08-hobyeongbaekma-integrated-images';
export const integratedImageStyles='\n/* Complete comparison sheets reserve the selected artwork ratio before loading. */\n.facility-body .facility-overview-figure picture{display:block}\n.facility-body .facility-overview-figure img{aspect-ratio:var(--overview-ratio)}\n@media(max-width:767px){.facility-body .facility-overview-figure img{aspect-ratio:var(--overview-mobile-ratio)}}\n';

export function integratedPicture(row){
  const d=row.desktop,m=row.mobile;
  return '<figure class="facility-overview-figure" data-image-group="'+row.id+'"><picture><source media="(max-width:767px)" srcset="'+m.src+'" width="'+m.width+'" height="'+m.height+'" /><img src="'+d.src+'" alt="'+row.alt+'" width="'+d.width+'" height="'+d.height+'" style="--overview-ratio:'+d.width+'/'+d.height+';--overview-mobile-ratio:'+m.width+'/'+m.height+'" loading="lazy" decoding="async" /></picture></figure>';
}

export function integrateEpisode00Images(previous,manifest){
  if(manifest.groups.length!==3)throw Error('Exactly three approved image groups are required');
  let article=previous;
  for(const row of manifest.groups){
    const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    const pattern=new RegExp('<figure><img src="'+escape(row.previous[0])+'"[^>]*\\/></figure>\\s*<figure><img src="'+escape(row.previous[1])+'"[^>]*\\/></figure>','g');
    if([...article.matchAll(pattern)].length!==1)throw Error('Missing or duplicate source pair: '+row.id);
    article=article.replace(pattern,()=>integratedPicture(row));
  }
  if(!article.includes("updatedAt: '2026-11-07'"))throw Error('Unexpected previous modification date');
  return article.replace("updatedAt: '2026-11-07'","updatedAt: '"+manifest.updatedAt+"'");
}
