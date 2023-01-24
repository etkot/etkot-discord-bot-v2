import { SlashCommandBuilder } from 'discord.js'
import { addToQueue } from '../lib/voice/connection'
import { probeAndCreateResource } from '../lib/voice/probeAndCreateResource'
import { findVideos } from '../lib/ytdl/findVideos'
import { videoUrlToReadable } from '../lib/ytdl/videoUrlToReadable'
import type { Command } from '../types/command'
import { getVoiceChannel } from '../utils/getVoiceChannel'

export const command: Command = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song from youtube!')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('search')
                .setDescription('Play a song or playlist from youtube search')
                .addStringOption((option) =>
                    option
                        .setName('query')
                        .setDescription('Youtube search query')
                        .setRequired(true)
                        .setAutocomplete(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('url')
                .setDescription('Play a song from youtube url or id')
                .addStringOption((option) => option.setName('url').setDescription('Youtube url').setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('playlist')
                .setDescription('Play a playlist from youtube url or id')
                .addStringOption((option) =>
                    option.setName('url').setDescription('Youtube playlist url').setRequired(true)
                )
        ),

    async execute(interaction) {
        const voiceChannel = getVoiceChannel(interaction)
        if (!voiceChannel) return

        const handlers = {
            url: async () => {},
            search: async () => {
                const query = interaction.options.getString('query', true) || 'Kissa ja koira laulaa 2'

                const videos = await findVideos(query)
                const video = videos[0]

                if (!video) {
                    return await interaction.reply({ content: 'No results found!', ephemeral: true })
                }

                const readable = await videoUrlToReadable(video.url)
                const audioResource = await probeAndCreateResource(readable, video.title)
                addToQueue(voiceChannel, audioResource)
                return await interaction.reply({ content: `Added ${video.title} to queue!` })
            },
            playlist: async () => {},
        }

        type handlerKey = keyof typeof handlers
        const subcommand = interaction.options.getSubcommand()
        if (subcommand in handlers) {
            await handlers[subcommand as handlerKey]()
        } else {
            interaction.reply({ content: 'Invalid subcommand', ephemeral: true })
        }
    },
    async autocomplete(interaction) {
        const query = interaction.options.getString('query', true) || 'Ilpo'
        const searchResults = await findVideos(query)

        const options = searchResults.map((video) => ({
            name: video.title,
            value: video.title,
        }))
        return await interaction.respond(options)
    },
}
