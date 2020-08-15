import { exec } from 'child_process';
import { promisify } from 'util';

const call = promisify(exec);

export const callCommand = async (command: string): Promise<any> => {
  try {
    const { stdout, stderr } = await call(command);

    if (stderr) console.warn(stderr);

    return stdout;
  } catch (error) {
    throw error;
  }
};
