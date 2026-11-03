// Das Backend

import "dotenv/config"; // liest .env ein und stellt die Werte unter process.env bereit.
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;
// process.env.Port brauche ich später für Render, gibt den Port selber vor. Lokal nehme ich 3000.

// Gebe alles in /public dem browser
app.use(express.static("public"));

// Erste API route: lässt uns checken dass der server ok ist
app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

// Fetch all tracks of a YouTube (Music) playlist - go through all pages if exists where each page is 50 long
app.get("/api/youtube/playlist/:id", async (req, res) => {
    const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
    // :id im Pfad ist ein Platzhalter. Was dort in der URL steht, landet in req.params.id

    url.searchParams.set("part", "snippet");
    url.searchParams.set("playlistId", req.params.id);
    url.searchParams.set("maxResults", "50");
    url.searchParams.set("key", process.env.YOUTUBE_API_KEY);

    let pageToken = undefined;
    let allTracks = [];

    do {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: data.error?.message });
        }

        // Keep only what we need later fpr the Spotify search
        allTracks = allTracks.concat(data.items.map((item) => ({
            title: item.snippet.title,
            channel: item.snippet.videoOwnerChannelTitle,
        })));

        if (data.nextPageToken){
            pageToken = data.nextPageToken;
            url.searchParams.set("pageToken", pageToken);
            
        } else {
            pageToken = undefined;
        }

    } while (pageToken != undefined)

    res.json({ count: allTracks.length, tracks: allTracks });
});

app.listen(PORT, () => {
    console.log(`Server löuft auf http://127.0.0.1:${PORT}`);
});