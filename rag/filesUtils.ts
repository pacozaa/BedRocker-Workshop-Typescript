import * as fs from 'fs';
import axios from 'axios';

export const createDirectory = (directory: string): void => {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
};

export const downloadFile = async (url: string, destination: string): Promise<void> => {
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