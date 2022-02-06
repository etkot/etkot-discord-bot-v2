import Command from '../../types/command';
import queue from '../../utils/queue';

const clear: Command = {
    name: 'clear',
    aliases: ['c', 'empty'],
    description: 'Clears the queue',
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

        serverQueue.songs = [];
        return message.channel.send(`Cleared the queue`);
    },
};

export default clear;
