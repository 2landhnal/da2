import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const saltRound = 10;
const refreshTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
});
refreshTokenSchema.pre('save', async function (next) {
    console.log('presave');
    if (!this.isModified('token')) {
        console.log('not modified');
        return next();
    }
    console.log('modified');
    this.token = await hashWithSalt(this.token, saltRound);
    next();
});
const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

async function hashWithSalt(password, saltRound) {
    return bcrypt.hash(password, saltRound);
}

const findHashedToken = async function (plainToken) {
    // Use the model `RefreshToken` to query the database
    const tokens = await RefreshToken.find();

    for (const tokenDoc of tokens) {
        console.log(tokenDoc.token);
        const isMatch = await bcrypt.compare(plainToken, tokenDoc.token);
        if (isMatch) {
            return tokenDoc.token; // Valid token found
        }
    }
    console.log('cant find the hashed token equavalent');
    return null; // No match found
};

export { RefreshToken, findHashedToken };
