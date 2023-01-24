import { SlashCommandBuilder } from 'discord.js'
import { resume } from '../lib/voice/connection'
import type { Command } from '../types/command'
import { getVoiceChannel } from '../utils/getVoiceChannel'

export const command: Command = {
    data: new SlashCommandBuilder().setName('resume').setDescription('Resume the current song'),

    async execute(interaction) {
        const voiceChannel = getVoiceChannel(interaction)
        if (!voiceChannel) return

        resume(voiceChannel)
        await interaction.reply('Resumed the current song!')
    },
}
