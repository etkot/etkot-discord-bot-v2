import fs from 'fs/promises';
import Client from '../types/client';

const folders = ['client', 'guild'];

const handler = async (client: Client) => {
    for await (const folder of folders) {
        const files = await fs.readdir(`src/events/${folder}`);
        const eventFiles = files.filter((file) => file.endsWith('.ts'));

        for (const fileName of eventFiles) {
            const event = require(`../events/${folder}/${fileName}`);
            const eventName = fileName.split('.')[0];
            client.on(eventName, event.bind(null, client));
        }
    }
};

export default handler;
