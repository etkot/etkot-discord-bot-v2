import { VoiceConnection } from '@discordjs/voice';
import Discord from 'discord.js';

export interface Song {
    title: string;
    url: string;
}

export interface Queue {
    voice_channel: Discord.VoiceBasedChannel;
    text_channel: Discord.TextBasedChannel;
    connection: VoiceConnection;
    songs: Song[];
}
