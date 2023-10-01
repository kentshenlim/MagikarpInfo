const http = require('http');
const fs = require('fs/promises');
const fsAsync = require('fs');
const path = require('path');

(() => {
  const port = 8080;
  const hostname = 'localhost';
  const fileMap = {
    '/': './index.html',
    '/about': './about.html',
    '/contact-me': './contact-me.html',
    error: './404.html',
  };

  const server = http.createServer(async (req, res) => {
    const pathname = req.url;

    // If requesting CSS
    if (pathname === '/style.css') {
      const filePath = path.join(__dirname, 'style.css');
      const readStream = fsAsync.createReadStream(filePath);
      res.writeHead(200, { 'Content-Type': 'text/css' });
      readStream.pipe(res); // Do not res.end() here!
      return;
    }

    // If requesting IMG
    if (req.url.startsWith('/img')) {
      const imagePath = path.join(__dirname, req.url);
      const imageStream = fsAsync.createReadStream(imagePath);
      res.writeHead(200, { 'Content-Type': 'image/*' });
      imageStream.pipe(res);
      return;
    }

    // Otherwise requesting HTML
    try {
      const htmlData = await fs.readFile(fileMap[pathname] || fileMap.error);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(htmlData);
    } catch (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write('File system is not accessible...');
    }
    res.end();
  });

  server.listen(port, hostname, () => {
    console.log(`The server is live at http://${hostname}:${port}`);
  });
})();
