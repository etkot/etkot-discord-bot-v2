import { EventHandler } from '../../types/handlers';

const handler: EventHandler = {
    eventName: 'ready',
    execute: () => {
        console.log(`Etkot Music Bot is online!`);
    },
};

export default handler;
