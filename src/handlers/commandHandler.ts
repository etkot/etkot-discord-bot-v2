import fs from 'fs/promises';
import Client from '../types/client';

const handler = async (client: Client) => {
    const files = await fs.readdir(`src/commands/`);
    const eventFiles = files.filter((file) => file.endsWith('.ts'));

    for (const fileName of eventFiles) {
        const command = require(`../commands/${fileName}`);
        if (command.name) {
            client.commands.set(command.name, command);
        }
    }
};

export default handler;
