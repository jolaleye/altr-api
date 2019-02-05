# Altr.app API

`POST` to `https://api.altr.app/upload` with `multipart/form-data` containing a file and options. The API will respond with the file altered according to the supplied options.

## Options

### Image

- `format`: output format, possible values: jpeg/jpg, png, tiff/tif, webp
- `width`: output width
- `height`: output height
- `quality`: applies to jpg, tiff, and webp, possible values: 1-100
- `compression`: OptiPNG compression level, possible values: 0-7

### Video

- `format`: output format, possible values: mp4, mov, wmv, avi, mkv
- `width`: output width
- `height`: output height
- `start`: trim start (seconds)
- `end`: trim end (seconds)

### Audio

- `format`: output format, possible values: mp3, wav, wma
- `start`: trim start (seconds)
- `end`: trim end (seconds)
