'use strict';

const http = require('http');
const fs = require('fs');

function createServer() {
  return http.createServer((req, res) => {
    const normalizedUrl = new URL(req.url, `http://${req.headers.host}`);

    if (!normalizedUrl.pathname.startsWith('/file/')) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Should be /file/*');

      return;
    }

    const filePath = normalizedUrl.pathname.slice(6);

    if (filePath.includes('..')) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Bad Request');

      return;
    }

    if (filePath.includes('//')) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File Not Found');

      return;
    }

    fs.readFile(`public/${filePath}`, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File Not Found');

        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(data);
    });
  });
}

module.exports = {
  createServer,
};
