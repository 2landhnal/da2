const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseId: {
        type: String,
        required: true,
        unique: true,
    },
    courseName: {
        type: String,
        required: true,
    },
    courseCredit: {
        type: Number,
        required: true,
    },
});

courseSchema.pre('save', async function (next) {
    console.log('presave');
    this.courseId = this.courseId.toLowerCase();
    next();
});

module.exports = mongoose.model('Course', courseSchema);
