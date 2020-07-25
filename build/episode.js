"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Episode = void 0;
var Episode = /** @class */ (function () {
    function Episode(filename) {
        this.getIdent = function (f) {
            var regex = /([Ss]?(?<season>\d{1,2}).[Ee]?(?<episode>\d{1,2}))/;
            var matches = f.match(regex);
            if (!matches)
                return null;
            var groups = matches.groups;
            var _a = groups, season = _a.season, episode = _a.episode;
            season = season.length > 1 ? season : "0" + season;
            episode = episode.length > 1 ? episode : "0" + episode;
            return { season: season, episode: episode };
        };
        this._filename = filename;
    }
    Object.defineProperty(Episode.prototype, "filename", {
        get: function () {
            return this._filename;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Episode.prototype, "ext", {
        get: function () {
            return this.filename.substring(this._filename.length - 4);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Episode.prototype, "ident", {
        get: function () {
            return this.getIdent(this._filename);
        },
        enumerable: false,
        configurable: true
    });
    Episode.prototype.generateNewName = function (seasonName) {
        if (!this.ident)
            throw new Error('Episode not valid for rename');
        var _a = this.ident, s = _a.season, e = _a.episode;
        return seasonName + " - S" + s + "E" + e + this.ext;
    };
    return Episode;
}());
exports.Episode = Episode;
