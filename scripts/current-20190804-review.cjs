const fs = require('node:fs');
const review = JSON.parse(fs.readFileSync('docs/audits/2026-10-06-industrial-20190804-full-review/review.json'));
const links = JSON.parse(fs.readFileSync('docs/audits/2026-10-07-industrial-unassigned-links/review.json'));
module.exports = {
  chapters: rows => rows.map(row => ({ ...row, ...(review.chapters.find(later => later.path === row.path || later.url === row.url) || {}), ...(links.chapters.find(later => later.path === row.path || later.url === row.url) || {}) })),
  questionPayload: review.questionPayload,
};
