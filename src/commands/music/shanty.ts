import Command from '../../types/command';
import play from '././play';

const shanty: Command = {
    name: 'shanty',
    aliases: ['seaShanty', 'arr'],
    description: 'Clears the queue',
    execute: async (message, args, cmd, client) => {
        if (!message.guild) return;

        const voiceChannel = message.member?.voice.channel;
        if (!voiceChannel) return message.channel.send('You need to be in a voice channel to use this command!');

        const permissions = voiceChannel.permissionsFor(message.member);
        if (!permissions.has('CONNECT')) return message.channel.send(`You don't have persmission to do that`);

        play.execute(message, ['https://www.youtube.com/watch?v=wl-HPIu5kcs'], cmd, client);
        return message.channel.send(`Arr matey, shanty it is! :pirate_flag:`);
    },
};

export default shanty;
