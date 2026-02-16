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

albumSchema.pre('save', function(next) {
    if(!this.isNew && this.isModified('artist')) {
        return next(new Error('Artist cannot be changed'));
    }
    next();
});
albumSchema.pre('findOneAndUpdate', function(next) {
    if(this.isModified('artist')) {
        return next(new Error('Artist cannot be changed'));
    }
    next();
});
export const Album = mongoose.model('Album', albumSchema);