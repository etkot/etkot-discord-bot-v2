import { SlashCommandBuilder } from 'discord.js'
import { skip } from '../lib/voice/connection'
import type { Command } from '../types/command'
import { getVoiceChannel } from '../utils/getVoiceChannel'

export const command: Command = {
    data: new SlashCommandBuilder().setName('skip').setDescription('Skip the current song'),

    async execute(interaction) {
        const voiceChannel = getVoiceChannel(interaction)
        if (!voiceChannel) return

        skip(voiceChannel)
        await interaction.reply('Skipped the current song!')
    },
}
