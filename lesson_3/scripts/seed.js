import fs from 'fs/promises';

import { Artist } from '../models/Artist.js';

const ARTISTS_PATH = new URL('../data/artists.json', import.meta.url);


async function seedIfEmpty() {
    const count = await Artist.countDocuments();
  
    if (count > 0) {
      console.log("Databasen innehåller redan data");
      return;
    }
  
    const raw = await fs.readFile(ARTISTS_PATH, "utf8");
    const artistsFromFile = JSON.parse(raw);
  
    const artistsToInsert = artistsFromFile.map(a => ({
      name: a.name
    }));
  
    await Artist.insertMany(artistsToInsert);
  
    console.log("Seedning klar");
  }

export default seedIfEmpty;