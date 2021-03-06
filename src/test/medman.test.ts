import { promises as fs } from 'fs';

import { Medman } from '../medman';
import { getMockOutput, callMedman } from './utils';

beforeEach(async () => {
  const initialFiles = [
    'CoolShow.s01.e01.mkv',
    'CoolShow.1.2.avi',
    'CoolShow.S1E3.mkv',
    'Cool Show Season 01 - Episode 04.mp4',
    'CoolShow.1x5.avi',
    'notAFilm.txt',
    'alsoNotAFilm.csv',
    'stillNotAFilm.doc',
    'noIdent.avi',
    'noIdent.mkv',
    'noIdent.mp4',
  ];
  await fs.mkdir('./testDir');
  for await (const f of initialFiles) {
    await fs.writeFile(`./testDir/${f}`, 'test');
  }
}, 5000);

afterEach(async () => {
  await fs.rmdir('./testDir', { recursive: true });
}, 5000);

describe('Testing Medman', () => {
  describe('Scan function', () => {
    it('Should find media files in folder correctly', async () => {
      const medman = new Medman('./testDir');
      const expectedOutput = [
        'Cool Show Season 01 - Episode 04.mp4',
        'CoolShow.1.2.avi',
        'CoolShow.1x5.avi',
        'CoolShow.S1E3.mkv',
        'CoolShow.s01.e01.mkv',
        'noIdent.avi',
        'noIdent.mkv',
        'noIdent.mp4',
      ];
      const result = medman.scan();

      expect(result).toEqual(expectedOutput);
    });

    // it('Should output the correct information to stdout', async () => {
    //   const output = await callMedman('scan ./testDir');
    //   const expectedOutput = await getMockOutput('scan.txt');

    //   expect(output).toEqual(expectedOutput);
    // });
  });

  describe('Rename function', () => {
    it('Should rename media files correctly', async () => {
      const medman = new Medman('./testDir', 'Cool Show');
      const newNames = [
        'Cool Show - S01E01.mkv',
        'Cool Show - S01E02.avi',
        'Cool Show - S01E03.mkv',
        'Cool Show - S01E04.mp4',
        'Cool Show - S01E05.avi',
      ];
      const skipped = ['noIdent.avi', 'noIdent.mkv', 'noIdent.mp4'];
      const result = medman.rename();

      expect(result).toHaveProperty(
        'newNames',
        expect.arrayContaining(newNames)
      );
      expect(result).toHaveProperty('skipped', expect.arrayContaining(skipped));
    });

    // it('Should output correct information to stdout', async () => {
    //   const output = await callMedman('rename "Cool Show" ./testDir');
    //   const expectedOutput = await getMockOutput('rename.txt');

    //   expect(output).toEqual(expectedOutput);
    // });
  });
});
