import http from 'http';
import fs from 'fs';
import path from 'path';

const hostname = '127.0.0.1';
const port = 3000;

const publicDir = path.resolve(__dirname, '../public');

const mimeTypes: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  try {
    const reqUrl = req.url || '/';
    const safePath = path.normalize(reqUrl.split('?')[0]).replace(/^\.+/, '');
    let filePath = path.join(publicDir, safePath);

    if (reqUrl === '/' || fs.statSync(filePath, { throwIfNoEntry: false })?.isDirectory()) {
      filePath = path.join(publicDir, 'index.html');
    }

    if (!filePath.startsWith(publicDir)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Forbidden');
      return;
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not Found');
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      const type = mimeTypes[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': type });
      res.end(data);
    });
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Internal Server Error');
  }
});

server.listen(port, hostname, () => {
  console.log(`Portfolio running at http://${hostname}:${port}/`);
});