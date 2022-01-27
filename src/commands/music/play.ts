import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel } from '@discordjs/voice';
import Discord from 'discord.js';
import ytSearch from 'yt-search';
import ytdl from 'ytdl-core';
import Command from '../../types/command';
import { Queue, Song } from '../../types/music';
import queue from '../../utils/queue';

const videoFinder = async (query: string) => {
    const video_result = await ytSearch(query);
    return video_result.videos.length > 1 ? video_result.videos[0] : null;
};

export const videoPlayer = async (guild: Discord.Guild, song: Song) => {
    const songQueue = queue.get(guild.id);
    if (!songQueue) return;

    const stream = ytdl(song.url, { filter: 'audioonly' });

    const player = createAudioPlayer();
    const resource = createAudioResource(stream);

    songQueue.connection.subscribe(player);
    player.play(resource);

    player.on(AudioPlayerStatus.Idle, () => {
        songQueue.songs.shift();
        videoPlayer(guild, songQueue.songs[0]);
    });

    await songQueue.text_channel.send(`Now playing: **${song.title}** :musical_note:`);
};

const play: Command = {
    name: 'play',
    aliases: ['p'],
    description: 'Plays a song from YouTube',
    execute: async (message, args, cmd, client) => {
        if (!message.guild) return;

        const voiceChannel = message.member?.voice.channel;
        if (!voiceChannel) return message.channel.send('You need to be in a voice channel to use this command!');

        const permissions = voiceChannel.permissionsFor(message.member);
        if (!permissions.has('CONNECT')) return message.channel.send(`You don't have persmission to do that`);

        // SAFETY: message.guild will always be defined since message not sent to a guild won't have message.member.voice.channel defined checked above
        const serverQueue = queue.get(message.guild?.id as string);

        if (!args.length) return message.channel.send('You need to provide a song name or URL to play!');

        const songData = ytdl.validateURL(args[0])
            ? (await ytdl.getInfo(args[0])).videoDetails
            : await videoFinder(args.join(' '));

        if (!songData) return message.channel.send('Could not find any songs with that name or URL');

        const song: Song = {
            title: songData.title,
            url: '',
        };

        // Typeguard to make linters happy
        if ('url' in songData) {
            song.url = songData.url;
        } else {
            song.url = songData.video_url;
        }

        if (serverQueue) {
            serverQueue.songs.push(song);
            return message.channel.send(`**${song.title}** added to queue!`);
        }

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
            };

            queue.set(message.guild?.id as string, queueConstructor);
            queueConstructor.songs.push(song);

            videoPlayer(message.guild, queueConstructor.songs[0]);
        } catch (err) {
            queue.delete(message.guild?.id as string);
            message.channel.send('Error joining the voice channel');
            throw err;
        }
    },
};

export default play;
