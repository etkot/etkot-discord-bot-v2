import Discord from 'discord.js';
import { VoiceConnection } from '@discordjs/voice';
import { Audio } from '../types/music';

class Voice {
    voice_channel: Discord.VoiceBasedChannel | undefined;
    text_channel: Discord.TextBasedChannel | undefined;
    connection: VoiceConnection | undefined;
    audioQueue: Audio[] = [];
}

const voice = new Voice();

export default voice;
