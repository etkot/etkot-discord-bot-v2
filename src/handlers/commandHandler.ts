import Client from '../types/client';
import getFiles from '../utils/getFiles';
import path from 'path';

const commandsPath = path.join(__dirname, '../commands');

const handler = async (client: Client) => {
    const commands: string[] = await getFiles(commandsPath);

    console.log(`Loading ${commands.length} commands`);

    for (const path of commands) {
        const command = require(path).default;
        if (command.name) {
            client.commands.set(command.name, command);
        }
    }
};

export default handler;
