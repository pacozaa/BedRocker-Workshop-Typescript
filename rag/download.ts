import * as path from 'path';
import { createDirectory, downloadFile } from './filesUtils';

const files = [
  'https://www.irs.gov/pub/irs-pdf/p1544.pdf',
  'https://www.irs.gov/pub/irs-pdf/p15.pdf',
  'https://www.irs.gov/pub/irs-pdf/p1212.pdf',
];

const downloadDirectory = 'data';//../data

createDirectory(downloadDirectory);

files.forEach(async (url) => {
  const filePath = path.join(downloadDirectory, path.basename(url));
  await downloadFile(url, filePath);
  console.log(`Downloaded ${url} to ${filePath}`);
});
