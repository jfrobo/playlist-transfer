// Das Backend

import "dotenv/config"; // liest .env ein und stellt die Werte unter process.env bereit.
import express from "express";

const app = express();
const PORT = process.env.Port || 3000;
// process.env.Port brauche ich später für Render, gibt den Port selber vor. Lokal nehme ich 3000.

// Gebe alles in /public dem browser
app.use(express.static("public"));

// Erste API route: lässt uns checken dass der server ok ist
app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.listen(PORT, () => {
    console.log(`Server löuft auf http://127.0.0.1:${PORT}`);
});