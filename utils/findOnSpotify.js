import { searchTracks } from "./spotifySearch.js";
import { findBestMatch, MIN_SCORE } from "./matchTrack.js";

// Sucht einen Song mit allen Titel-Varianten, bis ein guter Treffer kommt
export async function findOnSpotify(token, artist, variants, onWait) {
    const compareTitle = variants.at(-1); // kürzeste variante

    let best = { track: null, score: 0, query: null };

    for (const variant of variants) {
        const query = `${variant} ${artist}`;

        const resTrackList = await searchTracks(token, query, onWait);
        const bestVariantMatch = findBestMatch(resTrackList, artist, variant);
        if (bestVariantMatch.score > best.score) {
            best = {track: bestVariantMatch.track, score: bestVariantMatch.score, query: query};
            if (best.score >= MIN_SCORE)
                return { track: best.track, score: best.score, matched: true, query: best.query};
        }
    }

    // nichts war gut
    return {track: best.track, score: best.score, matched: false, query: best.query};
}