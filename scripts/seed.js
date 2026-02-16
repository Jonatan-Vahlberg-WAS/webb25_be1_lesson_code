import { connectToDb } from "../db/connection.js";
import { readFile } from "fs/promises";
import { Artist } from "../models/Artist.js";
import { Song } from "../models/Song.js";
import { Album } from "../models/Album.js";

const DATA = new URL("../data", import.meta.url);

/** Loads and parses a JSON file from the data directory. */
const load = (file) => readFile(new URL(`../data/${file}`, import.meta.url), "utf8").then(JSON.parse);

/** Seeds artists from artists.json. Returns map of 1-based index → MongoDB ObjectId. */
async function seedArtists() {
    const names = await load("artists.json");
    const idMap = {};

    if ((await Artist.countDocuments()) === 0) {
        // Insert all artists; MongoDB preserves insertion order
        const inserted = await Artist.insertMany(names.map((name) => ({ name })));
        // Map file index (1-based) to MongoDB _id so albums/songs can reference by artistId
        names.forEach((_, i) => (idMap[i + 1] = inserted[i]._id));
        console.log("Artists seeded");
    } else {
        // DB already has artists – build map by matching name to preserve id alignment
        const artists = await Artist.find();
        names.forEach((name, i) => {
            const a = artists.find((db) => db.name === name);
            if (a) idMap[i + 1] = a._id;
        });
    }
    return idMap;
}

/** Seeds albums from albums.json. Returns map of 1-based index → MongoDB ObjectId. */
async function seedAlbums(artistIdMap) {
    const albums = await load("albums.json");
    const idMap = {};

    if ((await Album.countDocuments()) === 0) {
        const toInsert = [];
        const fileIndices = [];
        // Only insert albums whose artist exists in our map; track original file index per album
        albums.forEach((a, i) => {
            if (artistIdMap[a.artistId]) {
                toInsert.push({
                    title: a.title,
                    artist: artistIdMap[a.artistId],
                    releaseDate: a.releaseDate,
                });
                fileIndices.push(i + 1); // 1-based id used by songs.json albumId
            }
        });
        const inserted = await Album.insertMany(toInsert);
        // inserted order ≠ file order when some artists missing, so use fileIndices
        inserted.forEach((doc, i) => (idMap[fileIndices[i]] = doc._id));
        console.log("Albums seeded");
    } else {
        // Build map by matching file albums to DB (title + artist)
        const dbAlbums = await Album.find();
        albums.forEach((a, i) => {
            const match = dbAlbums.find(
                (db) => db.title === a.title && db.artist?.equals(artistIdMap[a.artistId])
            );
            if (match) idMap[i + 1] = match._id;
        });
    }
    return idMap;
}

/** Seeds songs from songs.json. Skips if any songs already exist. */
async function seedSongs(artistIdMap, albumIdMap) {
    if ((await Song.countDocuments()) > 0) return;

    const songs = await load("songs.json");
    const toInsert = songs
        // Skip songs whose artist isn't in our map (e.g. invalid artistId)
        .filter((s) => artistIdMap[s.artistId ?? s.artist])
        .map((s) => {
            const title = s.title ?? s.name;
            if (!title) return null;
            // Resolve JSON ids to MongoDB ObjectIds; albumId null/undefined → no album ref
            return {
                name: title,
                artist: artistIdMap[s.artistId ?? s.artist],
                album: s.albumId != null ? albumIdMap[s.albumId] : undefined,
                durationSeconds: s.durationSeconds ?? undefined,
                playcount: s.playcount ?? undefined,
                listeners: s.listeners ?? undefined,
            };
        })
        .filter(Boolean);

    await Song.insertMany(toInsert);
    console.log("Songs seeded");
}

/** Seeds artists, albums, and songs if collections are empty. Builds id maps for cross-references. */
export default async function seedIfEmpty() {
    await connectToDb();
    // Order matters: artists first (albums ref them), then albums (songs ref them)
    const artistIdMap = await seedArtists();
    const albumIdMap = await seedAlbums(artistIdMap);
    await seedSongs(artistIdMap, albumIdMap);
}
