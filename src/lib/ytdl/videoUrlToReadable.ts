import ytdl from 'ytdl-core'

export async function videoUrlToReadable(url: string) {
    const video = ytdl(url, { quality: 'highestaudio', highWaterMark: 1 << 25 }) // 32MB

    video.on('error', (error) => {
        console.error(error)
    })

    return video
}
