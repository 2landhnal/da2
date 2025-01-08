'use strict';
import mongoose from 'mongoose';
import { RoomStatus } from '../utils/roomStatus.js';

const DOCUMENT_NAME = 'Room';
const COLLECTION_NAME = 'Rooms';

const RoomSchema = new mongoose.Schema(
    {
        id: { type: String, unique: true, required: true },
        maxCapacity: { type: Number, required: true },
        status: {
            type: String,
            enum: Object.values(RoomStatus),
            default: RoomStatus.ACTIVE,
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamp: true,
    },
);

export default mongoose.model(DOCUMENT_NAME, RoomSchema);
