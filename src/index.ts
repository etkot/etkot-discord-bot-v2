require('dotenv').config();

import Discord from 'discord.js';
import Client from './types/client';

const myIntents = new Discord.Intents();
myIntents.add(
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
);

const client = new Client({ intents: myIntents });

['commandHandler', 'eventHandler'].forEach((handler) => {
    require(`./handlers/${handler}`)(client);
});

client.login(process.env.DC_TOKEN);
