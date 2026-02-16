import fs from 'fs/promises';

const DATA_PATH = new URL('../data/songs.json', import.meta.url);

function getLastId(songs) {
    return songs.length > 0 ? songs[songs.length - 1].id : 0;
}

async function readSongs() {
    const data = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(data);
}

async function writeSongs(songs) {
    await fs.writeFile(DATA_PATH, JSON.stringify(songs, null, 2));
}

export async function getAllSongs() {
    const songs = await readSongs();
    return songs;
}

export async function getSongById(id) {
    const songs = await readSongs();
    return songs.find(song => song.id === id) || null;
}

export async function createSong(title, artist) {
    const songs = await readSongs();
    const lastId = getLastId(songs);
    const newSong = { id: lastId + 1, title, artist };
    songs.push(newSong);
    await writeSongs(songs);
    return newSong;
}

export async function updateSong(id, title, artist) {
    const songs = await readSongs();
    const songIndex = songs.findIndex(song => song.id === id);
    if (songIndex === -1) {
        return null;
    }
    songs[songIndex].title = title;
    songs[songIndex].artist = artist;
    await writeSongs(songs);
    return songs[songIndex];
}

export async function deleteSong(id) {
    const songs = await readSongs();
    const songIndex = songs.findIndex(song => song.id === id);
    if (songIndex === -1) {
        return null;
    }
    const deletedSong = songs.splice(songIndex, 1)[0];
    await writeSongs(songs);
    return deletedSong;
}