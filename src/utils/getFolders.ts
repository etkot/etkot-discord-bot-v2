import fs from 'fs';

const getFolders = async (path: string) => {
    const folders: string[] = [];
    fs.readdirSync(path).filter((file) => {
        if (fs.statSync(`${path}/${file}`).isDirectory()) {
            folders.push(`${path}/${file}`);
        }
    });
    return folders;
};

export default getFolders;
