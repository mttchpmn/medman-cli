import chalk from 'chalk';

import { Episode } from './episode';
import { readdirSync, statSync, renameSync } from 'fs';
import { validMediaExtensions } from './validMediaExtensions';
import { performance } from 'perf_hooks';

export type MedmanInterface = {
  name: string;
  directory: string;
  episodes: Episode[];
};

export class Medman implements MedmanInterface {
  name: string;
  directory: string;
  files: string[];
  episodes: Episode[];

  constructor(directory: string, name: string) {
    this.name = name;
    this.directory = directory;
    this.files = this.loadDirectory(directory);
    this.episodes = this.loadEpisodes(this.files);
  }

  public scan(): void {
    console.log(chalk.blue('Medman found the following episodes:'));
    this.episodes.forEach(e => {
      console.log(`\t${e.filename}`);
    });
  }

  public rename(previewMode: boolean): void {
    try {
      const toRename = this.episodes.filter(e => e.ident);
      const skipped = this.episodes.filter(e => !e.ident);
      const renamed = this.doRename(toRename, previewMode);

      if (previewMode) {
        console.log(chalk.red('---------- [ Previewing Rename ] ----------'));
      }

      console.log(chalk.green('Renamed episodes:'));
      renamed.forEach(s => console.log(s));

      if (skipped.length) {
        console.log(chalk.yellow('Skipped episodes'));
        skipped.forEach(s => console.log(`\t${s.filename}`));
      }
    } catch (error) {
      console.log('Uable to rename due to error:');
      console.error(error);
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

  private doRename(episodes: Episode[], previewMode: boolean): string[] {
    const result: string[] = [];

    episodes.forEach(e => {
      const oldPath = this.getPath(e.filename);
      const newName = e.generateNewName(this.name);
      const newPath = this.getPath(newName);

      if (!previewMode) renameSync(oldPath, newPath);
      // console.log(`\t${e.filename} -> ${newName}`); // Should we log here, or return as below?
      result.push(`\t${e.filename} -> ${newName}`);
    });

    return result;
  }
}

export default Medman;
