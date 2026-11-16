// Das Backend

import "dotenv/config"; // liest .env ein und stellt die Werte unter process.env bereit.
import express from "express";
import { fetchYoutubePlaylist } from "./utils/youtube.js";
import { jobs, createJob, runPreviewJob } from "./utils/previewJob.js";

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

    try {
        const tracks = await fetchYoutubePlaylist(req.params.id);
        res.json({ count: tracks.length, tracks });
    } catch (error) {
        res.status(502).json({ error: error.message });
        // 502 Bad Gateway: "Mein Server in Ordnung, aber der Dienst, 
        // bei dem ich nachgefragt habe, hat nicht richtig geantwortet."
    }
});

// Job starten
app.post("/api/preview/:playlistId", (req, res) => {
    const job = createJob();
    runPreviewJob(job, req.params.playlistId);
    res.status(202).json({ jobId: job.id });
});

// Stand abfragen: sucht den Job und schickt seinen Zustand zurück
app.get("/api/jobs/:id", (req, res) => {
    const job = jobs.get(req.params.id);
    if (!job)
        return res.status(404).json({ error: "Job nicht gefunden" });
    const { results, ...progress } = job;   // progess = job ohne "results"
    res.json(job.status === "running" ? progress : job);
})

app.listen(PORT, () => {
    console.log(`Server löuft auf http://127.0.0.1:${PORT}`);
});