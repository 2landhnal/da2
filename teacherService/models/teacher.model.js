'use strict';
import mongoose from 'mongoose';
import { AccountStatus } from '../utils/accountStatus.js';

const DOCUMENT_NAME = 'Teacher';
const COLLECTION_NAME = 'Teachers';

const GENDER = {
    MALE: 'male',
    FEMALE: 'female',
    DEFAULT: '',
};

const DEGREE = {
    ThS: 'ThS',
    TS: 'TS',
    PGS: 'PGS',
    GS: 'GS',
};

const TeacherSchema = new mongoose.Schema(
    {
        uid: { type: String, unique: true, required: true },
        email: { type: String, unique: true, required: true },
        fullname: { type: String, required: true },
        personalEmail: { type: String, required: true },
        yoj: { type: Number, default: () => new Date().getFullYear() },
        phone: { type: String, default: '' },
        address: { type: String, default: '' },
        dob: { type: Date, default: Date.now },
        gender: {
            type: String,
            enum: Object.values(GENDER),
        },
        avatar: { type: String, default: '' },
        degree: {
            type: String,
            enum: Object.values(DEGREE),
        },
        accountStatus: {
            type: String,
            enum: Object.values(AccountStatus),
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamp: true,
    },
);

export default mongoose.model(DOCUMENT_NAME, TeacherSchema);
