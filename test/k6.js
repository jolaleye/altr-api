import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 10,
  iterations: 100
};

const jpg = open('./jpg.jpg', 'b');

export default () => {
  // jpg -> png
  const res = http.post('http://localhost:3000/upload', {
    file: http.file(jpg, 'jpg.jpg'),
    format: 'png',
    compression: 2
  });

  check(res, {
    'Status 200': res => res.status == 200
  });
};
