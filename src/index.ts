#! /usr/bin/env node

import { program } from 'commander';

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
  .command('rename <name> <directory>')
  .description('Scan a directory for episodes')
  .option('-p, --preview', 'Preview rename')
  .action((name, directory, opts) => {
    const medman = new Medman(directory, name);
    medman.rename(opts.preview);
  });

program.parse(process.argv);
