import { createAudioPlayer, AudioPlayerStatus } from '@discordjs/voice';
import Discord from 'discord.js';
import { Audio } from '../types/music';
import voice from './voice';

const audioPlayer = async (resource: Audio, message: Discord.Message) => {
    if (!resource) {
        voice.connection?.disconnect();
        voice.audioQueue = [];
        return message.channel.send('No more audio in queue!');
    }

    try {
        const player = createAudioPlayer();
        voice.connection?.subscribe(player);
        player.play(voice.audioQueue[0].resource);

        if (voice.audioQueue[0].song) {
            // YTDL message
            await voice.text_channel?.send(`Now playing: **${voice.audioQueue[0].song.title}** :musical_note:`);
        } else {
            // TTS message
            message.reply(`"${voice.audioQueue[0].text}" has been announced`).catch(console.error);
        }

        // The audio player will emit an idle event when there are no more resources to play
        player.on(AudioPlayerStatus.Idle, () => {
            voice.audioQueue.shift();
            audioPlayer(voice.audioQueue[0], message);
        });
    } catch (err) {
        console.log('Error trying to play resource: ', err);

        // If there are more resources in the queue, try to play the next one
        if (voice.audioQueue) {
            voice.audioQueue.shift();
            audioPlayer(voice.audioQueue[0], message);
        }
    }
};

export default audioPlayer;
