import { appendFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const repo = 'syjy813/getpasslab';
const branch = process.env.GITHUB_REF?.replace(/^refs\/heads\//, '');
const allowed = new Set(['main', 'chore/ga4-auth-connection']);
const token = process.env.GITHUB_TOKEN;
const path = 'src/data/facility-page-views.json';
const emitChanged = async value => {
  if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, `changed=${value}\n`, 'utf8');
};

try {
  if (process.env.GITHUB_REPOSITORY !== repo || !allowed.has(branch)
      || !['push', 'workflow_dispatch', 'schedule'].includes(process.env.GITHUB_EVENT_NAME)
      || !token) throw new Error('GitHub publication context is not authorized.');

  const content = await readFile(resolve(import.meta.dirname, '..', path));
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  const endpoint = `https://api.github.com/repos/${repo}/contents/${path}`;
  const prior = await fetch(`${endpoint}?ref=${encodeURIComponent(branch)}`, {
    headers, signal: AbortSignal.timeout(15000),
  });
  if (prior.status !== 404 && !prior.ok) throw new Error(`GitHub snapshot lookup failed (HTTP ${prior.status}).`);
  const oldFile = prior.status === 404 ? null : await prior.json();
  if (oldFile && oldFile.encoding === 'base64' && oldFile.content?.replace(/\s/g, '') === content.toString('base64')) {
    await emitChanged(false);
    console.log('GA4 snapshot unchanged; no commit needed.');
    process.exit(0);
  }
  const payload = {
    message: 'data: refresh facility article page views [skip ci]',
    content: content.toString('base64'),
    branch,
  };
  if (oldFile) payload.sha = oldFile.sha;
  const response = await fetch(endpoint, {
    method: 'PUT', headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload), signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error(`GitHub snapshot commit failed (HTTP ${response.status}).`);
  await emitChanged(true);
  console.log('GA4 snapshot committed to the existing branch.');
} catch (error) {
  console.error(error instanceof Error && /^GitHub (publication|snapshot)/.test(error.message)
    ? error.message : 'GA4 snapshot publication failed; previously committed data retained.');
  process.exitCode = 1;
}
