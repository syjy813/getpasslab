import { mkdir, rename, unlink, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { buildFacilityViewData, fetchAllPageViews, publishedFacilityArticles } from './lib/facility-page-views.mjs';

const root = resolve(import.meta.dirname, '..');
const outputPath = resolve(root, 'src/data/facility-page-views.json');
const propertyId = process.env.GA4_PROPERTY_ID;
const token = process.env.GA4_ACCESS_TOKEN;

try {
  const metadata = await publishedFacilityArticles(resolve(root, 'src/content/facility'));
  const publishedPaths = metadata.map(a => a.path);
  const report = await fetchAllPageViews({ propertyId, token });
  const snapshot = buildFacilityViewData({ publishedPaths, report, propertyId });
  if (snapshot.recordedArticleCount === 0) {
    throw new Error('GA4 has no matched published facility articles; preserving previous snapshot.');
  }
  for (const { path, ...info } of metadata) Object.assign(snapshot.articles[path], info);
  snapshot.collectionSchedule = { timeZone: 'Asia/Seoul', hour: 9, minute: 0 };
  snapshot.sourceCommit = process.env.GITHUB_SHA || null;
  const nextContent = `${JSON.stringify(snapshot, null, 2)}\n`;
  // Check validity before touching the existing file; incomplete API reports never overwrite it.
  await mkdir(dirname(outputPath), { recursive: true });
  const temporaryPath = `${outputPath}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporaryPath, nextContent, { flag: 'wx' });
    await rename(temporaryPath, outputPath);
  } catch (error) {
    await unlink(temporaryPath).catch(() => {});
    throw error;
  }
  console.log(`GA4 page-view snapshot: PASS (${snapshot.recordedArticleCount}/${snapshot.articleCount} published articles; ${snapshot.totalArticleViews} views).`);
  console.log('Snapshot replaced with a full cumulative report; no raw URL rows or tokens logged.');
} catch (error) {
  // Report errors and invalid data are deliberately generic; never log token or raw GA4 response.
  console.error(error instanceof Error && /^GA4 |^Article views|^Facility |^Published/.test(error.message)
    ? error.message : 'GA4 ingestion failed; previous snapshot retained.');
  process.exitCode = 1;
}
