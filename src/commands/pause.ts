import { SlashCommandBuilder } from 'discord.js'
import { pause } from '../lib/voice/connection'
import type { Command } from '../types/command'
import { getVoiceChannel } from '../utils/getVoiceChannel'

export const command: Command = {
    data: new SlashCommandBuilder().setName('pause').setDescription('Pause the current song'),

    async execute(interaction) {
        const voiceChannel = getVoiceChannel(interaction)
        if (!voiceChannel) return

        pause(voiceChannel)
        await interaction.reply('Paused the current song!')
    },
}
