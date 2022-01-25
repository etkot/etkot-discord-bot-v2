const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { joinVoiceChannel, createAudioResource, createAudioPlayer, AudioPlayerStatus } = require('@discordjs/voice');
const queue = new Map();

module.exports = {
    name: 'music',
    aliases: ['play', 'p', 'skip', 's', 'stop', 'leave', 'l'],
    description: 'Plays a song from YouTube',
    async execute(message, args, cmd, client, Discord) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send('You need to be in a voice channel to use this command!');

        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.channel.send(`You don't have persmission to do that`);

        const serverQueue = queue.get(message.guild.id);

        if (cmd === 'play' || cmd === 'p') {
            if (!args.length) return message.channel.send('You need to provide a song name or URL to play!');
            let song = {};

            // If the argument is an URL
            if (ytdl.validateURL(args[0])) {
                const songInfo = await ytdl.getInfo(args[0]);
                song = { title: songInfo.videoDetails.title, url: songInfo.videoDetails.video_url };
            }

            // If the argument is a song name
            else {
                // Function for searching a song
                const video_finder = async (query) => {
                    const video_result = await ytSearch(query);
                    return video_result.videos.length > 1 ? video_result.videos[0] : null;
                };

                const video = await video_finder(args.join(' '));
                if (video) {
                    song = { title: video.title, url: video.url };
                } else {
                    message.channel.send('Error finding the song!');
                }
            }

            if (!serverQueue) {
                const queueConstructor = {
                    voice_channel: voiceChannel,
                    text_channel: message.channel,
                    connection: null,
                    songs: [],
                };

                queue.set(message.guild.id, queueConstructor);
                queueConstructor.songs.push(song);

                try {
                    const connection = joinVoiceChannel({
                        channelId: voiceChannel.id,
                        guildId: voiceChannel.guildId,
                        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                    });

                    queueConstructor.connection = connection;
                    videoPlayer(message.guild, queueConstructor.songs[0]);
                } catch (err) {
                    queue.delete(message.guild.id);
                    message.channel.send('Error joining the voice channel');
                    throw err;
                }
            } else {
                serverQueue.songs.push(song);
                return message.channel.send(`**${song.title}** added to queue!`);
            }
        }

        if (cmd === 'skip' || cmd === 's' || cmd === 'next') {
            skipSong(message, serverQueue);
        }
        if (cmd === 'leave' || cmd === 'l' || cmd === 'stop') {
            stopSong(message, serverQueue);
        }
    },
};

const videoPlayer = async (guild, song) => {
    const songQueue = queue.get(guild.id);

    if (!song) {
        songQueue.voice_channel.leave();
        queue.delete(guild.id);
        return;
    }
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

const skipSong = (message, serverQueue) => {
    if (!message.member.voice.channel)
        return message.channel.send('You need to be in a channel to execute this command!');
    if (!serverQueue) {
        return message.channel.send(`There are no more songs in queue :(`);
    }
    const songQueue = queue.get(message.guild.id);
    songQueue.songs.shift();
    videoPlayer(message.guild, songQueue.songs[0]);
};

const stopSong = (message, serverQueue) => {
    if (!message.member.voice.channel) {
        return message.channel.send('You need to be in a channel to execute this command!');
    }
    serverQueue.songs = [];
    queue.delete(message.guild.id);
    serverQueue.connection.destroy();
    return message.channel.send('Bye bye :(');
};
