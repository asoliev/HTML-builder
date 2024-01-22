const fs = require('fs');
const path = require('path');
const { stdout } = require('process');

const data = [];
const filePath = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(filePath, 'utf8');
readStream.on('data', chunk => data.push(chunk));
readStream.on('end', () => stdout.write(data.join('')));