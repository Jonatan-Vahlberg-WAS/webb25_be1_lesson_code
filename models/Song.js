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
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

songSchema.virtual('artistName').get(function() {
    return this.artist?.name ?? null;
});

export const Song = mongoose.model('Song', songSchema);