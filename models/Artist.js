import mongoose from 'mongoose';
import { Song } from './Song.js';

const artistSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,
        trim: true,
        minLength: [3, 'Name must be at least 3 characters long'],
     },
}, { timestamps: true });

artistSchema.method('getSongCount', async function() {
    return await Song.countDocuments({ artist: this._id });
});

async function _artistCASCADE(doc) {
    await Song.deleteMany({ artist: doc._id });
    await Album.deleteMany({ artist: doc._id });
}

/** Delete all songs and albums associated with the artist */
artistSchema.post('deleteOne', { document: true }, async function(doc) {
    await _artistCASCADE(this);
});

artistSchema.post('deleteOne', { query: true }, async function(doc) {
    const id = this.getFilter()._id;
    await _artistCASCADE({_id: id});
});

export const Artist = mongoose.model('Artist', artistSchema);
