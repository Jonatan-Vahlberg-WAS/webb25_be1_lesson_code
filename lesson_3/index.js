import { connectToDb, disconnectFromDb } from './db/connection.js';
import seedIfEmpty from './scripts/seed.js';
import teardown from './scripts/teardown.js';
import { getAllArtists, createArtist } from './db/artists.js';
import { getAllSongs, createSong } from './db/songs.js';

async function main() {
    try {
        await connectToDb();
        await teardown();
        await seedIfEmpty();
    } catch (error) {
        console.error('Error:', error);
    }

    try {
        const allArtists = await getAllArtists();
        console.log("All artists:", allArtists.length);

        const newArtist = await createArtist('Taylor Swifter');
        console.log("New artist created:", newArtist);

        const allSongs = await getAllSongs();
        console.log("All songs:", allSongs.length);

        const newSong = await createSong('Bad blood', newArtist.id);
        console.log("New song created:", newSong);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await disconnectFromDb();
    }
}

main();