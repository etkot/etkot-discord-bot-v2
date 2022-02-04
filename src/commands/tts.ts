import { createAudioPlayer, createAudioResource, joinVoiceChannel } from '@discordjs/voice';
import * as googleTTS from 'google-tts-api';
import { Readable } from 'stream';
import Command from '../types/command';
import detectLanguage from '../utils/detectLanguage';
import queue from '../utils/queue';

const validLangs = `ar-XA, ar-XA, ar-XA, ar-XA, bn-IN, bn-IN, en-GB, en-GB, en-GB, en-GB, en-GB, fr-CA, fr-CA, fr-CA, fr-CA, en-US, en-US, en-US, en-US, en-US, en-US, en-US, en-US, en-US, en-US, es-ES, es-ES, es-ES, fi-FI, gu-IN, gu-IN, ja-JP, ja-JP, ja-JP, ja-JP, kn-IN, kn-IN, ml-IN, ml-IN, sv-SE, sv-SE, sv-SE, sv-SE, sv-SE, ta-IN, ta-IN, tr-TR, tr-TR, tr-TR, tr-TR, tr-TR, ms-MY, ms-MY, ms-MY, ms-MY, pa-IN, pa-IN, pa-IN, pa-IN, cs-CZ, de-DE, de-DE, de-DE, de-DE, de-DE, de-DE, en-AU, en-AU, en-AU, en-AU, en-IN, en-IN, en-IN, en-IN, es-US, es-US, es-US, fr-FR, fr-FR, fr-FR, fr-FR, fr-FR, hi-IN, hi-IN, hi-IN, hi-IN, id-ID, id-ID, id-ID, id-ID, it-IT, it-IT, it-IT, it-IT, ko-KR, ko-KR, ko-KR, ko-KR, ru-RU, ru-RU, ru-RU, ru-RU, ru-RU, uk-UA, cmn-CN, cmn-CN, cmn-CN, cmn-CN, cmn-TW, cmn-TW, cmn-TW, da-DK, da-DK, da-DK, da-DK, el-GR, fil-PH, fil-PH, fil-PH, fil-PH, hu-HU, nb-NO, nb-NO, nb-NO, nb-NO, nb-NO, nl-BE, nl-BE, nl-NL, nl-NL, nl-NL, nl-NL, nl-NL, pt-PT, pt-PT, pt-PT, pt-PT, sk-SK, vi-VN, vi-VN, vi-VN, vi-VN, pl-PL, pl-PL, pl-PL, pl-PL, pl-PL, pt-BR, pt-BR, ro-RO, th-TH, bn-IN, bn-IN, en-IN, en-IN, en-IN, en-IN, gu-IN, gu-IN, hi-IN, hi-IN, hi-IN, hi-IN, kn-IN, kn-IN, ml-IN, ml-IN, ta-IN, ta-IN, te-IN, te-IN, pa-IN, pa-IN, pa-IN, pa-IN, af-ZA, bg-BG, hu-HU, lv-LV, ro-RO, sk-SK, sr-RS, uk-UA, pl-PL, pl-PL, pl-PL, pl-PL, pl-PL, tr-TR, tr-TR, tr-TR, tr-TR, tr-TR, da-DK, da-DK, da-DK, da-DK, fi-FI, is-IS, nb-NO, nb-NO, nb-NO, nb-NO, nb-NO, pt-PT, pt-PT, pt-PT, pt-PT, sv-SE, sv-SE, sv-SE, sv-SE, sv-SE, fr-FR, fr-FR, fr-FR, fr-FR, de-DE, de-DE, de-DE, de-DE, de-DE, de-DE, fr-CA, fr-CA, fr-CA, fr-CA, it-IT, it-IT, it-IT, en-AU, en-AU, en-AU, en-AU, en-GB, en-GB, en-GB, en-GB, en-GB, cs-CZ, el-GR, pt-BR, pt-BR, es-US, es-US, es-US, ms-MY, ms-MY, ms-MY, ms-MY, id-ID, id-ID, id-ID, id-ID, nl-BE, nl-BE, nl-NL, nl-NL, nl-NL, nl-NL, nl-NL, fil-PH, fil-PH, fil-PH, fil-PH, yue-HK, yue-HK, yue-HK, yue-HK, cmn-CN, cmn-CN, cmn-CN, cmn-CN, ja-JP, ja-JP, ja-JP, ja-JP, cmn-TW, cmn-TW, cmn-TW, ko-KR, ko-KR, ko-KR, ko-KR, vi-VN, vi-VN, vi-VN, vi-VN, ar-XA, ar-XA, ar-XA, ar-XA, fr-FR, it-IT, ru-RU, ru-RU, ru-RU, ru-RU, ru-RU, en-US, en-US, en-US, en-US, en-US, en-US, en-US, en-US, en-US, en-US, ca-ES, es-ES, es-ES, es-ES, es-ES`;

const tts: Command = {
    name: 'tts',
    aliases: ['text-to-speech', 'speak', 'say'],
    description: 'Speaks a message in your voice channel',
    execute: async (message, args) => {
        if (!message.guild) return;

        const voiceChannel = message.member?.voice.channel;
        if (!voiceChannel) return message.channel.send('You need to be in a voice channel to use this command!');

        const permissions = voiceChannel.permissionsFor(message.member);
        if (!permissions.has('CONNECT')) return message.channel.send(`You don't have persmission to do that`);

        if (!args.length) return message.channel.send('You need to provide text for the bot to say!');

        // Google TTS API is limited to 200 characters per request
        args.slice(199);
        const text: string = args.join(' ');

        const lang = await detectLanguage(text);
        const base64 = await googleTTS.getAudioBase64(text, {
            lang: validLangs.includes(lang) ? lang : 'fi',
            slow: false,
            host: 'https://translate.google.com',
            timeout: 10000,
        });

        const buffer = Buffer.from(base64, 'base64');
        const stream = Readable.from(buffer);

        try {
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

            message.reply(`"${text}" has been announced`).catch(console.error);
        } catch (err) {
            message.channel.send('Homma meni wilduks :(');
            throw err;
        }
    },
};

export default tts;
