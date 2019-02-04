const path = require('path');
const shortid = require('shortid');
const { exec } = require('child_process');
const { promisify } = require('util');

const _ = require('./config.json');

class Video {
  constructor(file, options) {
    this.file = file;
    this.options = options;
  }

  async process() {
    const outputFormat = this.options.format || path.extname(this.file.name).slice(1);
    const outputPath = path.join(path.dirname(this.file.path), `${shortid.generate()}.${outputFormat}`);

    let ffmpegOptions = '';

    if (this.options.width && this.options.height) {
      ffmpegOptions += `-s ${this.options.width}x${this.options.height} `;
    }

    await promisify(exec)(`ffmpeg -i ${this.file.path} ${ffmpegOptions} ${outputPath}`);

    return outputPath;
  }

  validate() {
    const errors = [];

    if (this.options.format && !_.formats.video.out.includes(this.options.format)) {
      errors.push('Invalid output format');
    }

    return errors;
  }
}

module.exports = Video;
