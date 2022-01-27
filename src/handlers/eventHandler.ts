import fs from 'fs';
import Client from '../types/client';
import getFolders from '../utils/getFolders';

const handler = async (client: Client) => {
    const folders = await getFolders(`src/events`);
    for await (const folder of folders) {
        const files = await fs.readdirSync(`${folder}`);
        const eventFiles = files.filter((file) => file.endsWith('.ts'));

        for (const fileName of eventFiles) {
            const event = require(`${folder.replace('src', '..')}/${fileName}`).default;
            const eventName = fileName.split('.')[0];
            client.on(eventName, event.bind(null, client));
        }
    }
};

export default handler;
