import Client from '../types/client';
import getFiles from '../utils/getFiles';
import path from 'path';
import Command from '../types/command';

const commandsPath = path.join(__dirname, '../commands');

const handler = async (client: Client) => {
    const commands: string[] = await getFiles(commandsPath);

    console.log(`Loading ${commands.length} commands`);

    // For command autocomplation in the Discord client
    const applicationCommandManager = client.application?.commands;

    for (const path of commands) {
        const command = require(path).default as Command;
        if (command.name) {
            client.commands.set(command.name, command);

            if (command.options)
                applicationCommandManager
                    ?.create({
                        name: command.name,
                        description: command.description,
                        type: 'CHAT_INPUT',
                        options: command.options,
                        defaultPermission: true,
                    })
                    .then(console.log)
                    .catch(console.error);
        }
    }
};

export default handler;
