import '@discordjs/voice'
import type { AudioResource } from '@discordjs/voice'
import type { Collection } from 'discord.js'
import type { Command } from './types/command'

declare module 'discord.js' {
    export interface Client {
        commands: Collection<string, Command>
    }
}

declare module '@discordjs/voice' {
    export interface VoiceConnection {
        queue: AudioResource<{ title: string }>[]
        player: AudioPlayer
    }

    export interface AudioPlayer {
        currentResource?: AudioResource<{ title: string }>
    }
}
