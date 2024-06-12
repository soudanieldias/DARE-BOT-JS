const { globSync } = require('glob');

module.exports = class MemeFinder {
  constructor(directory) {
    this.directory = directory;
    this.memeFiles = this._findMemes();
  }

  _findMemes() {
    const memeFiles = './src/memes/**/*.{jpg,mp4,png,gif}';
    return globSync(memeFiles);
  }

  getRandomMeme() {
    if (this.memeFiles.length === 0) {
      throw new Error('No memes found in the specified directory.');
    }
    const randomIndex = Math.floor(Math.random() * this.memeFiles.length);
    return this.memeFiles[randomIndex];
  }
}
