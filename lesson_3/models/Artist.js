import mongoose from 'mongoose';

const artistSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,
        trim: true,
        minLength: [3, 'Name must be at least 3 characters long'],
     },
}, { timestamps: true });

export const Artist = mongoose.model('Artist', artistSchema);
