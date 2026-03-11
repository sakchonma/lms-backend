const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    status: { type: String, enum: ['draft', 'publish'], default: 'draft' },
    sections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }],
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Course', courseSchema);
