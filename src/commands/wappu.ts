import { createAudioPlayer, createAudioResource, joinVoiceChannel } from '@discordjs/voice';
import axios from 'axios';
import Discord from 'discord.js';
import Command from '../types/command';
import { Queue } from '../types/music';
import queue from '../utils/queue';

export const videoPlayer = async (guild: Discord.Guild) => {
    const songQueue = queue.get(guild.id);
    if (!songQueue) return;

    // WAPPU PURKKA STARTS HERE
    const url = 'https://stream.wappuradio.fi/icecast/wappuradio-legacy-streamer1.opus';
    const { data: stream } = await axios.get(url, { responseType: 'stream' });

    const player = createAudioPlayer();
    const resource = createAudioResource(stream);

    songQueue.connection.subscribe(player);
    player.play(resource);

    return;
};

const play: Command = {
    name: 'wappu',
    aliases: ['w'],
    description: 'Starts wappu radio',
    execute: async (message, args, cmd, client) => {
        if (!message.guild) return;

        const voiceChannel = message.member?.voice.channel;
        if (!voiceChannel) return message.channel.send('You need to be in a voice channel to use this command!');

        const permissions = voiceChannel.permissionsFor(message.member);
        if (!permissions.has('CONNECT')) return message.channel.send(`You don't have persmission to do that`);

        try {
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guildId,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            });

            const queueConstructor: Queue = {
                voice_channel: voiceChannel,
                text_channel: message.channel,
                connection,
                songs: [],
                wappu: true,
            };

            queue.set(message.guild?.id as string, queueConstructor);
            videoPlayer(message.guild);
        } catch (err) {
            queue.delete(message.guild?.id as string);
            message.channel.send('Error joining the voice channel');
            throw err;
        }
    },
};

export default play;
