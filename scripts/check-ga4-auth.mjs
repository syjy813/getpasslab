import { appendFile } from 'node:fs/promises';

// Authentication smoke test only. No credentials, paths, or raw reports are saved.
const propertyId = process.env.GA4_PROPERTY_ID;
const token = process.env.GA4_ACCESS_TOKEN;
if (!/^\d+$/.test(propertyId ?? '') || !token) {
  console.error('Missing GA4_PROPERTY_ID or GA4_ACCESS_TOKEN.');
  process.exit(1);
}

const body = {
  dateRanges: [{ startDate: '2026-07-30', endDate: 'yesterday' }],
  dimensions: [{ name: 'pagePath' }],
  metrics: [{ name: 'screenPageViews' }],
  dimensionFilter: {
    filter: {
      fieldName: 'hostName',
      inListFilter: { values: ['getpasslab.co.kr', 'www.getpasslab.co.kr'] },
    },
  },
  metricAggregations: ['TOTAL'],
  orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
  limit: 1,
  returnPropertyQuota: true,
};

try {
  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000),
    },
  );
  if (!response.ok) {
    // Never print raw error bodies or request headers into public Actions logs.
    throw new Error(`GA4 report request failed (HTTP ${response.status}).`);
  }
  const report = await response.json();
  const views = report.totals?.[0]?.metricValues?.[0]?.value;
  const rowCount = report.rowCount;
  if (report.dimensionHeaders?.[0]?.name !== 'pagePath'
      || report.metricHeaders?.[0]?.name !== 'screenPageViews'
      || !/^\d+$/.test(views ?? '')
      || !Number.isSafeInteger(Number(views))
      || !Number.isSafeInteger(rowCount) || rowCount < 1
      || report.rows?.length !== 1) {
    throw new Error('GA4 response did not contain a valid page-view report.');
  }
  if (report.metadata?.subjectToThresholding
      || report.metadata?.dataLossFromOtherRow
      || report.metadata?.samplingMetadatas?.length) {
    throw new Error('GA4 report needs data-quality review before ingestion.');
  }
  const summary = [
    'GA4 authentication and report query: PASS',
    `Property: ${propertyId}`,
    'Host filter: getpasslab.co.kr, www.getpasslab.co.kr',
    'Period: 2026-07-30 through yesterday (GA4 property time zone)',
    `Reported page paths: ${rowCount}`,
    `Total page views: ${views}`,
    `Quota remaining per day: ${report.propertyQuota?.tokensPerDay?.remaining ?? 'unknown'}`,
    'No raw reports or credentials persisted; no site deployment performed.',
  ].join('\n');
  console.log(summary);
  if (process.env.GITHUB_STEP_SUMMARY) {
    await appendFile(process.env.GITHUB_STEP_SUMMARY, `${summary}\n`, 'utf8');
  }
} catch (error) {
  // Only the fixed messages created above may be printed; redact network errors.
  const message = error instanceof Error && error.message.startsWith('GA4 ')
    ? error.message : 'GA4 authentication test failed; review connectivity and configuration.';
  console.error(message);
  process.exitCode = 1;
}
