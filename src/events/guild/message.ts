import { EventHandler } from '../../types/handlers';

const handler: EventHandler = {
    eventName: 'messageCreate',
    execute: async (client, message) => {
        if (!message.content.startsWith(process.env.PREFIX || '/') || message.author.bot) return;

        const args = message.content.slice((process.env.PREFIX || '/').length).split(/ +/);
        const commandName = args.shift()?.toLowerCase();

        if (!commandName) return;

        const command =
            client.commands.get(commandName) || client.commands.find((a) => a.aliases?.includes(commandName));

        if (!command) {
            message.reply('Nyt en ymmärrä,, keitän teetä itselleni t. spagetbot');
            return;
        }

        try {
            command.execute(message, args, commandName, client);
        } catch (err) {
            message.reply('Jotain meni pieleen, kokeile uudestaan');
            console.error(err);
        }
    },
};

export default handler;
