'use strict';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { AccountStatus } from '../utils/accountStatus.js';
import { RoleCode } from '../utils/roleCode.js';

const DOCUMENT_NAME = 'Student';
const COLLECTION_NAME = 'Students';

const GENDER = {
    MALE: 'male',
    FEMALE: 'female',
    DEFAULT: '',
};

const StudentSchema = new mongoose.Schema(
    {
        uid: { type: String, unique: true, required: true },
        email: { type: String, unique: true, required: true },
        fullname: { type: String, required: true },
        personalEmail: { type: String, required: true },
        yoa: { type: Number, default: () => new Date().getFullYear() },
        phone: { type: String, default: '' },
        address: { type: String, default: '' },
        dob: { type: Date, default: Date.now },
        gender: {
            type: String,
            enum: Object.values(GENDER),
        },
        avatar: { type: String, default: '' },
    },
    {
        collection: COLLECTION_NAME,
        timestamp: true,
    },
);

export default mongoose.model(DOCUMENT_NAME, StudentSchema);
