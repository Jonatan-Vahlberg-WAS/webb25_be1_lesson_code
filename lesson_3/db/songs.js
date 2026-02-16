import { Song } from "../models/Song.js";

export async function getAllSongs() {
  return await Song.find().populate("artist");
}

export async function getSongById(id) {
  const song = await Song.findById(id).populate("artist");
  return song || null;
}

export async function createSong(name, artistId) {
  const song = new Song({
    name,
    artist: artistId
  });

  await song.save();
  return song;
}

export async function updateSong(id, name, artistId) {
  const song = await Song.findByIdAndUpdate(id, { name, artist: artistId }, { new: true }).populate("artist");
  return song || null;
}

export async function deleteSong(id) {
  const result = await Song.deleteOne({ _id: id });
  return result.deletedCount === 1;
}
