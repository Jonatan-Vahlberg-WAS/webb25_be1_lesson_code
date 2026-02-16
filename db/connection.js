import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

export async function connectToDb() {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
}

export async function disconnectFromDb() {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
}