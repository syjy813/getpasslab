import assert from 'node:assert/strict';
import {fetchDailyPageViews,buildFacilityViewData,buildDailyFacilityViewData,PAGE_SIZE} from './lib/facility-page-views.mjs';
const target='/facility-management/career/example/';
const other='/facility-management/career/empty/';
const now=new Date('2026-11-18T00:00:00Z');
const response=(rows,total=rows.reduce((n,r)=>n+r[2],0),rowCount=rows.length)=>({
 dimensionHeaders:[{name:'date'},{name:'pagePath'}],metricHeaders:[{name:'screenPageViews'}],rowCount,
 totals:[{metricValues:[{value:String(total)}]}],metadata:{timeZone:'Asia/Seoul'},
 rows:rows.map(([date,path,count])=>({dimensionValues:[{value:date},{value:path}],metricValues:[{value:String(count)}]})),
});
const rows=[['20261115',target,2],['20261115',target.slice(0,-1),1],['20261117',target,4],['20261117','/unrelated/',10]];
let calls=0;
const report=await fetchDailyPageViews({propertyId:'547805075',token:'fixture',now,fetchReport:async(_url,options)=>{
 const body=JSON.parse(options.body);assert.deepEqual(body.dimensions,[{name:'date'},{name:'pagePath'}]);
 assert.equal(body.dateRanges[0].endDate,'2026-11-17');calls++;return new Response(JSON.stringify(response(rows)));
}});
assert.equal(calls,1);
const snapshot=buildFacilityViewData({publishedPaths:[target,other],report,propertyId:'547805075',now});
const daily=buildDailyFacilityViewData({snapshot,report,metadata:[{path:target,publishedAt:'2026-11-15'},{path:other,publishedAt:'2026-11-17'}]});
const at=date=>daily.dates.indexOf(date);
assert.equal(snapshot.totalArticleViews,7);assert.equal(daily.totals[at('2026-11-15')],3);
assert.equal(daily.totals[at('2026-11-16')],0);assert.equal(daily.totals[at('2026-11-17')],4);
assert.equal(daily.articles[target][at('2026-11-14')],null);assert.equal(daily.articles[other][at('2026-11-17')],0);
assert.equal(daily.dates[0],'2026-07-30');assert.equal(daily.dates.at(-1),'2026-11-17');
assert.equal(daily.totals.reduce((a,b)=>a+b),snapshot.totalArticleViews);
assert.throws(()=>buildDailyFacilityViewData({snapshot:{...snapshot,totalArticleViews:8},report,metadata:[{path:target,publishedAt:'2026-11-15'},{path:other,publishedAt:'2026-11-17'}]}));
console.log('PASS actual daily values, canonical duplicates, missing-day zero, prepublication null, range and cumulative reconciliation');
for(const [name,body] of [
 ['invalid calendar date',response([['20260230',target,1]])],
 ['future date',response([['20261118',target,1]])],
 ['duplicate row',response([['20261117',target,1],['20261117',target,1]])],
 ['incorrect totals',response(rows,999)],
 ['wrong dimensions',{...response(rows),dimensionHeaders:[{name:'pagePath'}]}],
])await assert.rejects(fetchDailyPageViews({propertyId:'547805075',token:'fixture',now,fetchReport:async()=>new Response(JSON.stringify(body))}),Error,name);
console.log('PASS reject invalid/future dates, repeated date-path rows, incomplete headers and inconsistent totals');
const many=Array.from({length:PAGE_SIZE+1},(_,i)=>['20261117',`/fixture-${i}/`,1]);let page=0;
const paged=await fetchDailyPageViews({propertyId:'547805075',token:'fixture',now,fetchReport:async(_url,options)=>{
 const query=JSON.parse(options.body);assert.equal(query.offset,page*PAGE_SIZE);
 return new Response(JSON.stringify(response(many.slice(page++*PAGE_SIZE,page*PAGE_SIZE),many.length,many.length)));
}});
assert.equal(page,2);assert.equal(paged.dailyRows.length,PAGE_SIZE+1);assert.equal(paged.totalViews,PAGE_SIZE+1);
console.log('PASS complete daily pagination above one report page');
