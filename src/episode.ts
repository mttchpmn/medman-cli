import { validMediaExtensions } from './validMediaExtensions';

export type EpisodeType = {
  filename: string;
  ident: Ident | null;
};

export type Ident = {
  season: string;
  episode: string;
};

export class Episode implements EpisodeType {
  private _filename: string;

  constructor(filename: string) {
    this._filename = filename;
  }

  get filename(): string {
    return this._filename;
  }

  get ext(): string {
    return this.filename.substring(this._filename.length - 4);
  }

  get ident(): Ident | null {
    return this.getIdent(this._filename);
  }

  public getIdent = (f: string): Ident | null => {
    const regex = /([Ss]?(?<season>\d{1,2}).[Ee]?(?<episode>\d{1,2}))/;
    const matches: RegExpMatchArray | null = f.match(regex);

    if (!matches) return null;

    const groups = (matches as RegExpMatchArray).groups;
    const { season, episode }: Ident = groups as Ident;

    return { season, episode };
  };

  public generateNewName(seasonName: string): string {
    if (!this.ident) throw new Error('Episode not valid for rename');

    const { season: s, episode: e } = this.ident;

    return `${seasonName} - S${s}E${e}${this.ext}`;
  }
}
