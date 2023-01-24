import ytsr from 'ytsr'

export async function findVideos(query: string) {
    const filters = await ytsr.getFilters(query)
    const videoFilter = filters.get('Type')?.get('Video')

    const results = await ytsr(videoFilter?.url || query, {
        limit: 5,
        gl: 'FI',
        hl: 'fi',
    })

    return results.items.filter((item) => item.type === 'video') as ytsr.Video[]
}
