const fs = require('fs');

module.exports = (client, Discrod) => {
    const commandFiles = fs.readdirSync('src/commands/').filter((file) => file.endsWith('.js'));

    commandFiles.forEach((fileName) => {
        command = require(`../commands/${fileName}`);
        if (command.name) {
            client.commands.set(command.name, command);
        } else return;
    });
};
