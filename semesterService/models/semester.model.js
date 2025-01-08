'use strict';
import mongoose from 'mongoose';
import { SemesterStatus } from '../utils/semesterStatus.js';

const DOCUMENT_NAME = 'Semester';
const COLLECTION_NAME = 'Semesters';

const SemesterSchema = new mongoose.Schema(
    {
        id: { type: String, unique: true, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        status: {
            type: String,
            enum: Object.values(SemesterStatus),
            default: SemesterStatus.PROCESSING,
        },
        name: { type: String },
    },
    {
        collection: COLLECTION_NAME,
        timestamp: true,
    },
);

export default mongoose.model(DOCUMENT_NAME, SemesterSchema);
