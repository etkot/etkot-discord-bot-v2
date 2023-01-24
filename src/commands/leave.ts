import { SlashCommandBuilder } from 'discord.js'
import { getConnection, leave } from '../lib/voice/connection'
import type { Command } from '../types/command'
import { getVoiceChannel } from '../utils/getVoiceChannel'

export const command: Command = {
    data: new SlashCommandBuilder().setName('leave').setDescription('Leave the voice channel'),

    async execute(interaction) {
        const voiceChannel = getVoiceChannel(interaction)
        if (!voiceChannel) return

        getConnection(voiceChannel, true)
        leave(voiceChannel)
        await interaction.reply('See ya!')
    },
}
