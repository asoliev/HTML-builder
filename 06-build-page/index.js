const fs = require('fs').promises;
const path = require('path');

async function checkFoldersExistens(
  templateFile,
  componentsFolder,
  stylesFolder,
  assetsFolder,
) {
  try {
    await fs.access(templateFile);
    await fs.access(componentsFolder);
    await fs.access(stylesFolder);
    await fs.access(assetsFolder);
  } catch (err) {
    console.log(err);
    console.error('Required files or directories are missing. Double check.');
    process.exit(1);
  }
}

async function replaceTags(templateFile, componentsFolder, distFolder) {
  const templateData = await fs.readFile(templateFile, 'utf8');
  let newData = templateData;

  const componentFiles = await fs.readdir(componentsFolder);

  for (const file of componentFiles) {
    const filePath = path.join(componentsFolder, file);
    const fileData = await fs.readFile(filePath, 'utf8');
    const fileName = path.parse(file).name;
    newData = newData.replace(`{{${fileName}}}`, fileData);
  }

  await fs.writeFile(path.join(distFolder, 'index.html'), newData);
}

async function mergeStyles(stylesFolder, distFolder) {
  const styleFiles = await fs.readdir(stylesFolder);

  let styles = '';
  for (const file of styleFiles) {
    const filePath = path.join(stylesFolder, file);
    const fileData = await fs.readFile(filePath, 'utf8');
    styles += fileData;
  }

  await fs.writeFile(path.join(distFolder, 'style.css'), styles);
}

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function runMain() {
  const distFolder = path.join(__dirname, 'project-dist');
  const templateFile = path.join(__dirname, 'template.html');
  const componentsFolder = path.join(__dirname, 'components');
  const stylesFolder = path.join(__dirname, 'styles');
  const assetsFolder = path.join(__dirname, 'assets');

  await checkFoldersExistens(
    templateFile,
    componentsFolder,
    stylesFolder,
    assetsFolder,
  );

  await fs.mkdir(distFolder, { recursive: true });

  await replaceTags(templateFile, componentsFolder, distFolder);

  await mergeStyles(stylesFolder, distFolder);

  await copyDir(assetsFolder, path.join(distFolder, 'assets'));
}

runMain();
