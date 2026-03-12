const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    // ข้อมูลพื้นฐาน
    courseCode: { type: String, unique: true, sparse: true },
    title: { type: String, required: true },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    learningProgram: { type: String },
    instructor: { type: String },
    category: { type: String },
    contentCreator: { type: String },
    tags: [{ type: String }],
    isMandatory: { type: Boolean, default: false },

    // ข้อมูลทั่วไป
    description: { type: String },
    termsAndConditions: { type: String },
    adminContact: { type: String },
    isTemplate: { type: Boolean, default: false },
    price: { type: Number, default: 0 },
    attachments: [{ title: String, url: String }],

    // การตั้งค่าการรับสมัคร
    enrollmentSettings: {
        formType: { type: String, default: 'Standard' },
        period: { 
            status: { type: String, enum: ['Open', 'Closed', 'Scheduled'], default: 'Open' },
            start: Date,
            end: Date
        },
        quota: { type: Number, default: 0 }, // 0 = Unlimited
        allowReEnrollAfterReject: { type: Boolean, default: false },
        approvalRequired: { type: Boolean, default: true },
        allowCancellation: { type: Boolean, default: true }
    },

    // การเผยแพร่
    publishSettings: {
        mode: { type: String, enum: ['Immediate', 'Scheduled', 'Unpublished'], default: 'Immediate' },
        startDate: Date,
        endDate: Date
    },

    image: { type: String },
    status: { type: String, enum: ['draft', 'publish'], default: 'draft' },
    sections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }],
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Course', courseSchema);
