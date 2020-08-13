import { exec } from 'child_process';
import { promisify } from 'util';
import { promises as fs } from 'fs';
import path from 'path';

const call = promisify(exec);

export const getMockOutput = async (filename: string): Promise<string> => {
  try {
    const output = await fs.readFile(path.join(__dirname, '/mock/', filename), {
      encoding: 'utf8',
    });

    return output;
  } catch (error) {
    throw error;
  }
};

export const callMedman = async (options: string): Promise<string> => {
  try {
    const command = `ts-node ./src/index.ts ${options}`;
    const { stdout, stderr } = await call(command);

    if (stderr) console.warn(stderr);

    return stdout;
  } catch (error) {
    throw error;
  }
};
