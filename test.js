const http = require('http');

const options = {
  hostname: '127.0.0.1',
  port: 3000,
  path: '/test',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
};

const req = http.request(options, (res) => {
  console.log('Status:', res.statusCode);
  res.on('data', (chunk) => {
    console.log('Response:', chunk.toString());
  });
});

req.on('error', (e) => {
  console.log('Error:', e.message);
});

req.end();