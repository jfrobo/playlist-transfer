export async function searchTracks(token, query, onWait, attempts = 0) {
    if (attempts > 5)
        throw new Error("Zu viele Versuche von Suchanfrage für einen Track");
    
    const url = new URL("https://api.spotify.com/v1/search");

    url.searchParams.set("q", query);
    url.searchParams.set("type", "track");
    url.searchParams.set("limit", 10);

    const response = await fetch(url, {
        headers: {"Authorization": `Bearer ${token}`},
    });

    // Status 429 bedeutet zu viele Anfragen an Spotify geschickt
    // Im Header Retry-After steht, wie viele sek warten 
    // Diesen Status abfangen, warten und nochmal versuchen
    // extra: Wartezeit nach außen mitgeben 
    if (response.status === 429) {
        const retryAfter = Number(response.headers.get("Retry-After")) || 1;
        if (retryAfter > 120)
            throw new Error("Spotify blockiert wegen zu vielen Suchanfragen in kurzer Zeit und die Wartezeit ist zu lang.")

        onWait?.(retryAfter);
        
        // Pause: baut ein Versprechen, das erst erfüllt ist, wenn jemand resolve() aufruft.
        // setTimeout(resolve, ms) ruft genau das nach der angegebenen Zeit auf
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));

        // versuche erneut den einzelnen Track (nicht ganze PL) und gibt das ergebnis zurück
        attempts += 1;
        return await searchTracks(token, query, onWait, attempts);
    }

    const data = await response.json();

    if (!response.ok)
        throw new Error(data.error?.message)

    return data.tracks.items;
}