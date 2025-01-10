'use strict';
import mongoose from 'mongoose';

const DOCUMENT_NAME = 'Enrollment';
const COLLECTION_NAME = 'Enrollments';

const ScheduleShema = new mongoose.Schema({
    startShift: { type: Number, required: true }, // 1-12
    endShift: { type: Number, required: true }, // 1-12
    dayOfWeek: { type: Number, required: true }, // 2-8
});

const EnrollmentSchema = new mongoose.Schema(
    {
        studentId: { type: String, required: true },
        classId: { type: String, required: true },
        semesterId: { type: String, required: true },
        schedule: { type: [ScheduleShema], required: true },
        courseCredit: { type: Number },
        courseName: { type: String },
        studentName: { type: String },
        studentUid: { type: String },
        studentAvatar: { type: String },
    },
    {
        collection: COLLECTION_NAME,
        timestamp: true,
    },
);

export default mongoose.model(DOCUMENT_NAME, EnrollmentSchema);
