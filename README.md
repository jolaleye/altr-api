# Altr API

## GET `/fetch?url=`

Proxy requests for media URLs. URLs may point directly to an image, video, or audio file, or to a YouTube video. Streams the result to the client.

## POST `/upload`

Post `multipart/form-data` with an image, video, or audio file under the key `file` and various options. Responds with the altered file.

### Image

**Supported formats:** jpg, png, tiff, webp

- `format`: output format
- `width`: output width
- `height`: output height
- `quality`: quality 1-100, applies to jpg, webp, and tiff
- `compression`: OptiPNG compression level (0-7), applies to png

### Video

**Supported formats:** mp4, mov, wmv, avi, mkv, webm

- `format`: output format
- `width`: output width
- `height`: output height
- `start`: start time (s)
- `end`: end time (s)

### Audio

**Supported formats:** mp3, wav, wma, avi, webm

- `format`: output format
- `start`: start time (s)
- `end`: end time (s)
