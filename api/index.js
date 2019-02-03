const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-body');
const path = require('path');
const fs = require('fs-extra');
const shortid = require('shortid');
const send = require('koa-send');

const _ = require('./config.json');
const Image = require('./Image');

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
  const upload = ctx.request.files.file;
  const options = ctx.request.body;
  const extension = path.extname(upload.name).slice(1);
  let file;

  // validate upload format
  if (_.formats.image.in.includes(extension)) file = new Image(upload, options);
  else {
    ctx.response.status = 422;
    ctx.response.message = 'Invalid input format';
    return;
  }

  // validate options
  const errors = file.validate();
  if (errors.length) {
    ctx.response.status = 422;
    ctx.response.body = errors;
    return;
  }

  // process file and respond with output
  const outputPath = await file.process();
  await send(ctx, `uploads/${path.basename(outputPath)}`);

  // remove the original and output files
  fs.remove(upload.path);
  fs.remove(outputPath);
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);
