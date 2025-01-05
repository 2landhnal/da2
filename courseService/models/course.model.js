'use strict';
import mongoose from 'mongoose';
import { CourseStatus } from '../utils/couseStatus.js';

const DOCUMENT_NAME = 'Course';
const COLLECTION_NAME = 'Courses';

const CourseSchema = new mongoose.Schema(
    {
        id: { type: String, unique: true, required: true },
        credit: { type: Number, required: true },
        name: { type: String, default: '' },
        description: { type: String },
        documents: { type: String },
        status: {
            type: String,
            enum: Object.values(CourseStatus),
            default: CourseStatus.ACTIVE,
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamp: true,
    },
);

export default mongoose.model(DOCUMENT_NAME, CourseSchema);
