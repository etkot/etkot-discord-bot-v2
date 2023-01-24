import { SlashCommandBuilder } from 'discord.js'
import { clearQueue, getConnection, leave, skip } from '../lib/voice/connection'
import type { Command } from '../types/command'
import { getVoiceChannel } from '../utils/getVoiceChannel'

export const command: Command = {
    data: new SlashCommandBuilder()
        .setName('abort')
        .setDescription('Stop the current song, clear the queue and leave the voice channel'),

    async execute(interaction) {
        const voiceChannel = getVoiceChannel(interaction)
        if (!voiceChannel) return

        getConnection(voiceChannel, true)
        clearQueue(voiceChannel)
        skip(voiceChannel)
        leave(voiceChannel)

        await interaction.reply('Aborted!')
    },
}
