import fs from 'fs/promises';
import path from 'path';

const getFiles = async (basePath: string) => {
    const files = await fs.readdir(basePath);

    const commands: string[] = [];

    for (const file of files) {
        const filePath = path.join(basePath, file);
        const stats = await fs.stat(filePath);

        if (stats.isDirectory()) {
            commands.push(...(await getFiles(filePath)));
        } else if (file.endsWith('.ts') || file.endsWith('.js')) {
            commands.push(filePath);
        }
    }
    return commands;
};

export default getFiles;
