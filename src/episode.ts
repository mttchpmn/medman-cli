import { validMediaExtensions } from './validMediaExtensions';

export type Ident = {
  season: string;
  episode: string;
};

export class Episode {
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
    const short = /([Ss]?(?<season>\d{1,2}).[Ee]?(?<episode>\d{1,2}))/;
    const long = /([Ss]eason (?<season>\d{1,2})(.{1,3})[Ee]pisode (?<episode>\d{1,2}))/;
    const matches: RegExpMatchArray | null = f.match(short) || f.match(long);

    if (!matches) return null;

    const groups = (matches as RegExpMatchArray).groups;
    let { season, episode }: Ident = groups as Ident;

    season = season.length > 1 ? season : `0${season}`;
    episode = episode.length > 1 ? episode : `0${episode}`;

    return { season, episode };
  };

  public generateNewName(seasonName: string): string {
    if (!this.ident) throw new Error('Episode not valid for rename');

    const { season: s, episode: e } = this.ident;

    return `${seasonName} - S${s}E${e}${this.ext}`;
  }
}
