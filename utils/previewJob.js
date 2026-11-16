import { randomUUID } from "node:crypto";
import { fetchYoutubePlaylist } from "./youtube.js";
import { getSpotifyToken } from "./spotifyToken.js";
import { findOnSpotify } from "./findOnSpotify.js";
import { slimTrack } from "./slimTrack.js";

// All jobs live in memory (gone after server restart)
export const jobs = new Map();

export function createJob() {
    const job = {
        id: randomUUID(),       // unique id, z.B. "3b241101-e2bb-..."
        status: "running",      // running | done | error 
        total: 0,
        done: 0,
        current: null,          // Titel des Songs der gerade gesucht wird
        message: "Lade YouTube-Playlist …",
        stats: { rateLimited: 0, waitedSeconds: 0},
        startedAt: Date.now(),
        finishedAt: null,
        results: [],
    };
    jobs.set(job.id, job);
    return job;
}

export async function runPreviewJob(job, playlistId) {
    try {
        const ytTrackList = await fetchYoutubePlaylist(playlistId);
        job.total = ytTrackList.length;

        const spotifyToken = await getSpotifyToken();

        // einmal vor der Schleife definieren: sagt dem job warum wir warten
        const onWait = (seconds) => { 
            job.message = `Spotify bremst, warte ${seconds} s`;
            job.stats.rateLimited++;
            job.stats.waitedSeconds += seconds;
        }

        for (const track of ytTrackList) {
            job.current = track.title;
            job.message = "Suche auf Spotify"
            
            const result = await findOnSpotify(spotifyToken, track.artist, track.variants, onWait);
            
            job.results.push({ 
                youtube: track, 
                track: slimTrack(result.track), 
                score: result.score,
                matched: result.matched, 
                query: result.query,
            });
            job.done++; 
        }

        
        job.status = "done";
        job.message = "Fertig";
    } catch (error) {
        // keiner wartet für diese funktion, also müssen errors hier abgefangen werden
        job.status = "error";
        job.message = error.message;
    } finally {
        job.finishedAt = Date.now();
    }
}