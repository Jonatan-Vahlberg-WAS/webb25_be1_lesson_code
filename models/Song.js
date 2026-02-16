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
    album: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album',
        required: false,
        default: null,
    },
    durationSeconds: {
        type: Number,
        required: false,
        default: null,
    },
    playcount: {
        type: Number,
        required: false,
        default: null,
    },
    listeners: {
        type: Number,
        required: false,
        default: null,
    },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

songSchema.virtual('artistName').get(function() {
    return this.artist?.name ?? null;
});

export const Song = mongoose.model('Song', songSchema);