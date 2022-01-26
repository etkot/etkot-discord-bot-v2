import Command from '../types/command';
import queue from '../utils/queue';
import { videoPlayer } from './play';

const skip: Command = {
    name: 'skip',
    aliases: ['s', 'next'],
    description: 'Skips the current song',
    execute: async (message, args, cmd, client) => {
        const voiceChannel = message.member?.voice.channel;
        if (!voiceChannel) return message.channel.send('You need to be in a voice channel to use this command!');

        const permissions = voiceChannel.permissionsFor(message.member);
        if (!permissions.has('CONNECT')) return message.channel.send(`You don't have persmission to do that`);

        // SAFETY: message.guild will always be defined since message not sent to a guild won't have message.member.voice.channel defined checked above
        const serverQueue = queue.get(message.guild?.id as string);

        if (!serverQueue || !serverQueue.songs.length) {
            return message.channel.send(`There are no more songs in queue :(`);
        }

        serverQueue.songs.shift();
        videoPlayer(message.guild, serverQueue.songs[0]);
    },
};

export default skip;
