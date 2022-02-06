import Command from '../../types/command';
import queue from '../../utils/queue';
import { MessageEmbed } from 'discord.js';

const info: Command = {
    name: 'info',
    aliases: ['i'],
    description: 'Shows information about the current song',
    execute: async (message, args, cmd, client) => {
        if (!message.guild) return;

        const voiceChannel = message.member?.voice.channel;
        if (!voiceChannel) return message.channel.send('You need to be in a voice channel to use this command!');

        const permissions = voiceChannel.permissionsFor(message.member);
        if (!permissions.has('CONNECT')) return message.channel.send(`You don't have persmission to do that`);

        // SAFETY: message.guild will always be defined since message not sent to a guild won't have message.member.voice.channel defined checked above
        const serverQueue = queue.get(message.guild?.id as string);

        if (!serverQueue) {
            return message.channel.send(`Nyt meni kasetti sekasin`);
        }
        const songs = serverQueue.songs;

        const embed = new MessageEmbed();
        embed.setTitle(songs[0].title);
        embed.setDescription(
            `${songs[0].url}\n\n**Duration: **${
                songs[0].length < 3600
                    ? new Date(songs[0].length * 1000).toISOString().substr(14, 5) + ' min'
                    : new Date(songs[0].length * 1000).toISOString().substr(11, 8) + ' h'
            }\n\n**Description:**\n${songs[0].description}`,
        );

        return message.channel.send({ embeds: [embed] });
    },
};

export default info;
