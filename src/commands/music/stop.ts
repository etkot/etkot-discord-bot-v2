import Command from '../../types/command';
import queue from '../../utils/queue';

const stop: Command = {
    name: 'stop',
    aliases: ['leave', 'l'],
    description: 'Stops the current song and leaves the voice channel',
    execute: async (message, args, cmd, client) => {
        const voiceChannel = message.member?.voice.channel;
        if (!voiceChannel) return message.channel.send('You need to be in a voice channel to use this command!');

        const permissions = voiceChannel.permissionsFor(message.member);
        if (!permissions.has('CONNECT')) return message.channel.send(`You don't have persmission to do that`);

        // SAFETY: message.guild will always be defined since message not sent to a guild won't have message.member.voice.channel defined checked above
        const serverQueue = queue.get(message.guild?.id as string);

        queue.delete(message.guild?.id as string);
        serverQueue?.connection.destroy();

        return message.channel.send('Bye bye :(');
    },
};

export default stop;
