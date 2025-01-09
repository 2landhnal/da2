import fs from 'fs';
import path from 'path';

export class TmpRepo {
    static saveToTemp = ({ file, nameToSave }) => {
        const tempDir = 'models/repositories/temp/';
        const filePath = path.join(tempDir, nameToSave);

        // check path exist
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }

        // save file
        fs.writeFileSync(filePath, file.buffer);

        return filePath;
    };

    static deleteFileAsync = ({ filePath }) => {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            } else {
                console.log('File deleted successfully');
            }
        });
    };

    static getFileBuferFromPath = ({ filePath }) => {
        try {
            const fileBuffer = fs.readFileSync(filePath);
            return fileBuffer;
        } catch (error) {
            console.error('Error reading file:', error);
        }
    };
}
