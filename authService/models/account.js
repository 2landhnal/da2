'use strict';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { AccountStatus } from '../utils/accountStatus.js';
import { RoleCode } from '../utils/roleCode.js';
import { sendToQueue } from '../config/messageQueue/connect.js';

const DOCUMENT_NAME = 'Account';
const COLLECTION_NAME = 'Accounts';

const accountSchema = new mongoose.Schema(
    {
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        role: {
            type: String,
            enum: Object.values(RoleCode),
            required: true,
        },
        salt: { type: String, required: true },

        accountStatus: {
            type: String,
            enum: Object.values(AccountStatus),
            default: AccountStatus.ACTIVE,
        },

        // overlap
        uid: { type: String, required: true },
        avatar: { type: String, default: '' },
        fullname: { type: String, default: '' },
    },
    {
        collection: COLLECTION_NAME,
        timestamp: true,
    },
);

async function getHashedPassword(plainPassword, salt) {
    // --------------------------------------------------
    // Mã hóa mật khẩu
    // --------------------------------------------------
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    return hashedPassword;
}

accountSchema.pre('save', async function (next) {
    console.log('presave');
    if (!this.isModified('accountStatus')) {
        if (this.role === RoleCode.STUDENT) {
            sendToQueue(
                'student_syncStatus',
                JSON.stringify({
                    uid: this.uid,
                    accountStatus: this.accountStatus,
                }),
            );
        } else if (this.role === RoleCode.TEACHER) {
            sendToQueue(
                'teacher_syncStatus',
                JSON.stringify({
                    uid: this.uid,
                    accountStatus: this.accountStatus,
                }),
            );
        }
    }
    if (!this.isModified('password')) {
        console.log('not modified');
        return next();
    }
    console.log('modified');
    this.password = await getHashedPassword(this.password, this.salt);
    console.log('hashed');
    next();
});

export default mongoose.model(DOCUMENT_NAME, accountSchema);
