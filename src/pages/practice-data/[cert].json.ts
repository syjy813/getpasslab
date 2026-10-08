import type { APIRoute } from 'astro';
import industrialQuestions from '../../../data/questions/industrial-safety.json';
import energyQuestions from '../../../data/questions/energy-management.json';
import computerQuestions from '../../../data/questions/computer-literacy.json';

// Static, read-only snapshots of existing canonical question records.
// Keep original question IDs, choices, source answer indices and body text.
const datasets = {
  'industrial-safety': industrialQuestions,
  'energy-management': energyQuestions,
  'computer-literacy': computerQuestions,
} as const;

export function getStaticPaths() {
  return Object.keys(datasets).map(cert => ({ params: { cert } }));
}

export const GET: APIRoute = ({ params }) => {
  const cert = params.cert as keyof typeof datasets;
  const rows = datasets[cert];
  if (!rows) return new Response('Not found', { status: 404 });
  const safe = rows.map(q => ({
    id: q.id, label: q.label, number: q.number,
    body: q.body, choices: q.choices, answer: q.answer,
  }));
  return new Response(JSON.stringify(safe), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=600',
    },
  });
};
