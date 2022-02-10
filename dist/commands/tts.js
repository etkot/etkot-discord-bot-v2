"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const voice_1 = require("@discordjs/voice");
const googleTTS = __importStar(require("google-tts-api"));
const stream_1 = require("stream");
const detectLanguage_1 = __importDefault(require("../utils/detectLanguage"));
const queue_1 = __importDefault(require("../utils/queue"));
const validLangs = `
    ar-XA, ar-XA, ar-XA, ar-XA, bn-IN, bn-IN, en-GB, en-GB, en-GB, en-GB, en-GB, fr-CA, fr-CA, fr-CA, fr-CA, 
    en-US, en-US, en-US, en-US, en-US, en-US, en-US, en-US, en-US, en-US, es-ES, es-ES, es-ES, fi-FI, gu-IN, 
    gu-IN, ja-JP, ja-JP, ja-JP, ja-JP, kn-IN, kn-IN, ml-IN, ml-IN, sv-SE, sv-SE, sv-SE, sv-SE, sv-SE, ta-IN, 
    ta-IN, tr-TR, tr-TR, tr-TR, tr-TR, tr-TR, ms-MY, ms-MY, ms-MY, ms-MY, pa-IN, pa-IN, pa-IN, pa-IN, cs-CZ, 
    de-DE, de-DE, de-DE, de-DE, de-DE, de-DE, en-AU, en-AU, en-AU, en-AU, en-IN, en-IN, en-IN, en-IN, es-US, 
    es-US, es-US, fr-FR, fr-FR, fr-FR, fr-FR, fr-FR, hi-IN, hi-IN, hi-IN, hi-IN, id-ID, id-ID, id-ID, id-ID, 
    it-IT, it-IT, it-IT, it-IT, ko-KR, ko-KR, ko-KR, ko-KR, ru-RU, ru-RU, ru-RU, ru-RU, ru-RU, uk-UA, cmn-CN, 
    cmn-CN, cmn-CN, cmn-CN, cmn-TW, cmn-TW, cmn-TW, da-DK, da-DK, da-DK, da-DK, el-GR, fil-PH, fil-PH, fil-PH,
    fil-PH, hu-HU, nb-NO, nb-NO, nb-NO, nb-NO, nb-NO, nl-BE, nl-BE, nl-NL, nl-NL, nl-NL, nl-NL, nl-NL, pt-PT, pt-PT, 
    pt-PT, pt-PT, sk-SK, vi-VN, vi-VN, vi-VN, vi-VN, pl-PL, pl-PL, pl-PL, pl-PL, pl-PL, pt-BR, pt-BR, ro-RO, 
    th-TH, bn-IN, bn-IN, en-IN, en-IN, en-IN, en-IN, gu-IN, gu-IN, hi-IN, hi-IN, hi-IN, hi-IN, kn-IN, kn-IN, 
    ml-IN, ml-IN, ta-IN, ta-IN, te-IN, te-IN, pa-IN, pa-IN, pa-IN, pa-IN, af-ZA, bg-BG, hu-HU, lv-LV, ro-RO, 
    sk-SK, sr-RS, uk-UA, pl-PL, pl-PL, pl-PL, pl-PL, pl-PL, tr-TR, tr-TR, tr-TR, tr-TR, tr-TR, da-DK, da-DK, 
    da-DK, da-DK, fi-FI, is-IS, nb-NO, nb-NO, nb-NO, nb-NO, nb-NO, pt-PT, pt-PT, pt-PT, pt-PT, sv-SE, sv-SE, 
    sv-SE, sv-SE, sv-SE, fr-FR, fr-FR, fr-FR, fr-FR, de-DE, de-DE, de-DE, de-DE, de-DE, de-DE, fr-CA, fr-CA, 
    fr-CA, fr-CA, it-IT, it-IT, it-IT, en-AU, en-AU, en-AU, en-AU, en-GB, en-GB, en-GB, en-GB, en-GB, cs-CZ, 
    el-GR, pt-BR, pt-BR, es-US, es-US, es-US, ms-MY, ms-MY, ms-MY, ms-MY, id-ID, id-ID, id-ID, id-ID, nl-BE, 
    nl-BE, nl-NL, nl-NL, nl-NL, nl-NL, nl-NL, fil-PH, fil-PH, fil-PH, fil-PH, yue-HK, yue-HK, yue-HK, yue-HK, cmn-CN, 
    cmn-CN, cmn-CN, cmn-CN, ja-JP, ja-JP, ja-JP, ja-JP, cmn-TW, cmn-TW, cmn-TW, ko-KR, ko-KR, ko-KR, ko-KR, vi-VN, 
    vi-VN, vi-VN, vi-VN, ar-XA, ar-XA, ar-XA, ar-XA, fr-FR, it-IT, ru-RU, ru-RU, ru-RU, ru-RU, ru-RU, en-US, 
    en-US, en-US, en-US, en-US, en-US, en-US, en-US, en-US, en-US, ca-ES, es-ES, es-ES, es-ES, es-ES
`;
const regex = /[-[\]{}()*+?.,<>\\^$|#]/g;
const tts = {
    name: 'tts',
    aliases: ['text-to-speech', 'speak', 'say'],
    description: 'Speaks a message in your voice channel',
    execute: (message, args) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        if (!message.guild)
            return;
        const voiceChannel = (_a = message.member) === null || _a === void 0 ? void 0 : _a.voice.channel;
        if (!voiceChannel)
            return message.channel.send('You need to be in a voice channel to use this command!');
        const permissions = voiceChannel.permissionsFor(message.member);
        if (!permissions.has('CONNECT'))
            return message.channel.send(`You don't have persmission to do that`);
        if (!args.length)
            return message.channel.send('You need to provide text for the bot to say!');
        const argsLanguage = args[0];
        let argsLanguageIsValid = false;
        if (validLangs.includes(argsLanguage)) {
            args.shift();
            argsLanguageIsValid = true;
        }
        const text = args.join(' ').replace(regex, '\\$&').slice(0, 199);
        const detectedLang = yield (0, detectLanguage_1.default)(text);
        const lang = argsLanguageIsValid ? argsLanguage : validLangs.includes(detectedLang) ? detectedLang : 'fi';
        const base64 = yield googleTTS.getAudioBase64(text, {
            lang: lang,
            slow: false,
            host: 'https://translate.google.com',
            timeout: 10000,
        });
        const buffer = Buffer.from(base64, 'base64');
        const stream = stream_1.Readable.from(buffer);
        try {
            const player = (0, voice_1.createAudioPlayer)();
            const resource = (0, voice_1.createAudioResource)(stream);
            const serverQueue = queue_1.default.get((_b = message.guild) === null || _b === void 0 ? void 0 : _b.id);
            if (!serverQueue) {
                const connection = (0, voice_1.joinVoiceChannel)({
                    channelId: voiceChannel.id,
                    guildId: voiceChannel.guildId,
                    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                });
                connection.subscribe(player);
            }
            else {
                serverQueue.connection.subscribe(player);
            }
            player.play(resource);
            message.reply(`"${text}" has been announced`).catch(console.error);
        }
        catch (err) {
            message.channel.send('Homma meni wilduks :(');
            throw err;
        }
    }),
};
exports.default = tts;
