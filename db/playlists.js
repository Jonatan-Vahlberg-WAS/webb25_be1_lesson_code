import { Playlist } from "../models/Playlist.js";

export async function getAllPlaylists() {
  const playlists = await Playlist.find().populate("songs");
  return playlists;
}

export async function getPlaylistById(id) {
  const playlist = await Playlist.findById(id).populate("songs");
  if(!playlist) return null;
  return playlist
}

export async function createPlaylist(name, description) {
  const playlist = new Playlist({
    name,
    description,
    songs: []
  }).save();

  return playlist
}

export async function updatePlaylist(id, name, description) {
    const playlist = await Playlist.findByIdAndUpdate(id, { name, description }, { new: true }).populate("songs");
  return playlist ? playlist : null;
}

export async function addSongToPlaylist(playlistId, songId) {
  const playlist = await Playlist.findByIdAndUpdate(playlistId, { $push: { songs: songId } }, { new: true }).populate("songs");
  return playlist ? playlist : null;
}

export async function removeSongFromPlaylist(playlistId, songId) {
  const playlist = await Playlist.findByIdAndUpdate(playlistId, { $pull: { songs: songId } }, { new: true }).populate("songs");
  return playlist ? playlist : null;
}

export async function deletePlaylist(id) {
  const result = await Playlist.deleteOne({ _id: id });
  return result.deletedCount === 1;
}
