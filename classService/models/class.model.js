'use strict';
import mongoose from 'mongoose';
import { ClassStatus } from '../utils/classStatus.js';

const DOCUMENT_NAME = 'Class';
const COLLECTION_NAME = 'Classs';

const ScheduleShema = new mongoose.Schema({
    startShift: { type: Number, required: true }, // 1-12
    endShift: { type: Number, required: true }, // 1-12
    dayOfWeek: { type: Number, required: true }, // 2-8
});

const ClassSchema = new mongoose.Schema(
    {
        id: { type: String, unique: true, required: true },
        courseId: { type: String, required: true },
        roomId: { type: String, required: true },
        teacherId: { type: String, required: true },
        semesterId: { type: String, required: true },
        maxCapacity: { type: Number, required: true },
        schedule: { type: [ScheduleShema], required: true },
        teamCode: { type: String },
        courseName: { type: String },
        teacherName: { type: String },
        currentEnroll: { type: Number },
        status: {
            type: String,
            enum: Object.values(ClassStatus),
            default: ClassStatus.ACTIVE,
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamp: true,
    },
);

export default mongoose.model(DOCUMENT_NAME, ClassSchema);
