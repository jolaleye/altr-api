const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-body');
const path = require('path');
const fs = require('fs-extra');
const shortid = require('shortid');
const send = require('koa-send');

const _ = require('./config.json');
const Image = require('./Image');
const Video = require('./Video');
const Audio = require('./Audio');

const app = new Koa();
const router = new Router();

// ensure the upload directory exists
const uploadDir = path.join(__dirname, 'uploads');
fs.ensureDirSync(uploadDir);

// configure file uploads
app.use(
  bodyParser({
    multipart: true,
    formidable: {
      keepExtensions: true,
      uploadDir,
      onFileBegin: (name, file) => {
        // rename the file with a short id
        file.path = path.join(uploadDir, `${shortid.generate()}${path.extname(file.name)}`);
      }
    }
  })
);

router.post('/upload', async ctx => {
  // check that a file was sent under the correct name
  if (!ctx.request.files.file) {
    ctx.response.status = 400;
    ctx.response.message = 'Please provide a file under the name "file"';
    return;
  }

  const upload = ctx.request.files.file;
  const options = ctx.request.body;
  const fromExt = path.extname(upload.name).slice(1);
  const toExt = options.format || fromExt;

  let file;
  // validate formats
  if (_.formats.image.in.includes(fromExt) && _.formats.image.out.includes(toExt)) {
    file = new Image(upload, options);
  } else if (_.formats.video.in.includes(fromExt) && _.formats.video.out.includes(toExt)) {
    file = new Video(upload, options);
  } else if (_.formats.audio.in.includes(fromExt) && _.formats.audio.out.includes(toExt)) {
    file = new Audio(upload, options);
  } else {
    ctx.response.status = 422;
    ctx.response.message = 'Invalid format';
    fs.remove(upload.path);
    return;
  }

  // validate options
  const errors = file.validate();
  if (errors.length) {
    ctx.response.status = 422;
    ctx.response.body = errors;
    fs.remove(upload.path);
    return;
  }

  // process file and respond with output
  try {
    const outputPath = await file.process();
    await send(ctx, `uploads/${path.basename(outputPath)}`);
    // remove the output after sending it to the client
    fs.remove(outputPath);
  } catch (err) {
    ctx.response.satus = 500;
    ctx.response.message = 'Something went wrong :(';
  }

  // remove the original
  fs.remove(upload.path);
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);
