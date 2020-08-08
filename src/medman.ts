import chalk from 'chalk';

import { readdirSync, statSync, renameSync } from 'fs';
import getUsage from './disk-usage';
import { Episode } from './episode';
import { validMediaExtensions } from './validMediaExtensions';

export type MedmanInterface = {
  name: string;
  directory: string;
  episodes: Episode[];
};

export type RenameObject = {
  oldNames: string[];
  newNames: string[];
  info: string;
};

export class Medman implements MedmanInterface {
  name: string;
  directory: string;
  files: string[];
  episodes: Episode[];

  constructor(directory: string, name?: string) {
    this.name = name || '';
    this.directory = directory;
    this.files = this.loadDirectory(directory);
    this.episodes = this.loadEpisodes(this.files);
  }

  public scan(): string[] {
    console.log(chalk.blue('Medman found the following episodes:'));
    this.episodes.forEach(e => {
      console.log(`\t${e.filename}`);
    });

    return this.episodes.map(e => e.filename);
  }

  public rename(previewMode = true): string[] {
    try {
      const toRename = this.episodes.filter(e => e.ident);
      const skipped = this.episodes.filter(e => !e.ident);
      const renamed = this.doRename(toRename, previewMode);

      if (previewMode) {
        console.log(chalk.red('---------- [ Previewing Rename ] ----------'));
      }

      console.log(chalk.green('Renamed episodes:'));
      console.log(renamed.info);

      if (skipped.length) {
        console.log(chalk.yellow('Skipped episodes'));
        skipped.forEach(s => console.log(`\t${s.filename}`));
      }

      return renamed.newNames;
    } catch (error) {
      console.log('Unable to rename due to error:');
      console.error(error);

      return [];
    }
  }

  private getExtension(filename: string): string {
    return filename.substring(filename.length - 4);
  }

  private isMedia(filename: string): boolean {
    return validMediaExtensions.includes(this.getExtension(filename));
  }

  private loadDirectory(dir: string): string[] {
    return readdirSync(dir).filter(name => {
      const file = `${dir}/${name}`;

      return statSync(file).isFile();
    });
  }

  private loadEpisodes(files: string[]) {
    return files
      .filter(file => this.isMedia(file))
      .map(file => new Episode(file));
  }

  private getPath(fileName: string): string {
    return this.directory + '/' + fileName;
  }

  private doRename(episodes: Episode[], previewMode: boolean): RenameObject {
    const result: RenameObject = {
      oldNames: episodes.map(e => e.filename),
      newNames: [],
      info: '',
    };

    episodes.forEach(e => {
      const oldPath = this.getPath(e.filename);
      const newName = e.generateNewName(this.name);
      const newPath = this.getPath(newName);

      if (!previewMode) renameSync(oldPath, newPath);
      // console.log(`\t${e.filename} -> ${newName}`); // Should we log here, or return as below?
      // result.push(`\t${e.filename} -> ${newName}`);
      result.newNames.push(newName);
    });

    result.info = result.oldNames
      .map((old, index) => `${old} -> ${result.newNames[index]}`)
      .join('\n');

    return result;
  }

  public static getUsage(all: boolean) {
    return getUsage(all);
  }
}

export default Medman;
