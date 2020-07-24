import { EpisodeType, Episode } from './episode';
import { readdirSync, statSync, renameSync } from 'fs';

export type MedmanInterface = {
  name: string;
  directory: string;
  episodes: EpisodeType[];
};

export class Medman implements MedmanInterface {
  name: string;
  directory: string;
  files: string[];
  episodes: EpisodeType[];

  constructor(directory: string, name: string) {
    this.name = name;
    this.directory = directory;
    this.files = this.loadDirectory(directory);
    this.episodes = this.loadEpisodes(this.files);
  }

  public scan(): void {
    console.log('Medman found the following media files:');
    this.episodes.forEach(e => {
      if (e.isMedia) console.log(`\t${e.filename}`);
    });
  }

  public rename() {
    this.episodes.forEach(e => {
      const oldPath = `${this.directory}/${e.filename}`;

      if (!e.isMedia) {
        console.log(`\tSkipped ${e.filename} as it is not media.`);
        return;
      }

      if (!e.ident) {
        console.log(
          `\tSkipped ${e.filename} as a valid identifier could not be found.`
        );
        return;
      }
      const newName = e.newName(this.name);
      const newPath = `${this.directory}/${newName}`;

      // renameSync(oldPath, newPath);
      console.log(`\t${e.filename} -> ${newName}`);
    });
  }

  private loadDirectory(dir: string): string[] {
    return readdirSync(dir).filter(name => {
      const file = `${dir}/${name}`;

      return statSync(file).isFile();
    });
  }

  private loadEpisodes(files: string[]) {
    return files.map(file => new Episode(file));
  }
}

export default Medman;

///////////////////////////////////////////////////////////////////////

const test = new Medman('./test', 'Wakaman');

test.scan();
test.rename();
