const path = require('path');
const sharp = require('sharp');
const shortid = require('shortid');
const { exec } = require('child_process');
const { promisify } = require('util');

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

    // resize
    if (this.options.width && this.options.height) {
      output.resize(parseInt(this.options.width), parseInt(this.options.height), { fit: 'fill' });
    }

    if (outputFormat === 'jpeg' || outputFormat === 'jpg') {
      output.jpeg({
        quality: parseInt(this.options.quality) || 90 // adjust quality (default 90)
      });

      await output.toFile(outputPath);
      return outputPath;
    }

    if (outputFormat === 'png') {
      output.png({ adaptiveFiltering: true });
      await output.toFile(outputPath);

      // compress output
      if (this.options.compression) {
        await promisify(exec)(`optipng -o${this.options.compression} ${outputPath}`);
      }

      return outputPath;
    }
  }

  validate() {
    const errors = [];

    if (this.options.format && !_.formats.image.out.includes(this.options.format)) {
      errors.push('Invalid output format');
    }
    if (this.options.quality && (this.options.quality < 1 || this.options.quality > 100)) {
      errors.push('Quality must be 1-100');
    }
    if (this.options.compression && (this.options.compression < 0 || this.options.compression > 7)) {
      errors.push('Compression level must be 0-7');
    }

    return errors;
  }
}

module.exports = Image;
