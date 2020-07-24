import { validMediaExtensions } from './validMediaExtensions';

export type EpisodeType = {
  filename: string;
  extension: string;
  isMedia: boolean;
  ident: Ident | null;
  newName: (name: string) => string;
};

type Ident = {
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

  get extension(): string {
    return this.getExt(this._filename);
  }

  get isMedia(): boolean {
    return this.checkIfMedia(this.extension);
  }

  get ident(): Ident | null {
    return this.getIdent(this._filename);
  }

  public newName(name: string): string {
    if (!this.isMedia || !this.ident) {
      throw new Error('File not valid for rename');
    }

    const { season, episode } = this.ident;

    return `${name} - S${season}E${episode}${this.extension}`;
  }

  private getExt(f: string): string {
    return f.substring(f.length - 4);
  }

  private checkIfMedia(ext: string): boolean {
    return validMediaExtensions.includes(ext);
  }

  public getIdent = (f: string): Ident | null => {
    const regex = /([Ss]?(?<season>\d{1,2}).[Ee]?(?<episode>\d{1,2}))/;
    const matches: RegExpMatchArray | null = f.match(regex);

    if (!matches) return null;

    const groups = (matches as RegExpMatchArray).groups;
    const { season, episode }: Ident = groups as Ident;

    return { season, episode };
  };
}
