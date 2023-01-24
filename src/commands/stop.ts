import { SlashCommandBuilder } from 'discord.js'
import { clearQueue, skip } from '../lib/voice/connection'
import type { Command } from '../types/command'
import { getVoiceChannel } from '../utils/getVoiceChannel'

export const command: Command = {
    data: new SlashCommandBuilder().setName('stop').setDescription('Stop the current song and clear the queue'),

    async execute(interaction) {
        const voiceChannel = getVoiceChannel(interaction)
        if (!voiceChannel) return

        clearQueue(voiceChannel)
        skip(voiceChannel)
        await interaction.reply('Stopped the current song and cleared the queue!')
    },
}
