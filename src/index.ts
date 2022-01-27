require('dotenv').config();

import Discord, { Intents } from 'discord.js';
import Client from './types/client';

const myIntents = new Discord.Intents();
myIntents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES);

const client = new Client({ intents: myIntents });

['commandHandler', 'eventHandler'].forEach((handler) => {
    require(`./handlers/${handler}`).default(client);
});

client.login(process.env.DC_TOKEN);
