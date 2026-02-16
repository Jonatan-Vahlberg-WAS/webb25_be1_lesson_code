import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,
        trim: true,
        minLength: [3, 'Name must be at least 3 characters long'],
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
    },
}, { timestamps: true });

export const Song = mongoose.model('Song', songSchema);