const path = require('path');

const _ = require('./config.json');

class Video {
  constructor(file, options) {
    this.file = file;
    this.options = options;
  }

  async process() {
    const outputFormat = this.options.format || path.extname(this.file.name).slice(1);
    return this.file.path;
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
