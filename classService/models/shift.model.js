'use strict';
import mongoose from 'mongoose';

const DOCUMENT_NAME = 'Shift';
const COLLECTION_NAME = 'Shifts';

const ShiftSchema = new mongoose.Schema(
    {
        id: { type: Number, unique: true, required: true },
        startAt: { type: String, required: true },
        endAt: { type: String, required: true },
    },
    {
        collection: COLLECTION_NAME,
        timestamp: true,
    },
);

export default mongoose.model(DOCUMENT_NAME, ShiftSchema);
