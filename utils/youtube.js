import "dotenv/config";
import { cleanTitleVariants } from "./cleanTitleVariants.js";
import { cleanArtist } from "./cleanArtist.js";

// alle tracks einer YT-playlist laden, Seite für Seite
export async function fetchYoutubePlaylist(playlistId) {
    const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");

    url.searchParams.set("part", "snippet");
    url.searchParams.set("playlistId", playlistId);
    url.searchParams.set("maxResults", "50");
    url.searchParams.set("key", process.env.YOUTUBE_API_KEY);

    let pageToken = undefined;
    let allTracks = [];

    do {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message);
        }

        // gelöschte Videos rausfiltern
        const validItems = data.items.filter(
            (item) => 
                item.snippet.title !== "Deleted video" &&
                item.snippet.title !== "Private video"
        );

        // Keep only what we need later fpr the Spotify search
        allTracks = allTracks.concat(validItems.map((item) => ({
            title: item.snippet.title,          // Orignal lassen für anzeigen und logs
            artist: cleanArtist(item.snippet.videoOwnerChannelTitle),
            variants: cleanTitleVariants(item.snippet.title),
        })));

        if (data.nextPageToken){
            pageToken = data.nextPageToken;
            url.searchParams.set("pageToken", pageToken);
            
        } else {
            pageToken = undefined;
        }

    } while (pageToken != undefined)

    return allTracks;
}