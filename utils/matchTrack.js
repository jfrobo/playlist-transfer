const MIN_SCORE = 60;

// Gibt einem Spotify Treffer Punkte, wie gut er zu Artist und Titel aus der Suche passt
function scoreResTrack(spotifyTrack, artist, title) {
    const wantedArtist = artist.toLowerCase();
    const wantedTitle = title.toLowerCase();
    const foundTitle = spotifyTrack.name.toLowerCase();

    let score = 0;

    // Artist des Spotify Treffers ist gleich dem Artist aus Suchanfrage
    // 50 Punkte
    const artistMatches = spotifyTrack.artists.some(
            (a) => a.name.toLowerCase() === wantedArtist
        ); 
    if (artistMatches)
        score += 50;

    // Titel gestappelt prüfen: 1. exakt, 2. beginnt mit, 3. enthält
    if (foundTitle === wantedTitle) {
        score += 50;
    } else if (foundTitle.startsWith(wantedTitle)) {
        score += 30;
    } else if (foundTitle.includes(wantedTitle)) {
        score += 15;
    }

    return score;
}


// Gibt den Treffer mit dem höchsten MatchScore zurück, oder null
export function findBestMatch(resultTrackList, artist, title) {
    let best = null;
    let bestScore = 0;

    for (const track of resultTrackList) {
        const score = scoreResTrack(track, artist, title);
        if (score > bestScore) {
            best = track;
            bestScore = score;
        }
    }

    if (bestScore >= MIN_SCORE)
        return { track: best, score: bestScore};

    return null;
}

