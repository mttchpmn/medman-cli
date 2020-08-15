import sinon, { SinonStub } from 'sinon';

import getDiskUsage from './disk-usage';
import * as command from '../util/command';

const currentDiskOutput = `Filesystem     Size   Used  Avail Capacity iused      ifree %iused  Mounted on
/dev/disk1s2  466Gi  121Gi  326Gi    28% 1741349 4880711531    0%   /System/Volumes/Data
`;
const allDisksOutput = `Filesystem      Size   Used  Avail Capacity iused      ifree %iused  Mounted on
/dev/disk1s1   466Gi   10Gi  326Gi     4%  488388 4881964492    0%   /
devfs          197Ki  197Ki    0Bi   100%     682          0  100%   /dev
/dev/disk1s2   466Gi  121Gi  326Gi    28% 1741407 4880711473    0%   /System/Volumes/Data
/dev/disk1s5   466Gi  7.1Gi  326Gi     3%       7 4882452873    0%   /private/var/vm
map auto_home    0Bi    0Bi    0Bi   100%       0          0  100%   /System/Volumes/Data/home`;

describe('UNIT TEST: Disk Usage', () => {
  let diskUsageStub: SinonStub;

  beforeAll(() => {
    diskUsageStub = sinon.stub(command, 'callCommand');

    diskUsageStub
      .withArgs('df -h ./')
      .returns(Promise.resolve(currentDiskOutput));

    diskUsageStub.withArgs('df -h').returns(Promise.resolve(allDisksOutput));
  }, 500);

  afterAll(() => {
    diskUsageStub.restore();
  }, 500);

  it('Should return the disk output correctly for current disk', async () => {
    const result = await getDiskUsage();
    const expectedOutput = [
      {
        diskName: '/dev/disk1s2',
        size: '466Gi',
        used: '121Gi',
        available: '326Gi',
        capacity: '28%',
      },
    ];

    expect(result).toEqual(expectedOutput);
  });

  it('Should return the disk output correctly for all disks', async () => {
    const result = await getDiskUsage(true);
    const expectedOutput = [
      {
        diskName: '/dev/disk1s1',
        size: '466Gi',
        used: '10Gi',
        available: '326Gi',
        capacity: '4%',
      },
      {
        diskName: 'devfs',
        size: '197Ki',
        used: '197Ki',
        available: '0Bi',
        capacity: '100%',
      },
      {
        diskName: '/dev/disk1s2',
        size: '466Gi',
        used: '121Gi',
        available: '326Gi',
        capacity: '28%',
      },
      {
        diskName: '/dev/disk1s5',
        size: '466Gi',
        used: '7.1Gi',
        available: '326Gi',
        capacity: '3%',
      },
      {
        diskName: 'map',
        size: 'auto_home',
        used: '0Bi',
        available: '0Bi',
        capacity: '0Bi',
      },
    ];

    expect(result).toEqual(expectedOutput);
  });
});
