import fs from 'fs';
import path from 'path';

import { logError } from './errorUtils';

export const readJsonFile = async <T>(filePath: string): Promise<T | null> => {
  try {
    const resolvedPath = path.isAbsolute(filePath)
      ? filePath
      : path.resolve(process.cwd(), filePath);

    const data = await fs.promises.readFile(resolvedPath, 'utf8');
    return JSON.parse(data) as T;
  } catch (error) {
    logError(`Error in fileUtils - readJsonFile(${filePath}):`, error);
    return null;
  }
};
