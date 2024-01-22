const { readdir, stat } = require('fs/promises');
const path = require('path');
const BYTES_IN_KB = 1024;
async function getFilesInfo() {
  const folderPath = path.join(__dirname, 'secret-folder');
  const files = await readdir(folderPath, { withFileTypes: true });
  const tableData = await Promise.all(
    files.map(async (file) => {
      if (file.isDirectory()) return null;
      const filePath = path.join(folderPath, file.name);
      const fileStat = await stat(filePath);

      const fileExtension = path.extname(file.name);
      const fileName = path.basename(file.name, fileExtension);
      const formattedFileExtension = fileExtension.slice(1);
      const fileSizeKb = Math.round(fileStat.size / BYTES_IN_KB);

      return {
        Name: fileName,
        ext: formattedFileExtension,
        sizeKb: fileSizeKb,
      };
    }),
  );
  const filteredData = tableData.filter(Boolean);
  console.table(filteredData);
}
getFilesInfo();
