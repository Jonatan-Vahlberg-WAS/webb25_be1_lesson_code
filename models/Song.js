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
    genres: {
        type: [String],
        required: false,
        enum: ['rock', 'pop', 'hip-hop', 'electronic', 'country', 'latin', 'jazz', 'blues', 'soul', 'funk', 'reggae', 'salsa', 'merengue', 'samba', 'bossa nova', 'latin jazz', 'latin soul', 'latin funk', 'latin salsa', 'latin merengue', 'latin samba', 'latin bossa nova', 'latin latin jazz', 'latin latin soul', 'latin latin funk', 'latin latin salsa', 'latin latin merengue', 'latin latin samba', 'latin latin bossa nova'],
    },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

songSchema.virtual('artistName').get(function() {
    return this.artist?.name ?? null;
});

/** Pre-save hooks to prevent artist and album changes */
songSchema.pre('save', function() {
    if (!this.isNew && this.isModified('artist')) {
        throw new Error('Artist cannot be changed');
    }
});

songSchema.pre('save', async function() {
    if (!this.album) return;
    const album = await Album.findById(this.album);
    if (album && !this.artist.equals(album.artist)) {
        throw new Error('Album must have same artist as song');
    }
});

songSchema.pre(["find", "findOne"], function() {
    this.populate('artist').populate('album');
});

export const Song = mongoose.model('Song', songSchema);