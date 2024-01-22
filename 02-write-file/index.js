const fs = require('fs');
const path = require('path');
const rl = require('readline');

const { stdin, stdout, exit } = require('process');
const filePath = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(filePath, { flags: 'a' }, 'utf8');

const readLine = rl.createInterface({
  input: stdin,
  output: stdout,
});

stdout.write('Enter the text: \n');
readLine.on('line', (data) => {
  if (data === 'exit') {
    sayBye();
  }
  writeStream.write(data);
});

readLine.on('SIGINT', sayBye);

function sayBye() {
  stdout.write('Goodbye!');
  exit();
}
