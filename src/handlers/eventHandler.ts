import Client from '../types/client';
import getFiles from '../utils/getFiles';

import path from 'path';
import { EventHandler } from '../types/handlers';

const eventsPath = path.join(__dirname, '../events');

const handler = async (client: Client) => {
    const events: string[] = await getFiles(eventsPath);

    console.log(`Loading ${events.length} events`);

    for (const path of events) {
        const event = require(path).default as EventHandler;

        if (event.eventName) {
            client.on(event.eventName, (e) => event.execute(client, e));
        }
    }
};

export default handler;
