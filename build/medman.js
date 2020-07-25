"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Medman = void 0;
var chalk_1 = __importDefault(require("chalk"));
var episode_1 = require("./episode");
var fs_1 = require("fs");
var validMediaExtensions_1 = require("./validMediaExtensions");
var Medman = /** @class */ (function () {
    function Medman(directory, name) {
        this.name = name;
        this.directory = directory;
        this.files = this.loadDirectory(directory);
        this.episodes = this.loadEpisodes(this.files);
    }
    Medman.prototype.scan = function () {
        console.log(chalk_1.default.blue('Medman found the following episodes:'));
        this.episodes.forEach(function (e) {
            console.log("\t" + e.filename);
        });
    };
    Medman.prototype.rename = function (previewMode) {
        try {
            var toRename = this.episodes.filter(function (e) { return e.ident; });
            var skipped = this.episodes.filter(function (e) { return !e.ident; });
            var renamed = this.doRename(toRename, previewMode);
            if (previewMode) {
                console.log(chalk_1.default.red('---------- [ Previewing Rename ] ----------'));
            }
            console.log(chalk_1.default.green('Renamed episodes:'));
            renamed.forEach(function (s) { return console.log(s); });
            if (skipped.length) {
                console.log(chalk_1.default.yellow('Skipped episodes'));
                skipped.forEach(function (s) { return console.log("\t" + s.filename); });
            }
        }
        catch (error) {
            console.log('Uable to rename due to error:');
            console.error(error);
        }
    };
    Medman.prototype.getExtension = function (filename) {
        return filename.substring(filename.length - 4);
    };
    Medman.prototype.isMedia = function (filename) {
        return validMediaExtensions_1.validMediaExtensions.includes(this.getExtension(filename));
    };
    Medman.prototype.loadDirectory = function (dir) {
        return fs_1.readdirSync(dir).filter(function (name) {
            var file = dir + "/" + name;
            return fs_1.statSync(file).isFile();
        });
    };
    Medman.prototype.loadEpisodes = function (files) {
        var _this = this;
        return files
            .filter(function (file) { return _this.isMedia(file); })
            .map(function (file) { return new episode_1.Episode(file); });
    };
    Medman.prototype.getPath = function (fileName) {
        return this.directory + '/' + fileName;
    };
    Medman.prototype.doRename = function (episodes, previewMode) {
        var _this = this;
        var result = [];
        episodes.forEach(function (e) {
            var oldPath = _this.getPath(e.filename);
            var newName = e.generateNewName(_this.name);
            var newPath = _this.getPath(newName);
            if (!previewMode)
                fs_1.renameSync(oldPath, newPath);
            // console.log(`\t${e.filename} -> ${newName}`); // Should we log here, or return as below?
            result.push("\t" + e.filename + " -> " + newName);
        });
        return result;
    };
    return Medman;
}());
exports.Medman = Medman;
exports.default = Medman;
