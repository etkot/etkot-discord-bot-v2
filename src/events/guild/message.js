require('dotenv').config();

module.exports = (Discord, client, message) => {
    if (!message.content.startsWith(process.env.PREFIX || message.author.bot)) return;

    const args = message.content.slice(process.env.PREFIX.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command =
        client.commands.get(commandName) || client.commands.find((a) => a.aliases && a.aliases.includes(commandName));

    if (!command) return;

    try {
        command.execute(message, args, commandName, client, Discord);
    } catch (err) {
        message.reply('nyt en ymmärrä,, keitän teetä itselleni t. spagetbot');
        console.error(err);
    }
};
