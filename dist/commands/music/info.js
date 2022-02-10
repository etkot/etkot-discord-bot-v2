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
const info = {
    name: 'info',
    aliases: ['i'],
    description: 'Shows information about the current song',
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
        if (!serverQueue) {
            return message.channel.send(`Nyt meni kasetti sekasin`);
        }
        const songs = serverQueue.songs;
        const embed = new discord_js_1.MessageEmbed();
        embed.setTitle(songs[0].title);
        embed.setDescription(`${songs[0].url}\n\n**Duration: **${songs[0].length < 3600
            ? new Date(songs[0].length * 1000).toISOString().substr(14, 5) + ' min'
            : new Date(songs[0].length * 1000).toISOString().substr(11, 8) + ' h'}\n\n**Description:**\n${songs[0].description}`);
        return message.channel.send({ embeds: [embed] });
    }),
};
exports.default = info;
