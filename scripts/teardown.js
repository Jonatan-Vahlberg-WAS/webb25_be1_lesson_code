import { connectToDb, disconnectFromDb } from "../db/connection.js";
import { Artist } from "../models/Artist.js";
import { Song } from "../models/Song.js";
import { Album } from "../models/Album.js";

async function teardown() {
  try {
  await connectToDb();
  await Song.deleteMany();
  await Artist.deleteMany();
    await Album.deleteMany();
    console.log("Database cleared");
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await disconnectFromDb();
  }
}

teardown();