const http = require('http');
const fs = require('fs');
const path = require('path');

const requestedPort = parseInt(process.env.PORT, 10) || 8080;
const root = process.cwd();

function findAvailablePort(start, maxAttempts = 100) {
  return new Promise((resolve) => {
    let port = start;
    const tryPort = () => {
      const tester = http.createServer()
        .once('error', () => {
          port++;
          if (port > start + maxAttempts) return resolve(null);
          tryPort();
        })
        .once('listening', () => {
          tester.close(() => resolve(port));
        })
        .listen(port, '0.0.0.0');
    };

    tryPort();
  });
}

const mime = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  try {
    let reqPath = decodeURIComponent(req.url.split('?')[0]);

    // Normalize and prevent path traversal
    reqPath = path.normalize(reqPath).replace(/^\/+/, '/');

    // If directory or root, try common index filenames
    if (reqPath === '/' || reqPath.endsWith('/')) {
      const candidates = [
        'index.html',
        'Harrison Tang Portfolio (2).html',
        '<!DOCTYPE html>.html'
      ];

      for (const c of candidates) {
        const candidatePath = path.join(root, c);
        if (fs.existsSync(candidatePath) && fs.statSync(candidatePath).isFile()) {
          return streamFile(candidatePath, res);
        }
      }

      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      return res.end('Not found');
    }

    const filePath = path.join(root, reqPath);

    // Ensure file is within root
    if (!filePath.startsWith(root)) {
      res.statusCode = 403;
      res.setHeader('Content-Type', 'text/plain');
      return res.end('Forbidden');
    }

    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      return res.end('Not found');
    }

    return streamFile(filePath, res);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Server error');
  }
});

function streamFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const type = mime[ext] || 'application/octet-stream';
  res.setHeader('Content-Type', type);
  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
  stream.on('error', () => {
    res.statusCode = 500;
    res.end('Server error');
  });
}

(async () => {
  const port = await findAvailablePort(requestedPort, 200);
  if (!port) {
    console.error('No available port found');
    process.exit(1);
  }

  server.listen(port, '0.0.0.0', () => {
    // Print localhost URL so VS Code `serverReadyAction` can match it
    console.log(`Static server running at http://localhost:${port}/ (serving: ${root})`);
  });
})();
