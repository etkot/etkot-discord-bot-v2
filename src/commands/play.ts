import { SlashCommandBuilder } from 'discord.js'
import ytdl from 'ytdl-core'
import ytpl from 'ytpl'
import { addToQueue } from '../lib/voice/connection'
import { probeAndCreateResource } from '../lib/voice/probeAndCreateResource'
import { findPlaylists } from '../lib/ytdl/findPlaylists'
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
                .setDescription('Find video from youtube search')
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
                .setDescription('Add songs from youtube playlist url or id')
                .addStringOption((option) => option.setName('url').setDescription('Youtube playlist url'))
                .addStringOption((option) =>
                    option.setName('search').setDescription('Search term to find the playlist').setAutocomplete(true)
                )
        ),

    async execute(interaction) {
        const voiceChannel = getVoiceChannel(interaction)
        if (!voiceChannel) return

        const handlers = {
            url: async () => {
                const url = interaction.options.getString('url', true)

                if (!ytdl.validateURL(url)) {
                    return await interaction.reply('Invalid youtube url')
                }

                const readable = await videoUrlToReadable(url)
                const videoInfo = await ytdl.getInfo(url)
                const audioResource = await probeAndCreateResource(readable, videoInfo.videoDetails.title)
                addToQueue(voiceChannel, audioResource)
                return await interaction.reply({ content: `Added ${videoInfo.videoDetails.title} to queue!` })
            },
            search: async () => {
                const query = interaction.options.getString('query', true)

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
            playlist: async () => {
                const url = interaction.options.getString('url')
                const search = interaction.options.getString('search')

                if (!url && !search) {
                    return await interaction.reply({ content: 'No url or search term provided', ephemeral: true })
                }

                let finalUrl = undefined

                if (url?.startsWith('http')) {
                    finalUrl = url
                } else if (search?.startsWith('http')) {
                    finalUrl = search
                } else if (search) {
                    const playlists = await findPlaylists(search)
                    const playlist = playlists[0]
                    if (playlist) {
                        finalUrl = playlist.url
                    }
                }

                if (!finalUrl) {
                    return await interaction.reply({ content: 'No playlist found', ephemeral: true })
                }

                const playlist = await ytpl(finalUrl, { limit: 20 })
                const videos = playlist?.items || []
                await interaction.reply(`Started adding ${videos.length} songs to queue! This might take a while...`)

                for (const video of videos) {
                    const readable = await videoUrlToReadable(video.url)
                    const audioResource = await probeAndCreateResource(readable, video.title)
                    addToQueue(voiceChannel, audioResource)
                }
                return
            },
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
        const subcommand = interaction.options.getSubcommand()
        const handlers = {
            search: async () => {
                const query = interaction.options.getString('query') || 'Ilpo'
                const searchResults = await findVideos(query)
                return searchResults.map((video) => ({
                    name: video.title,
                    value: video.title,
                }))
            },
            playlist: async () => {
                const query = interaction.options.getString('search') || 'Ilpo'
                const searchResults = await findPlaylists(query)
                return searchResults.map((video) => ({
                    name: video.title,
                    value: video.url,
                }))
            },
        }

        type handlerKey = keyof typeof handlers
        if (subcommand in handlers) {
            const results = await handlers[subcommand as handlerKey]()
            return await interaction.respond(results)
        }
    },
}
