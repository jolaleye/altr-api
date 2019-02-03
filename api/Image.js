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
    const outputFormat = this.options.format || path.extname(this.file.name).slice(1);
    const outputPath = path.join(path.dirname(this.file.path), `${shortid.generate()}.${outputFormat}`);
    const output = sharp(this.file.path);

    // convert format
    if (this.options.format) output.toFormat(this.options.format);

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
