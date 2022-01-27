import Discord from 'discord.js';
import Client from './client';

export type EventHandler = {
    eventName: string;
    execute: (client: Client, message: Discord.Message) => void | Promise<void>;
};
