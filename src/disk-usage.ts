import { exec } from 'child_process';
import { promisify } from 'util';

const call = promisify(exec);
const command = 'df -h ./';

const main = async () => {
  try {
    const { stdout } = await call(command);

    const [diskName, size, used, available, capacity] = stdout
      .split('\n')[1]
      .split(' ')
      .filter(i => i.match(/./));

    return { diskName, size, used, available, capacity };
  } catch (error) {
    throw error;
  }
};

export default main;
