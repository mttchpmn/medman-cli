#! /usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';

import Medman from './medman';

const title = (title: string) => {
  console.log(chalk.bold.white(title));
  console.log(chalk.bold.white('-----------------------------'));
};

program.version('1.0.0');

program
  .command('scan <directory>')
  .description('Scan a directory for episodes')
  .action(directory => {
    const medman = new Medman(directory);
    const episodes = medman.scan();

    title(episodes.length ? 'Episodes found:' : 'No episodes found.');
    episodes.forEach(e => console.log(chalk.cyan(`${e}`)));
  });

program
  .command('usage')
  .description('Show the disk usage on current disk')
  .option('-a, --all', 'Show usage for all disks')
  .action(async ({ all }) => {
    try {
      const disks = await Medman.getUsage(all);

      disks.forEach(disk => {
        const { diskName, size, used, available, capacity } = disk;

        title(`Disk Usage on:\t${diskName}`);
        console.log(chalk.cyan(`\tSize:\t\t${size}`));
        console.log(chalk.cyan(`\tAvailable:\t${chalk.green(available)}`));
        console.log(chalk.cyan(`\tUsed:\t\t${chalk.yellow(used)}`));
        console.log(chalk.cyan(`\tCapacity:\t${capacity}`));
      });
    } catch (error) {
      console.error(
        chalk.bold.red(`Error reading disk usage:\n${chalk.white(error)}`)
      );
    }
  });

program
  .command('rename <name> <directory>')
  .description('Rename episodes to match standard format')
  .option('-p, --preview', 'Preview rename')
  .action((name, directory, { preview }) => {
    try {
      const medman = new Medman(directory, name);
      const { oldNames, newNames, skipped } = medman.rename(preview);

      title(preview ? 'Preview of rename:' : 'Renamed episodes:');

      if (newNames && newNames.length) {
        oldNames.forEach((n, index) => {
          const str = `${chalk.cyan(n)} ${chalk.white('->')} ${chalk.green(
            newNames[index]
          )}`;
          console.log(str);
        });
      }

      if (skipped && skipped.length) {
        console.log(chalk.bold.white('Skipped episodes'));
        skipped.forEach(s => console.log(`\t${s}`));
      }
    } catch (error) {
      console.error(
        chalk.bold.red('Error renaming files:\n', chalk.white(error))
      );
    }
  });

program.parse(process.argv);
