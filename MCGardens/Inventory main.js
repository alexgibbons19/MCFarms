const http = require('node:http');
const fs = require('fs');
const path = require('path');


const hostname = '127.0.0.1';
const port = 3000;


const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');


  // Read the HTML file containing the webpage structure
  fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.end('Error loading the file');
      return;
    }
    res.end(data);
  });
});


server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
