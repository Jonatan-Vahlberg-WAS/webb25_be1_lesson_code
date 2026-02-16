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

export const Artist = mongoose.model('Artist', artistSchema);
