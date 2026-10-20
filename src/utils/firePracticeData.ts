import questionTable from '../../docs/drafts/fire-level2-mock-exam/question-table.json';
import { getPublishedFireQuestions } from './firePractice';

// Build-time only. The browser receives this approved projection, never the draft table.
export const publishedFireQuestions = getPublishedFireQuestions(questionTable);
