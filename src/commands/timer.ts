import { createAudioPlayer, createAudioResource, joinVoiceChannel } from '@discordjs/voice';
import axios from 'axios';
import Discord from 'discord.js';
import * as googleTTS from 'google-tts-api';
import { Readable } from 'stream';
import Command from '../types/command';
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
    name: 'timer',
    aliases: ['t'],
    description: 'Timer in minutes',
    execute: async (message, args, cmd, client) => {
        if (!message.guild) return;

        const voiceChannel = message.member?.voice.channel;
        if (!voiceChannel) return message.channel.send('You need to be in a voice channel to use this command!');

        const permissions = voiceChannel.permissionsFor(message.member);
        if (!permissions.has('CONNECT')) return message.channel.send(`You don't have persmission to do that`);

        if (!args.length) return message.channel.send('You need to provide time for the bot to wait!');

        const time = parseInt(args[0]);
        if (isNaN(time)) return message.channel.send('You need to provide a valid number for the bot!');

        const lang = 'en';

        const base64 = await googleTTS.getAudioBase64("Time's up bitch!", {
            lang: lang,
            slow: false,
            host: 'https://translate.google.com',
            timeout: 10000,
        });

        const buffer = Buffer.from(base64, 'base64');
        const stream = Readable.from(buffer);

        try {
            setTimeout(() => {
                const player = createAudioPlayer();
                const resource = createAudioResource(stream);

                const serverQueue = queue.get(message.guild?.id as string);
                if (!serverQueue) {
                    const connection = joinVoiceChannel({
                        channelId: voiceChannel.id,
                        guildId: voiceChannel.guildId,
                        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                    });
                    connection.subscribe(player);
                } else {
                    serverQueue.connection.subscribe(player);
                }
                player.play(resource);
            }, time * 60 * 1000);
        } catch (err) {
            message.channel.send('Homma meni wilduks :(');
            throw err;
        }
    },
};

export default play;
