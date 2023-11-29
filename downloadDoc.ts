import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

const downloadFile = async (url: string, destination: string): Promise<void> => {
  const response = await axios({
    method: 'GET',
    url: url,
    responseType: 'stream',
  });

  const writer = fs.createWriteStream(destination);

  return new Promise((resolve, reject) => {
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

const createDirectory = (directory: string): void => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

const files = [
  'https://www.irs.gov/pub/irs-pdf/p1544.pdf',
  'https://www.irs.gov/pub/irs-pdf/p15.pdf',
  'https://www.irs.gov/pub/irs-pdf/p1212.pdf',
];

const downloadDirectory = 'data';

createDirectory(downloadDirectory);

files.forEach(async (url) => {
  const filePath = path.join(downloadDirectory, path.basename(url));
  await downloadFile(url, filePath);
  console.log(`Downloaded ${url} to ${filePath}`);
});
