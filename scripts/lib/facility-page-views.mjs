import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { facilityNavigationCategorySlug } from '../../src/config/facility.ts';

export const GA4_START_DATE = '2026-07-30';
export const GA4_HOSTS = ['getpasslab.co.kr', 'www.getpasslab.co.kr'];
export const PAGE_SIZE = 10000;

function scalar(frontmatter, key) {
  const raw = new RegExp(`^${key}:\\s*(.+)$`, 'm').exec(frontmatter)?.[1]?.trim() ?? '';
  if (raw.startsWith("'") && raw.endsWith("'")) return raw.slice(1, -1).replaceAll("''", "'");
  if (raw.startsWith('"') && raw.endsWith('"')) return JSON.parse(raw);
  return raw;
}

export async function publishedFacilityArticles(contentDirectory) {
  const filenames = (await readdir(contentDirectory)).filter(name => name.endsWith('.md')).sort();
  const articles = [];
  for (const filename of filenames) {
    const content = await readFile(join(contentDirectory, filename), 'utf8');
    const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(content)?.[1];
    if (!frontmatter) throw new Error('Facility content has no valid frontmatter.');
    const status = scalar(frontmatter, 'status');
    const category = scalar(frontmatter, 'category');
    if (!['published', 'draft'].includes(status) || !/^[a-z][a-z0-9-]*$/.test(category))
      throw new Error('Facility content status or category is invalid.');
    if (status !== 'published') continue;
    const slug = filename.slice(0, -3);
    const title = scalar(frontmatter, 'title');
    const publishedAt = scalar(frontmatter, 'publishedAt');
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !title || !/^\d{4}-\d{2}-\d{2}$/.test(publishedAt))
      throw new Error('Facility article metadata is invalid.');
    const navigationCategory = scalar(frontmatter, 'navigationCategory') || undefined;
    const displayCategory = facilityNavigationCategorySlug({ id: slug, data: { category, navigationCategory } });
    articles.push({ path: `/facility-management/${category}/${slug}/`, title, publishedAt, category: displayCategory });
  }
  if (!articles.length || new Set(articles.map(a => a.path)).size !== articles.length)
    throw new Error('Facility article list is empty or contains duplicate URLs.');
  return articles;
}

export async function publishedFacilityPaths(contentDirectory) {
  return (await publishedFacilityArticles(contentDirectory)).map(a => a.path).sort();
}

export function canonicalPagePath(rawPath) {
  if (typeof rawPath !== 'string' || !rawPath.startsWith('/') || /[?#\\]/.test(rawPath)) return null;
  if (rawPath.includes('//') || rawPath.includes('/./') || rawPath.includes('/../')) return null;
  return rawPath.endsWith('/') ? rawPath : `${rawPath}/`;
}

function assertWholeNumber(value) {
  if (typeof value !== 'string' || !/^\d+$/.test(value)) throw new Error('GA4 metric is invalid.');
  const number = Number(value);
  if (!Number.isSafeInteger(number)) throw new Error('GA4 metric exceeds safe integer precision.');
  return number;
}

function assertReportPage(report, expectedOffset, totalRows, dimensions = ['pagePath']) {
  if (report.dimensionHeaders?.length !== dimensions.length || dimensions.some((name, index) => report.dimensionHeaders[index]?.name !== name)
      || report.metricHeaders?.length !== 1 || report.metricHeaders[0]?.name !== 'screenPageViews'
      || !Number.isSafeInteger(report.rowCount) || report.rowCount < 1
      || (totalRows !== null && report.rowCount !== totalRows)
      || !Array.isArray(report.rows)
      || report.rows.length !== Math.min(PAGE_SIZE, report.rowCount - expectedOffset)
      || report.metadata?.subjectToThresholding
      || report.metadata?.dataLossFromOtherRow
      || report.metadata?.samplingMetadatas?.length
      || report.metadata?.dataTruncationReasons?.some(reason => reason !== 'DATA_TRUNCATION_REASON_UNSPECIFIED')) {
    throw new Error('GA4 report is incomplete, sampled, or changed during pagination.');
  }
}

export async function fetchAllPageViews({ propertyId, token, fetchReport = fetch, now = new Date(), includeDates = false }) {
  if (!/^\d+$/.test(propertyId ?? '') || !token) throw new Error('GA4 credentials are missing.');
  const endDate = yesterdayInTimeZone('Asia/Seoul', now);
  const dimensions = includeDates ? ['date', 'pagePath'] : ['pagePath'];
  const dailyRows = [];
  const seen = new Set();
  const views = new Map();
  let totalRows = null;
  let totalViews = null;
  let timeZone = null;
  for (let offset = 0; totalRows === null || offset < totalRows; offset += PAGE_SIZE) {
    const response = await fetchReport(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dateRanges: [{ startDate: GA4_START_DATE, endDate }],
        dimensions: dimensions.map(name => ({ name })),
        metrics: [{ name: 'screenPageViews' }],
        dimensionFilter: {
          filter: { fieldName: 'hostName', inListFilter: { values: GA4_HOSTS } },
        },
        metricAggregations: ['TOTAL'],
        orderBys: dimensions.map(dimensionName => ({ dimension: { dimensionName } })),
        limit: PAGE_SIZE,
        offset,
      }),
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) throw new Error(`GA4 report request failed (HTTP ${response.status}).`);
    const report = await response.json();
    assertReportPage(report, offset, totalRows, dimensions);
    if (totalRows === null) {
      totalRows = report.rowCount;
      timeZone = report.metadata?.timeZone ?? null;
      if (timeZone !== 'Asia/Seoul') throw new Error('GA4 property time zone must be Asia/Seoul.');
      if (report.totals?.length !== 1) throw new Error('GA4 total is missing.');
      totalViews = assertWholeNumber(report.totals[0]?.metricValues?.[0]?.value);
    }
    for (const row of report.rows) {
      const path = row.dimensionValues?.[includeDates ? 1 : 0]?.value;
      let date = null;
      if (includeDates) {
        const compact = row.dimensionValues?.[0]?.value;
        if (typeof compact !== 'string' || !/^\d{8}$/.test(compact)) throw new Error('GA4 report date is invalid.');
        date = `${compact.slice(0, 4)}-${compact.slice(4, 6)}-${compact.slice(6)}`;
        if (!Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date
            || date < GA4_START_DATE || date > endDate) throw new Error('GA4 report date is outside the requested range.');
      }
      const key = includeDates ? `${date} ${path}` : path;
      if (typeof path !== 'string' || seen.has(key)) throw new Error('GA4 page path is invalid or repeated.');
      seen.add(key);
      const count = assertWholeNumber(row.metricValues?.[0]?.value);
      views.set(path, (views.get(path) ?? 0) + count);
      if (includeDates) dailyRows.push({ date, path, views: count });
    }
  }
  const calculatedTotal = [...views.values()].reduce((sum, n) => sum + n, 0);
  if (!Number.isSafeInteger(calculatedTotal) || calculatedTotal !== totalViews || seen.size !== totalRows) {
    throw new Error('GA4 report totals do not match all retrieved rows.');
  }
  return { views, totalRows, totalViews, timeZone, endDate, ...(includeDates ? { dailyRows } : {}) };
}

