"use strict"
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import AccountStatus from '../utils/accountStatus';
import { roleCode } from '../utils/roleCode';

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
        role: {
            type: Number,
            enum: Object.values(roleCode),
            required: true,
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamp: true,
    },
);

async function getHashedPassword(plainPassword) {
    // --------------------------------------------------
    // Mã hóa mật khẩu
    // --------------------------------------------------
    const salt = this.salt;
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    return hashedPassword;
}

accountSchema.methods.comparePassword = async function (plainPassword) {
    if (!this.password || !this.salt) {
        throw new Error('Password or salt not found on document');
    }
    // Hash lại plainPassword với salt từ tài liệu
    const hashedPassword = await getHashedPassword(plainPassword);
    return hashedPassword === this.password;
};

accountSchema.pre('save', async function (next) {
    console.log('presave');
    if (!this.isModified('password')) {
        console.log('not modified');
        return next();
    }
    console.log('modified');
    this.password = await getHashedPassword(this.password);
    console.log('hashed');
    next();
});

export default mongoose.model(DOCUMENT_NAME, accountSchema);
