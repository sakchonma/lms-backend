const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    title: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    schedule: { type: String }, // Simplification for MVP
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Class', classSchema);
