import mongoose from 'mongoose';
import { Album } from './Album.js';

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

/** Pre-save and pre-update hooks to prevent artist and album changes */
songSchema.pre('save', function(next) {
    if(!this.isNew && this.isModified('artist')) {
        return next(new Error('Artist cannot be changed'));
    }
    next();
});

// Make sure album has same artist as song
songSchema.pre('save', async function(next) {
    if(!this.album) {
        return next()
    }
    const album = await Album.findById(this.album);
    if(this.artist !== album?.artist) {
        return next(new Error('Album must have same artist as song'));
    }
    next();
});

songSchema.pre(["find", "findOne"], function(next) {
    this.populate('artist').populate('album');
    next();
});

export const Song = mongoose.model('Song', songSchema);