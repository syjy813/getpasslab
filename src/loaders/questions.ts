import { existsSync, promises as fs } from 'node:fs';
import { basename, dirname, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Loader, LoaderContext } from 'astro/loaders';

const QUESTIONS_DIRECTORY = './src/data/questions/';

type RawQuestion = Record<string, unknown> & {
  id?: unknown;
  cert_id?: unknown;
  exam?: unknown;
};

export function questionFiles(): Loader {
  async function syncQuestions(context: LoaderContext, directoryPath: string) {
    const { config, generateDigest, logger, parseData, store } = context;
    const fileNames = (await fs.readdir(directoryPath))
      .filter(fileName => extname(fileName).toLowerCase() === '.json')
      .sort();

    if (fileNames.length === 0) {
      throw new Error(`No question data files found in ${QUESTIONS_DIRECTORY}`);
    }

    store.clear();
    const seenEntryIds = new Set<string>();
    let loadedCount = 0;

    for (const fileName of fileNames) {
      const filePath = new URL(fileName, new URL(QUESTIONS_DIRECTORY, config.root));
      const contents = await fs.readFile(filePath, 'utf8');
      const parsed = JSON.parse(contents) as unknown;

      if (!Array.isArray(parsed)) {
        throw new Error(`${fileName} must contain an array of question objects.`);
      }

      const fileCertificationId = basename(fileName, extname(fileName));
      const normalizedFilePath = relative(
        fileURLToPath(config.root),
        fileURLToPath(filePath),
      ).replaceAll('\\', '/');

      for (const value of parsed) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
          throw new Error(`${fileName} contains a non-object question entry.`);
        }

        const rawQuestion = value as RawQuestion;
        const questionId = typeof rawQuestion.id === 'string' ? rawQuestion.id : '';
        if (!questionId) {
          throw new Error(`${fileName} contains a question without an id.`);
        }

        if (
          rawQuestion.cert_id !== undefined
          && rawQuestion.cert_id !== fileCertificationId
        ) {
          throw new Error(
            `${fileName} contains ${questionId} with cert_id "${String(rawQuestion.cert_id)}". `
            + `Expected "${fileCertificationId}" from the file name.`,
          );
        }

        const normalizedQuestion = {
          ...rawQuestion,
          cert_id: fileCertificationId,
          exam: rawQuestion.exam ?? 'written',
        };
        const entryId = `${fileCertificationId}:${String(normalizedQuestion.exam)}:${questionId}`;
        if (seenEntryIds.has(entryId)) {
          throw new Error(`Duplicate question id "${questionId}" in ${entryId}.`);
        }
        seenEntryIds.add(entryId);

        const data = await parseData({
          id: entryId,
          data: normalizedQuestion,
          filePath: fileURLToPath(filePath),
        });

        store.set({
          id: entryId,
          data,
          filePath: normalizedFilePath,
          digest: generateDigest(JSON.stringify(normalizedQuestion)),
        });
        loadedCount += 1;
      }
    }

    logger.debug(`Loaded ${loadedCount} questions from ${fileNames.length} certification files.`);
  }

  return {
    name: 'getpasslab-question-files',
    load: async (context) => {
      const directoryUrl = new URL(QUESTIONS_DIRECTORY, context.config.root);
      if (!existsSync(directoryUrl)) {
        throw new Error(`Question data directory not found: ${QUESTIONS_DIRECTORY}`);
      }

      const directoryPath = fileURLToPath(directoryUrl);
      await syncQuestions(context, directoryPath);

      const reload = async (changedPath: string) => {
        if (
          dirname(changedPath) !== directoryPath
          || extname(changedPath).toLowerCase() !== '.json'
        ) return;

        context.logger.info(`Reloading question data after ${basename(changedPath)} changed.`);
        await syncQuestions(context, directoryPath);
      };

      context.watcher?.add(directoryPath);
      context.watcher?.on('add', reload);
      context.watcher?.on('change', reload);
      context.watcher?.on('unlink', reload);
    },
  };
}
