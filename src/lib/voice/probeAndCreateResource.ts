import { createAudioResource, demuxProbe } from '@discordjs/voice'
import type { Readable } from 'node:stream'

export async function probeAndCreateResource(readableStream: Readable, title: string) {
    const { stream, type } = await demuxProbe(readableStream)
    return createAudioResource(stream, { inputType: type, metadata: { title } })
}
