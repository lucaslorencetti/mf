import fs from 'fs';
import path from 'path';

/**
 * Read and parse a JSON file
 * @param filePath Path to the JSON file (relative to project root or absolute)
 * @returns Parsed JSON content or null if error
 */
export const readJsonFile = async <T>(filePath: string): Promise<T | null> => {
  try {
    // If path is not absolute, resolve it relative to project root
    const resolvedPath = path.isAbsolute(filePath)
      ? filePath
      : path.resolve(process.cwd(), filePath);

    const data = await fs.promises.readFile(resolvedPath, 'utf8');
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Error reading JSON file ${filePath}:`, error);
    return null;
  }
};
