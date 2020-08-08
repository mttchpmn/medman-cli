#! /usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';

import Medman from './medman';

program.version('1.0.0');

program
  .command('scan <directory>')
  .description('Scan a directory for episodes')
  .action(directory => {
    const medman = new Medman(directory);
    medman.scan();
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

        console.log(chalk.white.bold(`Disk Usage on:\t${diskName}`));
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
  .description('Scan a directory for episodes')
  .option('-p, --preview', 'Preview rename')
  .action((name, directory, opts) => {
    const medman = new Medman(directory, name);
    medman.rename(opts.preview);
  });

program.parse(process.argv);
