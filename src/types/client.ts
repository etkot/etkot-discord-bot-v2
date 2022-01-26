import Discord from 'discord.js';
import Command from './command';

export default class Client extends Discord.Client {
    commands: Discord.Collection<string, Command>;
    events: Discord.Collection<string, string>;

    constructor(options: Discord.ClientOptions) {
        super(options);

        this.commands = new Discord.Collection<string, Command>();
        this.events = new Discord.Collection<string, string>();
    }
}
