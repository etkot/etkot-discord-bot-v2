require('dotenv').config();

module.exports = (Discord, client, message) => {
    if (!message.content.startsWith(process.env.PREFIX || message.author.bot)) return;

    const args = message.content.slice(process.env.PREFIX.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command =
        client.commands.get(commandName) || client.commands.find((a) => a.aliases && a.aliases.includes(commandName));

    try {
        command.execute(message, args, commandName, client, Discord);
    } catch (err) {
        message.reply('There was an error trying to execute that command');
        console.error(err);
    }
};
