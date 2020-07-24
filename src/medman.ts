import { EpisodeType } from './episode';

export type MedmanInterface = {
  name: string;
  directory: string;
  files: EpisodeType[];
};

export class Medman implements MedmanInterface {
  name: string;
  directory: string;
  files: EpisodeType[];

  constructor(directory: string, name: string) {
    this.name = name;
    this.directory = directory;
    this.files = [];
  }
}

export default Medman;
