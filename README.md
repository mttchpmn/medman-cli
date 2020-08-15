# MedMan

A CLI Media Manager to make maintaining a remote media server a breeze.

## Overview

- Hate getting a folder full of TV episodes from your mate but your Plex server won't detect them 'cause they're all named weird?
- Hate not being able to export your movie library metadata out of Plex?
- Want to know how much disk space your massive library of ~~porn~~ movies occupies?
- Unable to use a normal file browser because your server is remote and only accessible via SSH?

MedMan to the rescue!

MedMan is a command line tool to make managing your remote movie server a breeze. Supporting features like media scanning, disk usage analysis, renaming of pesky episode formats, and querying and exporting library metadata, MedMan should be the number 1 tool of any Plex admin.

## Installation

1. Make sure Node and NPM are installed on your system.
   - You can follow the installation instructions [here](https://nodejs.org/en/download/package-manager/#macos)
2. Install Medman globally.
   - In your terminal , run `npm install --global medman`
3. MedMan should now be installed to your path.
   - In your terminal you can now run `medman [command...]`

## Usage

### Scan

Scans a given directory for valid media files, and displays the media found.

```shell
medman scan <directory>
```

Example Output:

```shell
medman scan ./downloads

Episodes found:
-----------------------------
Cool Show Season 01 - Episode 04.mp4
CoolShow.1.2.avi
CoolShow.1x5.avi
CoolShow.S1E3.mkv
CoolShow.s01.e01.mkv
foo.avi
bar.mkv
baz.mp4
```

---

### Rename (TV Series)

Scans a given directory for media files, extracts the Season and Episode identifier (e.g. S01 E03), and renames file to match format expected by Plex (e.g Showname - S01E03.mp4) using the Show Name provided. Any files that are non-media or do not have a valid identifier will be skipped.

- The `--preview` or `-p` modifier can be used to preview the rename action without actually renaming files

```shell
medman rename <show-name> <directory>
```

Example output:

```shell
medman rename "Cool Show" ./downloads

Renamed episodes:
-----------------------------
CoolShow.s01.e01.mkv -> Cool Show - S01E01.mkv
CoolShow.1.2.avi -> Cool Show - S01E02.avi
CoolShow.S1E3.mkv -> Cool Show - S01E03.mkv
Cool Show Season 01 - Episode 04.mp4 -> Cool Show - S01E04.mp4
CoolShow.1x5.avi -> Cool Show - S01E05.avi
Skipped episodes
	foo.avi
	bar.mkv
	baz.mp4


```

---

### Query

[Coming soon!]

Querys a directory of media files, scanning the media metadata of each file, and writing the output to `json` and `csv`.
