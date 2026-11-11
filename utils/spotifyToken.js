// Holt ein app token von Spotify (Client Credentials flow)
export async function getSpotifyToken() {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    
    // "ID:Secret" in Base64-Schreibweise (keine Verschlüsselung), weil spotify das so braucht
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    // POST-Anfrage: wir schicken Daten mit und bekommen das Token zurück
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "content-type": "application/x-www-form-urlencoded", // sagt Spotify, in welchem Format der Body kommt
            "Authorization": `Basic ${credentials}`,             // unser Ausweis: das Wort "Basic" plus die Base64-Daten
            },
        // die eigentliche Bitte um ein Token für die App
        body: new URLSearchParams({grant_type: "client_credentials"})
    });
    
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error_description || data.error);
    }

    return data.access_token;
}