function yesterdayInTimeZone(timeZone, now) {
  if (!timeZone) return null;
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now).filter(part => part.type !== 'literal').map(part => [part.type, part.value]));
  const todayUtc = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day));
  return new Date(todayUtc - 86400000).toISOString().slice(0, 10);
}

export function buildFacilityViewData({ publishedPaths, report, propertyId, now = new Date() }) {
  const canonicalTotals = new Map();
  for (const [path, viewCount] of report.views) {
    const canonical = canonicalPagePath(path);
    if (!canonical) continue;
    canonicalTotals.set(canonical, (canonicalTotals.get(canonical) ?? 0) + viewCount);
  }
  const articles = {};
  let matched = 0;
  let matchedViews = 0;
  for (const path of publishedPaths) {
    const recorded = canonicalTotals.has(path);
    const views = canonicalTotals.get(path) ?? 0;
    articles[path] = { views, recorded };
    if (recorded) matched++;
    matchedViews += views;
  }
  if (!Number.isSafeInteger(matchedViews)) throw new Error('Article views exceed safe integer precision.');
  return {
    schemaVersion: 1,
    source: 'GA4 Data API',
    propertyId,
    scope: 'published-facility-articles',
    metric: 'screenPageViews',
    hosts: GA4_HOSTS,
    period: {
      startDate: GA4_START_DATE,
      endDate: report.endDate ?? yesterdayInTimeZone(report.timeZone, now),
      requestedEndDate: 'yesterday',
      timeZone: report.timeZone,
    },
    fetchedAt: now.toISOString(),
    articleCount: publishedPaths.length,
    recordedArticleCount: matched,
    totalArticleViews: matchedViews,
    articles,
  };
}


export function fetchDailyPageViews(options) {
  return fetchAllPageViews({ ...options, includeDates: true });
}

export function buildDailyFacilityViewData({ snapshot, report, metadata }) {
  if (!Array.isArray(report.dailyRows)) throw new Error('GA4 daily report is missing.');
  const dates = [];
  for (let at = Date.parse(snapshot.period.startDate); at <= Date.parse(snapshot.period.endDate); at += 86400000)
    dates.push(new Date(at).toISOString().slice(0, 10));
  if (!dates.length) throw new Error('GA4 daily date range is invalid.');
  const indices = new Map(dates.map((date, index) => [date, index]));
  const totals = dates.map(() => 0);
  const articles = Object.fromEntries(metadata.map(article => [article.path,
    dates.map(date => date < article.publishedAt ? null : 0)]));
  for (const row of report.dailyRows) {
    const path = canonicalPagePath(row.path);
    if (!Object.hasOwn(articles, path)) continue;
    const index = indices.get(row.date);
    if (index === undefined) throw new Error('GA4 daily date is outside the snapshot.');
    articles[path][index] = (articles[path][index] ?? 0) + row.views;
    totals[index] += row.views;
  }
  for (const [path, values] of Object.entries(articles)) {
    if (values.reduce((sum, value) => sum + (value ?? 0), 0) !== snapshot.articles[path].views)
      throw new Error('GA4 daily article total does not match cumulative views.');
  }
  if (totals.reduce((sum, value) => sum + value, 0) !== snapshot.totalArticleViews)
    throw new Error('GA4 daily total does not match cumulative views.');
  return { dates, totals, articles };
}
