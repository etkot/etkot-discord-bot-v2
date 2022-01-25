const fs = require('fs');

module.exports = (client, Discord) => {
    const loadDir = (dir) => {
        const eventFiles = fs.readdirSync(`src/events/${dir}`).filter((file) => file.endsWith('js'));

        eventFiles.forEach((fileName) => {
            const event = require(`../events/${dir}/${fileName}`);
            const eventName = fileName.split('.')[0];
            client.on(eventName, event.bind(null, Discord, client));
        });
    };

    ['client', 'guild'].forEach((e) => loadDir(e));
};
