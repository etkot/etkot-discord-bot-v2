import fs from 'fs';
import Client from '../types/client';
import getFolders from '../utils/getFolders';

const handler = async (client: Client) => {
    const commandPaths: string[] = [];

    const folders = await getFolders(`src/commands`);
    folders.push('src/commands');
    for (const folder of folders) {
        fs.readdirSync(folder).filter((file) => {
            if (file.endsWith('.ts')) {
                commandPaths.push(`${folder.replace('src', '..')}/${file}`);
            }
        });
    }

    for (const path of commandPaths) {
        const command = require(`${path}`).default;
        if (command.name) {
            client.commands.set(command.name, command);
        }
    }
};

export default handler;
