import { exec } from 'child_process';
import { promisify } from 'util';

const call = promisify(exec);

export type DiskObject = {
  diskName: string;
  size: string;
  used: string;
  available: string;
  capacity: string;
};

const main = async (all = false): Promise<DiskObject[]> => {
  const command = all ? 'df -h' : 'df -h ./';

  try {
    const { stdout } = await call(command);

    // Split by lines and remove empty results
    const [header, ...data] = stdout.split('\n').filter(i => i.match(/./));

    const parseData = (row: string): DiskObject => {
      // Split by whitespace and remove empty items
      const [diskName, size, used, available, capacity] = row
        .split(' ')
        .filter(i => i.match(/./));

      return { diskName, size, used, available, capacity };
    };

    return data.map(parseData);
  } catch (error) {
    throw error;
  }
};

export default main;
