const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    // ข้อมูลพื้นฐาน
    classCode: { type: String, unique: true, sparse: true },
    title: { type: String, required: true },
    description: { type: String },
    termsAndConditions: { type: String },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    learningProgram: { type: String },
    category: { type: String },
    contentCreator: { type: String },
    instructor: { type: String },
    tags: [{ type: String }],
    isMandatory: { type: Boolean, default: false },
    image: { type: String },
    price: { type: Number, default: 0 },
    attachments: [{ title: String, url: String }],
    adminContact: { type: String },
    isTemplate: { type: Boolean, default: false },
    enrollmentLogic: { type: String, enum: ['Single', 'Multiple'], default: 'Single' },
    approvalMode: { type: String, enum: ['Automatic', 'Admin'], default: 'Automatic' },

    // รอบการอบรม (Rounds)
    rounds: [{
        title: { type: String, required: true },
        type: { type: String, enum: ['Class', 'Meeting', 'Live'], default: 'Class' },
        start: Date,
        end: Date,
        location: { type: String }, // เช่น Conicle Head Office
        url: { type: String }, // สำหรับ Meeting (Zoom/Meet) หรือ Live
        room: { type: String },
        instructor: { type: String },
        description: { type: String }
    }],

    // การเช็คอิน (Check-in)
    checkInSettings: {
        mode: { type: String, enum: ['Single', 'CheckInCheckOut'], default: 'Single' },
        qrCodeType: { type: String, enum: ['Round', 'Daily'], default: 'Round' },
        enabled: { type: Boolean, default: true }
    },

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
        allowCancellation: { type: Boolean, default: true },
        autoCancelIfLowEnrollment: { type: Boolean, default: false }
    },

    // การเผยแพร่
    publishSettings: {
        mode: { type: String, enum: ['Immediate', 'Scheduled', 'Unpublished'], default: 'Immediate' },
        startDate: Date,
        endDate: Date
    },

    status: { type: String, enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming' },
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Class', classSchema);
