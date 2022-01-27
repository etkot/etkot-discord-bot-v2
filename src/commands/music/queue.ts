import Command from '../../types/command';
import queue from '../../utils/queue';
import { MessageEmbed } from 'discord.js';

const musicQueue: Command = {
    name: 'queue',
    aliases: ['q', 'list', 'songs'],
    description: 'Shows all songs currently in the queue',
    execute: async (message, args, cmd, client) => {
        if (!message.guild) return;

        const voiceChannel = message.member?.voice.channel;
        if (!voiceChannel) return message.channel.send('You need to be in a voice channel to use this command!');

        const permissions = voiceChannel.permissionsFor(message.member);
        if (!permissions.has('CONNECT')) return message.channel.send(`You don't have persmission to do that`);

        // SAFETY: message.guild will always be defined since message not sent to a guild won't have message.member.voice.channel defined checked above
        const serverQueue = queue.get(message.guild?.id as string);

        if (!serverQueue || serverQueue.songs.length === 1) {
            return message.channel.send(`There are no songs in the queue :(`);
        }

        const embed = new MessageEmbed();
        embed.setTitle('Queue');
        const songs = serverQueue.songs;
        embed.setDescription(
            `Current song: **${songs[0].title}** :musical_note:\n\n${songs
                .slice(1)
                .map((song, index) => `${index + 1}) ${song.title}`)
                .join('\n')}`,
        );

        return message.channel.send({ embeds: [embed] });
    },
};

export default musicQueue;
