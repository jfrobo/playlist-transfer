export function cleanArtist(channel) {
    if (!channel) return "";
    // Entfernt " - Topic" nur, wenn es am Ende des Namens steht (durch $).
    return channel.replace(/ - Topic$/, "").trim();
}