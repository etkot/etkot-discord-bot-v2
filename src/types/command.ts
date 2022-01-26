import Discord from 'discord.js';
import Client from './client';

export default interface Command {
    name: string;
    aliases: string[];
    description: string;
    execute: (message: Discord.Message, args: string[], cmd: string, client: Client) => void;
}
