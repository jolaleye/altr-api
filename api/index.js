const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-body');
const path = require('path');
const fs = require('fs-extra');
const shortid = require('shortid');

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

router.post('/upload', async (ctx, next) => {
  const { file } = ctx.request.files;
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);
