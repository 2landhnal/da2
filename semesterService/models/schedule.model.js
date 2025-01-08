'use strict';
import mongoose from 'mongoose';

const DOCUMENT_NAME = 'Schedule';
const COLLECTION_NAME = 'Schedules';

const TimeSlotSchema = new mongoose.Schema({
    startAt: { type: String, required: true }, // "HH:mm"
    endAt: { type: String, required: true }, // "HH:mm"
    allowance: { type: [String], default: [] }, // Giá trị mặc định
});

const ScheduleSchema = new mongoose.Schema(
    {
        _id: { type: String },
        id: { type: String, required: true },
        semesterId: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        timeSlots: { type: [TimeSlotSchema], default: [] },
    },
    {
        collection: COLLECTION_NAME,
        timestamp: true,
    },
);

ScheduleSchema.pre('save', function (next) {
    this._id = `${this.semesterId}_${this.id}`;
    next();
});

export default mongoose.model(DOCUMENT_NAME, ScheduleSchema);
