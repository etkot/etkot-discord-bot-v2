import { getVoiceConnection } from '@discordjs/voice'
import { SlashCommandBuilder } from 'discord.js'
import type { Command } from '../types/command'
import { getVoiceChannel } from '../utils/getVoiceChannel'

export const command: Command = {
    data: new SlashCommandBuilder().setName('queue').setDescription('Show the current queue'),

    async execute(interaction) {
        const voiceChannel = getVoiceChannel(interaction)
        if (!voiceChannel) return

        const connection = getVoiceConnection(voiceChannel.guildId)
        if (!connection) {
            await interaction.reply('There is no queue!')
            return
        }

        const queue = connection.queue
        const currentSong = connection.player.currentResource
        const queueList = queue.map((resource, index) => `${index + 1}. ${resource.metadata.title}`).join('\n')

        await interaction.reply({
            embeds: [
                {
                    title: 'Queue',
                    description: `Now playing: ${currentSong?.metadata.title || 'Nothing'}\n\n${queueList}`,
                    footer: {
                        text: `Total songs: ${queue.length}`,
                    },
                },
            ],
        })
    },
}
