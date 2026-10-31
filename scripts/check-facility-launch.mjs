import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {facilityReview,beforeFacilityLaunch} from './read-before-facility-launch.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex');
const walk=d=>fs.existsSync(d)?fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(d+'/'+e.name):[d+'/'+e.name]):[];
const files=[...walk('src'),...walk('public'),...walk('dist').filter(f=>/\.(html|xml)$/.test(f))].sort();
assert.deepEqual(files,Object.keys(facilityReview.current).sort(),'complete current inventory');
for(const f of files){const b=fs.readFileSync(f);assert.equal(hash(b),facilityReview.current[f],f+': reviewed native bytes');if(facilityReview.changes[f]){assert.equal(hash(beforeFacilityLaunch(f,b)),facilityReview.changes[f].beforeSHA256,f+': preceding bytes');assert.notEqual(hash(beforeFacilityLaunch(f,Buffer.concat([b,Buffer.from('mutation')]))),facilityReview.changes[f].beforeSHA256,f+': unknown edits rejected');}}
const assets=walk('facility-assets').sort();assert.deepEqual(assets,Object.keys(facilityReview.assets).sort(),'reviewed image inventory');for(const f of assets)assert.equal(hash(fs.readFileSync(f)),facilityReview.assets[f],f+': reviewed image');
assert.equal(walk('dist/images/facility-drafts').length,0,'draft images excluded from normal build');
console.log('[Facility native] PASS',files.length,'files');
