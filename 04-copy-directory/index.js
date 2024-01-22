const { readdir, mkdir, stat, copyFile, unlink } = require('fs/promises');
const path = require('path');

const destinationFolder = path.join(__dirname, 'files-copy');

async function copyFiles() {
  const currentFolder = path.join(__dirname, 'files');
  const files = await readdir(currentFolder);
  for (const file of files) {
    const srcPath = path.join(currentFolder, file);
    const destPath = path.join(destinationFolder, file);
    await copyFile(srcPath, destPath);
  }
}
async function clearFolder() {
  const files = await readdir(destinationFolder);
  for (const file of files) {
    const destPath = path.join(destinationFolder, file);
    await unlink(destPath);
  }
}
async function copyDirectory() {
  try {
    await stat(destinationFolder);
    await clearFolder();
  } catch {
    await mkdir(destinationFolder, { recursive: true });
  } finally {
    await copyFiles();
  }
}
copyDirectory();
