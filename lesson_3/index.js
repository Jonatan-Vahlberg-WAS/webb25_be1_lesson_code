import { connectToDb, disconnectFromDb } from './db/connection.js';
import seedIfEmpty from './scripts/seed.js';
import { getAllArtists, createArtist } from './db/artists.js';

async function main() {
    try {
        await connectToDb();
        await seedIfEmpty();
    } catch (error) {
        console.error('Error:', error);
    }

    try {
        const allArtists = await getAllArtists();
        console.log("All artists:", allArtists);

        const newArtist = await createArtist('Taylor Swifter');
        console.log("New artist created:", newArtist);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await disconnectFromDb();
    }
}

main();