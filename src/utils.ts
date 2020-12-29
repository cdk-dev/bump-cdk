import { promises as fs, constants } from 'fs';
import * as chalk from 'chalk';

/**
 *
 * @param message
 */
export const error = (message: string) => {
  console.log(chalk.red(message));
};

/**
 *
 * @param path
 */
export const fileExists = async (path: string): Promise<boolean> => {
  try {
    await fs.access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
};
