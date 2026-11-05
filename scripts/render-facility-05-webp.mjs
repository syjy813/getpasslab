// Render facility 05 SVG masters to WebP at their stable public URLs.
// The headline, brand and frame come from the SVG template. The hero artwork
// is a separate immutable WebP source, composited via Sharp (not SVG data URI):
// librsvg/Sharp does not reliably paint embedded WebP SVG <image> nodes.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {heroGeometry} from './generate-facility-thumbnail.mjs';

const heroMaster='facility-asset-edits/05/01-public-sector-hero.svg';
const heroSource='facility-assets/05/01-public-sector-hero.webp';
const heroSpec='docs/audits/2026-11-05-facility-05-visual-refresh/01-public-sector-hero.json';

export async function renderFacility05MasterWebp(masterPath){
  const {default:sharp}=await import('sharp');
  const svg=fs.readFileSync(masterPath);
  if(masterPath.replaceAll('\\','/')!==heroMaster){
    return sharp(svg,{density:96})
      .resize(1440,1080,{fit:'fill'})
      .webp({quality:86,effort:6}).toBuffer();
  }
  const spec=JSON.parse(fs.readFileSync(heroSpec,'utf8'));
  const crop=spec.graphicCrop;
  const meta=await sharp(heroSource).metadata();
  assert.equal(meta.width,crop.sourceWidth,'original hero artwork width');
  assert.equal(meta.height,crop.sourceHeight,'original hero artwork height');
  const safe=heroGeometry(spec).safe;
  // The crop removes the legacy headline/brand while preserving the detailed
  // job-seeker, public buildings and HVAC equipment in the original image.
  const art=await sharp(heroSource)
    .extract({left:crop.x,top:crop.y,width:crop.width,height:crop.height})
    .resize(safe.width,safe.height,{fit:'contain',background:'#FFFFFF'})
    .png().toBuffer();
  const shell=await sharp(svg,{density:96})
    .resize(1440,1080,{fit:'fill'})
    .png().toBuffer();
  const full=await sharp(shell)
    .composite([{input:art,left:safe.x,top:safe.y}])
    .webp({quality:86,effort:6}).toBuffer();
  return full;
}
