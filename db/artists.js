import fs from 'fs/promises';

const DATA_PATH = new URL('../data/artists.json', import.meta.url);

function getLastId(artists) {
    return artists.length > 0 ? artists[artists.length - 1].id : 0;
}

async function readArtists() {
    const data = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(data);
}

async function writeArtists(artists) {
    await fs.writeFile(DATA_PATH, JSON.stringify(artists, null, 2));
}

export async function getAllArtists() {
    const artists = await readArtists();
    console.log("Artists:", artists);
    return artists;
}

export async function getArtistById(id) {
    const artists = await readArtists();
    return artists.find(artist => artist.id === id) || null;
}

export async function createArtist(name) {
    const artists = await readArtists();
    const lastId = getLastId(artists);
    const artist = { id: lastId + 1, name };
    artists.push(artist);
    await writeArtists(artists);
    return artist;
}

export async function updateArtist(id, name) {
    const artists = await readArtists();
    const artistIndex = artists.findIndex(artist => artist.id === id);
    if (artistIndex === -1) {
        return null;
    }
    artists[artistIndex].name = name;
    await writeArtists(artists);
    return artists[artistIndex];
}

export async function deleteArtist(id) {
    const artists = await readArtists();
    const artistIndex = artists.findIndex(artist => artist.id === id);
    if (artistIndex === -1) {
        return null;
    }
    const deletedArtist = artists.splice(artistIndex, 1)[0];
    await writeArtists(artists);
    return deletedArtist;
}