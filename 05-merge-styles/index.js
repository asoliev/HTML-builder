const { readdir } = require('fs/promises');
const { pipeline } = require('stream/promises');
const { createReadStream, createWriteStream } = require('fs');
const path = require('path');

async function createBundle() {
  const stylesFolder = path.join(__dirname, 'styles');
  const files = await readdir(stylesFolder, { withFileTypes: true });
  const cssFilePathes = files
    .filter((file) => !file.isDirectory())
    .map((file) => file.name)
    .filter((fileName) => path.extname(fileName) === '.css')
    .map((file) => path.join(stylesFolder, file));
  await mergeFiles(cssFilePathes);
}
async function mergeFiles(cssFilePathes) {
  const dist_path = path.join(__dirname, 'project-dist', 'bundle.css');
  for (const filePath of cssFilePathes) {
    const readStream = createReadStream(filePath, 'utf8');
    const writeStream = createWriteStream(dist_path, { flags: 'a' }, 'utf8');
    await pipeline(readStream, writeStream);
  }
}
createBundle();
