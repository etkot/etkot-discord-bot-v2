import { VoiceConnection } from '@discordjs/voice';
import Discord from 'discord.js';

export interface Song {
    title: string;
    url: string;
    isLive: boolean;
    description?: string;
    length: number;
}

export interface Queue {
    voice_channel: Discord.VoiceBasedChannel;
    text_channel: Discord.TextBasedChannel;
    connection: VoiceConnection;
    songs: Song[];
}
