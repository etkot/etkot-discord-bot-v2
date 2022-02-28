import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel } from '@discordjs/voice';
import Discord from 'discord.js';
import ytSearch from 'yt-search';
import ytdl from 'ytdl-core';
import Command from '../../types/command';
import { Queue, Song } from '../../types/music';
import queue from '../../utils/queue';

const videoFinder = async (query: string) => {
    const video_result = await ytSearch(query);
    return video_result.all.length > 1 ? video_result.all[0].url : '';
};

export const videoPlayer = async (guild: Discord.Guild, song: Song) => {
    const songQueue = queue.get(guild.id);
    if (!songQueue) return;

    const stream = async () => {
        let info = await ytdl.getInfo(song.url);
        if (song.isLive) {
            const format = ytdl.chooseFormat(info.formats, { quality: [128, 127, 120, 96, 95, 94, 93] });
            return format.url;
        } else return ytdl.downloadFromInfo(info, { filter: 'audioonly' });
    };

    const player = createAudioPlayer();
    const resource = createAudioResource(await stream());

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
    options: [
        {
            type: 'STRING',
            name: 'Search term or URL',
            description: 'Search term or URL of the video to play',
            required: true,
        },
    ],
    execute: async (message, args, cmd, client) => {
        if (!message.guild) return;

        const voiceChannel = message.member?.voice.channel;
        if (!voiceChannel) return message.channel.send('You need to be in a voice channel to use this command!');

        const permissions = voiceChannel.permissionsFor(message.member);
        if (!permissions.has('CONNECT')) return message.channel.send(`You don't have persmission to do that`);

        // SAFETY: message.guild will always be defined since message not sent to a guild won't have message.member.voice.channel defined checked above
        const serverQueue = queue.get(message.guild?.id as string);

        if (!args.length) return message.channel.send('You need to provide a song name or URL to play!');

        let url = '';
        ytdl.validateURL(args[0]) ? (url = args[0]) : (url = await videoFinder(args.join(' ')));

        const songData = (await ytdl.getInfo(url)).videoDetails;
        if (!songData) return message.channel.send('Could not find any songs :(');

        const song: Song = {
            title: songData.title,
            url: songData.video_url,
            isLive: songData.isLiveContent,
            description: songData.description ? songData.description : undefined,
            length: parseInt(songData.lengthSeconds),
        };

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
