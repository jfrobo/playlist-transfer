export async function searchTracks(token, query) {
    const url = new URL("https://api.spotify.com/v1/search");

    url.searchParams.set("q", query);
    url.searchParams.set("type", "track");
    url.searchParams.set("limit", 10);

    const response = await fetch(url, {
        headers: {"Authorization": `Bearer ${token}`},
    });

    const data = await response.json();

    if (!response.ok)
        throw new Error(data.error?.message)

    return data.tracks.items;
}