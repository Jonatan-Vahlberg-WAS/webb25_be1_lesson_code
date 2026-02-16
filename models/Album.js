import mongoose from 'mongoose';

const albumSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: [2, 'Title must be at least 3 characters long'],
        unique: true,
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
        required: true,
    },
    releaseDate: {
        type: Date,
        required: true,
    },
}, { timestamps: true });

albumSchema.pre('save', function() {
    if (!this.isNew && this.isModified('artist')) {
        throw new Error('Artist cannot be changed');
    }
});

albumSchema.pre('findOneAndUpdate', function() {
    if (this.getUpdate()?.artist) {
        throw new Error('Artist cannot be changed');
    }
});
export const Album = mongoose.model('Album', albumSchema);