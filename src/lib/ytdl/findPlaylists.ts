import ytsr from 'ytsr'

export async function findPlaylists(query: string) {
    const filters = await ytsr.getFilters(query)
    const playlistFilter = filters.get('Type')?.get('Playlist')

    const searchTerm = playlistFilter?.url || query
    const results = await ytsr(searchTerm, {
        limit: 5,
        gl: 'FI',
        hl: 'fi',
    })

    return results.items.filter((item) => item.type === 'playlist') as ytsr.Playlist[]
}
