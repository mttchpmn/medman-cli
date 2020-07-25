#! /usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var medman_1 = __importDefault(require("./medman"));
commander_1.program.version('1.0.0');
commander_1.program
    .command('scan <directory>')
    .description('Scan a directory for episodes')
    .action(function (directory) {
    var medman = new medman_1.default(directory, '');
    medman.scan();
});
commander_1.program
    .command('rename <name> <directory>')
    .description('Scan a directory for episodes')
    .option('-p, --preview', 'Preview rename')
    .action(function (name, directory, opts) {
    var medman = new medman_1.default(directory, name);
    medman.rename(opts.preview);
});
commander_1.program.parse(process.argv);
