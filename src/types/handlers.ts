import Discord from 'discord.js';
import Client from './client';

export type EventHandler = (client: Client, message: Discord.Message) => void | Promise<void>;
