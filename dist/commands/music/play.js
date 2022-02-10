"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoPlayer = void 0;
const voice_1 = require("@discordjs/voice");
const yt_search_1 = __importDefault(require("yt-search"));
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const queue_1 = __importDefault(require("../../utils/queue"));
const videoFinder = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const video_result = yield (0, yt_search_1.default)(query);
    return video_result.all.length > 1 ? video_result.all[0].url : '';
});
const videoPlayer = (guild, song) => __awaiter(void 0, void 0, void 0, function* () {
    const songQueue = queue_1.default.get(guild.id);
    if (!songQueue)
        return;
    const stream = () => __awaiter(void 0, void 0, void 0, function* () {
        let info = yield ytdl_core_1.default.getInfo(song.url);
        if (song.isLive) {
            const format = ytdl_core_1.default.chooseFormat(info.formats, { quality: [128, 127, 120, 96, 95, 94, 93] });
            return format.url;
        }
        else
            return ytdl_core_1.default.downloadFromInfo(info, { filter: 'audioonly' });
    });
    const player = (0, voice_1.createAudioPlayer)();
    const resource = (0, voice_1.createAudioResource)(yield stream());
    songQueue.connection.subscribe(player);
    player.play(resource);
    player.on(voice_1.AudioPlayerStatus.Idle, () => {
        songQueue.songs.shift();
        (0, exports.videoPlayer)(guild, songQueue.songs[0]);
    });
    yield songQueue.text_channel.send(`Now playing: **${song.title}** :musical_note:`);
});
exports.videoPlayer = videoPlayer;
const play = {
    name: 'play',
    aliases: ['p'],
    description: 'Plays a song from YouTube',
    execute: (message, args, cmd, client) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        if (!message.guild)
            return;
        const voiceChannel = (_a = message.member) === null || _a === void 0 ? void 0 : _a.voice.channel;
        if (!voiceChannel)
            return message.channel.send('You need to be in a voice channel to use this command!');
        const permissions = voiceChannel.permissionsFor(message.member);
        if (!permissions.has('CONNECT'))
            return message.channel.send(`You don't have persmission to do that`);
        const serverQueue = queue_1.default.get((_b = message.guild) === null || _b === void 0 ? void 0 : _b.id);
        if (!args.length)
            return message.channel.send('You need to provide a song name or URL to play!');
        let url = '';
        ytdl_core_1.default.validateURL(args[0]) ? (url = args[0]) : (url = yield videoFinder(args.join(' ')));
        const songData = (yield ytdl_core_1.default.getInfo(url)).videoDetails;
        if (!songData)
            return message.channel.send('Could not find any songs :(');
        const song = {
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
            const connection = (0, voice_1.joinVoiceChannel)({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guildId,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            });
            const queueConstructor = {
                voice_channel: voiceChannel,
                text_channel: message.channel,
                connection,
                songs: [],
            };
            queue_1.default.set((_c = message.guild) === null || _c === void 0 ? void 0 : _c.id, queueConstructor);
            queueConstructor.songs.push(song);
            (0, exports.videoPlayer)(message.guild, queueConstructor.songs[0]);
        }
        catch (err) {
            queue_1.default.delete((_d = message.guild) === null || _d === void 0 ? void 0 : _d.id);
            message.channel.send('Error joining the voice channel');
            throw err;
        }
    }),
};
exports.default = play;
