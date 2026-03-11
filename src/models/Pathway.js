const mongoose = require('mongoose');

const pathwaySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    courses: [{
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        order: { type: Number, default: 0 },
    }],
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Pathway', pathwaySchema);
