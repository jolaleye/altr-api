const path = require('path');
const sharp = require('sharp');
const shortid = require('shortid');
const { exec } = require('child_process');
const { promisify } = require('util');

const makeImage = async (file, options) => {
  const toFormat = options.format || path.extname(file.name).slice(1);
  const toPath = path.resolve('uploads', `${shortid.generate()}.${toFormat}`);
  const image = sharp(file.path);

  // resize
  if (options.width && options.height) {
    image.resize({
      width: options.width,
      height: options.height,
      fit: 'fill'
    });
  }

  // JPG
  if (toFormat === 'jpeg' || toFormat === 'jpg') {
    image.jpeg({
      quality: options.quality || 90
    });
    await image.toFile(toPath);
  }

  // PNG
  if (toFormat === 'png') {
    image.png({
      adaptiveFiltering: true
    });
    await image.toFile(toPath);

    // OptiPNG
    if (options.compression) await promisify(exec)(`optipng -o${options.compression} ${toPath}`);
  }

  // TIFF
  if (toFormat === 'tiff' || toFormat === 'tif') {
    image.tiff({
      quality: options.quality || 90
    });
    await image.toFile(toPath);
  }

  // WEBP
  if (toFormat === 'webp') {
    image.webp({
      quality: options.quality || 90
    });
    await image.toFile(toPath);
  }

  return toPath;
};

module.exports = makeImage;
