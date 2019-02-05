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
        await this.toJPG(img, {
          quality: parseInt(this.options.quality)
        }).toFile(outputPath);
        break;

      case 'tiff':
      case 'tif':
        await this.toTIFF(img, {
          quality: parseInt(this.options.quality)
        }).toFile(outputPath);
        break;

      case 'webp':
        await this.toWEBP(img, {
          quality: parseInt(this.options.quality)
        }).toFile(outputPath);
        break;

      case 'png':
        await this.toPNG(img, {}).toFile(outputPath);
        if (this.options.compression) {
          await promisify(exec)(`optipng -o${this.options.compression} ${outputPath}`);
        }
        break;

      default:
        throw new Error('Invalid format');
    }

    return outputPath;
  }

  toJPG(img, { quality = 90 }) {
    return img.jpeg({ quality });
  }

  toTIFF(img, { quality = 90 }) {
    return img.tiff({ quality });
  }

  toWEBP(img, { quality = 90 }) {
    return img.webp({ quality });
  }

  toPNG(img, {}) {
    return img.png({ adaptiveFiltering: true });
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
