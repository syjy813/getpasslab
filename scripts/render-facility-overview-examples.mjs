import fs from 'node:fs';
import {renderInfographic} from './generate-facility-infographic.mjs';

const root = 'docs/standards/facility-infographic-templates/';
for (const name of ['overview-example-4','overview-example-5','overview-example-6','overview-workload-4']) {
  const spec = JSON.parse(fs.readFileSync(root+name+'.json','utf8'));
  for (const viewport of ['desktop','mobile']) {
    const svg = renderInfographic({...spec,viewport});
    fs.writeFileSync(root+name+'-'+viewport+'.svg',svg);
    console.log(name+' '+viewport+' '+svg.match(/width="(\d+)" height="(\d+)"/).slice(1).join('×'));
  }
}
