let artists = [
    { id: 1, name: 'Bad Bunny' },
    { id: 2, name: 'Zara Larsson' },
    { id: 3, name: 'Radiohead' },
];

export function getAllArtists() {
    return artists;
}

export function getArtistById(id) {
    return artists.find(artist => artist.id === id);
}

export function createArtist(name) {
    const lastId = artists.length > 0 ? artists[artists.length - 1].id : 0;
    const artist = { id: lastId + 1, name };
    artists.push(artist);
    return artist;
}

export function updateArtist(id, name) {
    const artist = getArtistById(id);
    if (!artist) {
        return null;
    }
    artist.name = name;
    return artist;
}

export function deleteArtist(id) {
    const artist = artists.find(artist => artist.id === id);
    if (!artist) {
        return null;
    }
    artists.splice(artists.indexOf(artist), 1);
    return true;
}