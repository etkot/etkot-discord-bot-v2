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
const queue_1 = __importDefault(require("../../utils/queue"));
const discord_js_1 = require("discord.js");
const musicQueue = {
    name: 'queue',
    aliases: ['q', 'list', 'songs'],
    description: 'Shows all songs currently in the queue',
    execute: (message, args, cmd, client) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        if (!message.guild)
            return;
        const voiceChannel = (_a = message.member) === null || _a === void 0 ? void 0 : _a.voice.channel;
        if (!voiceChannel)
            return message.channel.send('You need to be in a voice channel to use this command!');
        const permissions = voiceChannel.permissionsFor(message.member);
        if (!permissions.has('CONNECT'))
            return message.channel.send(`You don't have persmission to do that`);
        const serverQueue = queue_1.default.get((_b = message.guild) === null || _b === void 0 ? void 0 : _b.id);
        if (!serverQueue || serverQueue.songs.length === 1) {
            return message.channel.send(`There are no songs in the queue :(`);
        }
        const embed = new discord_js_1.MessageEmbed();
        embed.setTitle('Queue :musical_note:');
        const songs = serverQueue.songs;
        embed.setDescription(`Current song: **${songs[0].title}**\n\n${songs
            .map((song, index) => `${index + 1}) ${song.title}`)
            .join('\n')}`);
        return message.channel.send({ embeds: [embed] });
    }),
};
exports.default = musicQueue;
