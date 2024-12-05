const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const saltRound = 10;

const validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

const accountSchema = new mongoose.Schema({
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please fill a valid email address',
        ],
    },
    role: {
        type: Number,
        default: 3,
    },
    // 1: admin
    // 2: teacher
    // 3: student
});

async function hashWithSalt(password, saltRound) {
    return bcrypt.hash(password, saltRound);
}

accountSchema.pre('save', async function (next) {
    console.log('presave');
    if (!this.isModified('password')) {
        console.log('not modified');
        return next();
    }
    console.log('modified');
    this.password = await hashWithSalt(this.password, saltRound);
    next();
});

accountSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Account', accountSchema);
