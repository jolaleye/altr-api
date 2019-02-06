const path = require('path');
const shortid = require('shortid');
const { exec } = require('child_process');
const { promisify } = require('util');

const makeAudio = async (file, options) => {
  const toFormat = options.format || path.extname(file.name).slice(1);
  const toPath = path.resolve('uploads', `${shortid.generate()}.${toFormat}`);

  let inputOpts = ``;
  let outputOpts = ``;

  if (options.start && options.end) {
    inputOpts += `-ss ${options.start}`;
    outputOpts += `-t ${options.end - options.start}`;
  }

  await promisify(exec)(`ffmpeg ${inputOpts} -i ${file.path} ${outputOpts} ${toPath}`);
  return toPath;
};

module.exports = makeAudio;
