import { Song } from "../models/Song.js";

export async function getAllSongs() {
  const songs = await Song.find().populate("artist");
  return songs;
}

export async function getSongById(id) {
  const song = await Song.findById(id).populate("artist");
  if(!song) return null;
  return song
}

export async function createSong(name, artistId) {
  const song = new Song({
    name,
    artist: artistId
  }).populate("artist");

  await song.save();
  return song
}

export async function updateSong(id, name, artistId) {
  const song = await Song.findByIdAndUpdate(id, { name, artist: artistId }, { new: true }).populate("artist");
  return song ? song : null;
}

export async function deleteSong(id) {
  const result = await Song.deleteOne({ _id: id });
  return result.deletedCount === 1;
}
