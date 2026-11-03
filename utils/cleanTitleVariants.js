export function cleanTitleVariants(title) {
    let res = [title.trim()];
    res[1] = removeSquare(title).trim();
    res[2] = removeRound(title).trim();
    res[3] = removeRound(removeSquare(title)).trim();
    // Gibt die eindeutigen Varianten in Such-Reihenfolge zurück (Original zuerst, ...).
    // Duplikate fallen weg, daher 1-4 Einträge, nicht immer 4.
    return [...new Set(res)];
}

function removeRound(text) {
    return text.replace(/\s*\(.*?\)/g, "");
}

function removeSquare(text) {
    return text.replace(/\s*\[.*?\]/g, "");
}