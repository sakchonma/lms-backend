const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
    title: { type: String, required: true },
    videoUrl: { type: String },
    content: { type: String },
    type: { type: String, enum: ['video', 'text'], default: 'video' },
    priority: { type: Number, default: 0 },
});

module.exports = mongoose.model('Lesson', lessonSchema);
