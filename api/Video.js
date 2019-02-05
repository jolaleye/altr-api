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

    let inputOpts = '';
    let outputOpts = '';

    if (this.options.width && this.options.height) {
      outputOpts += `-s ${this.options.width}x${this.options.height} `;
    }
    if (this.options.start && this.options.end) {
      inputOpts += `-ss ${this.options.start}`;
      outputOpts += `-t ${this.options.end - this.options.start}`;
    }

    await promisify(exec)(`ffmpeg ${inputOpts} -i ${this.file.path} ${outputOpts} ${outputPath}`);

    return outputPath;
  }

  validate() {
    const errors = [];

    return errors;
  }
}

module.exports = Video;
