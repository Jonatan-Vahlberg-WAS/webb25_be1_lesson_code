import { Artist } from "../models/Artist.js";
import { Song } from "../models/Song.js";

async function teardown() {
  await Song.deleteMany();
  await Artist.deleteMany();
  console.log("Database cleared");
}

export default teardown;