export function slimTrack(track) {
    if (!track)
        return null;
    
    const slimedTrack = {
        uri: track.uri,
        name: track.name,
        artists: track.artists.map((a) => a.name),
        albumName: track.album.name,
        url: track.external_urls.spotify,
        image: track.album.images[1]?.url,
        durationMs: track.duration_ms,
    }

    return slimedTrack;
}