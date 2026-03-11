const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    priority: { type: Number, default: 0 },
});

module.exports = mongoose.model('Section', sectionSchema);
