import { Album } from "../models/Album.js";

export async function getAllAlbums() {
  const albums = await Album.find().populate("artist");
  return albums;
}

export async function getAlbumById(id) {
  const album = await Album.findById(id).populate("artist");
  if(!album) return null;
  return album
}

export async function createAlbum(title, artistId) {
  const album = new Album({
    title,
    artist: artistId
  }).populate("artist");

  await album.save();
  return album
}

export async function updateAlbum(id, title, artistId) {
  const album = await Album.findByIdAndUpdate(id, { title, artist: artistId }, { new: true }).populate("artist");
  return album ? album : null;
}

export async function deleteAlbum(id) {
  const result = await Album.deleteOne({ _id: id });
  return result.deletedCount === 1;
}
