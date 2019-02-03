const path = require('path');
const sharp = require('sharp');
const shortid = require('shortid');

const _ = require('./config.json');

class Image {
  constructor(file, options) {
    this.file = file;
    this.options = options;
  }

  async process() {
    const output = sharp(this.file.path);

    const outputPath = path.join(path.dirname(this.file.path), `${shortid.generate()}${path.extname(this.file.name)}`);
    await output.toFile(outputPath);
    return outputPath;
  }

  validate() {
    const errors = [];

    if (this.options.format && !_.formats.image.out.includes(this.options.format)) errors.push('Invalid output format');
    if (!this.options.width || !this.options.height) errors.push('Missing image dimensions');

    return errors;
  }
}

module.exports = Image;
