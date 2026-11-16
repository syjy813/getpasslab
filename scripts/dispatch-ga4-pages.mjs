const repo = 'syjy813/getpasslab';
const token = process.env.GITHUB_TOKEN;

try {
  if (process.env.GITHUB_REPOSITORY !== repo || process.env.GITHUB_REF !== 'refs/heads/main'
      || !['schedule', 'workflow_dispatch'].includes(process.env.GITHUB_EVENT_NAME)
      || !token) throw new Error('Production dispatch context is not authorized.');
  // A commit made with GITHUB_TOKEN does not trigger the normal push deployment.
  // Explicit workflow_dispatch is the documented exception, and existing deploy.yml owns Pages.
  const response = await fetch(`https://api.github.com/repos/${repo}/actions/workflows/deploy.yml/dispatches`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ref: 'main' }),
    signal: AbortSignal.timeout(30000),
  });
  if (response.status !== 204) throw new Error(`Pages dispatch failed (HTTP ${response.status}).`);
  console.log('Existing Pages deployment requested for the refreshed GA4 data.');
} catch (error) {
  console.error(error instanceof Error && /^Pages dispatch/.test(error.message)
    ? error.message : 'GA4 Pages deployment dispatch failed.');
  process.exitCode = 1;
}
