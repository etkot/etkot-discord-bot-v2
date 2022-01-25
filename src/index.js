require('dotenv').config();

const Discord = require('discord.js');
const myIntents = new Discord.Intents();
myIntents.add(
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
);
const client = new Discord.Client({ intents: myIntents });

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

['commandHandler', 'eventHandler'].forEach((handler) => {
    require(`./handlers/${handler}`)(client, Discord);
});

client.login(process.env.DC_TOKEN);
