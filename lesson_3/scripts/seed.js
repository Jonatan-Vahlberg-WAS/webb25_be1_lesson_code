import { readFile } from "fs/promises";
import { Artist } from "../models/Artist.js";
import { Song } from "../models/Song.js";

const ARTISTS_PATH = new URL("../data/artists.json", import.meta.url);
const SONGS_PATH = new URL("../data/songs.json", import.meta.url);

/** Returns a map of JSON artist id -> MongoDB ObjectId */
async function seedArtists() {
    const artistsRaw = await readFile(ARTISTS_PATH, "utf8");
    const artistsFromFile = JSON.parse(artistsRaw);

    if ((await Artist.countDocuments()) === 0) {
        const inserted = await Artist.insertMany(
            artistsFromFile.map(a => ({ name: a.name }))
        );
        console.log("Artists seeded");

        const idMap = {};
        artistsFromFile.forEach((a, i) => {
            idMap[a.id] = inserted[i]._id;
        });
        return idMap;
    }

    const artists = await Artist.find();
    const idMap = {};
    for (const a of artistsFromFile) {
        const artist = artists.find(db => db.name === a.name);
        if (artist) idMap[a.id] = artist._id;
    }
    return idMap;
}

async function seedSongs(artistIdMap) {
    if ((await Song.countDocuments()) === 0) {
        const songsRaw = await readFile(SONGS_PATH, "utf8");
        const songsFromFile = JSON.parse(songsRaw);

        const seedSongs = [];
        for (const song of songsFromFile) {
            const mongoArtistId = artistIdMap[song.artist];
            if (mongoArtistId) {
                const songTitle = song.title ?? song.name;
                if (songTitle) seedSongs.push({ title: songTitle, artist: mongoArtistId });
            }
        }
        await Song.insertMany(seedSongs);
        console.log("Songs seeded");
    }
}

async function seedIfEmpty() {
    const artistIdMap = await seedArtists();
    await seedSongs(artistIdMap);
}

export default seedIfEmpty;