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
    const img = sharp(this.file.path);

    // resize
    if (this.options.width && this.options.height) {
      img.resize(parseInt(this.options.width), parseInt(this.options.height), { fit: 'fill' });
    }

    switch (outputFormat) {
      case 'jpeg':
      case 'jpg':
        await img
          .jpeg({
            quality: this.options.quality || 90
          })
          .toFile(outputPath);
        break;

      case 'tiff':
      case 'tif':
        await img
          .tiff({
            quality: this.options.quality || 90
          })
          .toFile(outputPath);
        break;

      case 'webp':
        await img
          .webp({
            quality: this.options.quality || 90
          })
          .toFile(outputPath);
        break;

      case 'png':
        await img
          .png({
            adaptiveFiltering: true
          })
          .toFile(outputPath);
        // OptiPNG compression
        if (this.options.compression) await promisify(exec)(`optipng -o${this.options.compression} ${outputPath}`);
        break;

      default:
        throw new Error('Invalid format');
    }

    return outputPath;
  }

  validate() {
    const errors = [];

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
