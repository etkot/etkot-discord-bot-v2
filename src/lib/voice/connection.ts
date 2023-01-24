import {
    AudioPlayerStatus,
    AudioResource,
    createAudioPlayer,
    entersState,
    getVoiceConnection,
    joinVoiceChannel,
    VoiceConnection,
    VoiceConnectionStatus,
} from '@discordjs/voice'
import type { VoiceBasedChannel } from 'discord.js'

export function getConnection(voiceChannel: VoiceBasedChannel, createIfNotFound: true): VoiceConnection
export function getConnection(voiceChannel: VoiceBasedChannel, createIfNotFound?: boolean): VoiceConnection | undefined
export function getConnection(
    voiceChannel: VoiceBasedChannel,
    createIfNotFound?: boolean
): VoiceConnection | undefined {
    const connection = getVoiceConnection(voiceChannel.guildId)

    if (!connection && createIfNotFound) {
        return createConnection(voiceChannel)
    }

    if (!connection && !createIfNotFound) {
        return undefined
    }

    if (connection && connection.joinConfig.channelId !== voiceChannel.id) {
        connection.destroy()
        return createConnection(voiceChannel)
    }

    return connection
}

export const createConnection = (voiceChannel: VoiceBasedChannel) => {
    const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guildId,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    })

    connection.on(VoiceConnectionStatus.Disconnected, async () => {
        try {
            await Promise.race([
                entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
            ])
            // Seems to be reconnecting to a new channel - ignore disconnect
        } catch (error) {
            // Seems to be a real disconnect which SHOULDN'T be recovered from
            connection.destroy()
            connection.player.stop()
        }
    })

    const player = createAudioPlayer()
    connection.subscribe(player)
    connection.player = player // So we can access the player later

    player.on('error', (error) => {
        console.error(error)
    })

    player.on(AudioPlayerStatus.Idle, () => {
        if (connection.queue.length) {
            playNext(voiceChannel)
        } else {
            connection.destroy()
        }
    })

    connection.queue = []
    return connection
}

export const addToQueue = (VoiceChannel: VoiceBasedChannel, audio: AudioResource<{ title: string }>) => {
    const connection = getConnection(VoiceChannel, true)
    connection?.queue.push(audio)

    if (connection?.player.state.status === 'idle') {
        playNext(VoiceChannel)
    }

    return connection
}

export const playNext = (voiceChannel: VoiceBasedChannel) => {
    const connection = getConnection(voiceChannel, true)
    const next = connection.queue.shift()

    if (next) {
        connection.player.play(next)
        connection.player.currentResource = next
    }
}

export const pause = (voiceChannel: VoiceBasedChannel) => {
    const connection = getConnection(voiceChannel)
    connection?.player.pause()
}

export const resume = (voiceChannel: VoiceBasedChannel) => {
    const connection = getConnection(voiceChannel)
    connection?.player.unpause()
}

export const clearQueue = (voiceChannel: VoiceBasedChannel) => {
    const connection = getConnection(voiceChannel)
    if (!connection) return

    connection.queue = []
}

export const skip = (voiceChannel: VoiceBasedChannel) => {
    const connection = getConnection(voiceChannel)
    connection?.player.stop()
}

export const leave = (voiceChannel: VoiceBasedChannel) => {
    const connection = getConnection(voiceChannel)
    connection?.destroy()
}
