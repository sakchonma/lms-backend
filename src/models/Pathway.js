const mongoose = require('mongoose');

const pathwaySchema = new mongoose.Schema({
    // ข้อมูลพื้นฐาน
    pathwayCode: { type: String, unique: true, sparse: true },
    title: { type: String, required: true },
    description: { type: String },
    termsAndConditions: { type: String },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    learningProgram: { type: String },
    category: { type: String },
    contentCreator: { type: String },
    instructor: { type: String },
    adminContact: { type: String },
    tags: [{ type: String }],
    isMandatory: { type: Boolean, default: false },
    isTemplate: { type: Boolean, default: false },
    image: { type: String },
    price: { type: Number, default: 0 },
    attachments: [{ title: String, url: String }],

    // รูปแบบระยะเวลาการเรียน
    durationSettings: {
        type: { type: String, enum: ['Fixed', 'Days'], default: 'Days' },
        startDate: Date,
        endDate: Date,
        numberOfDays: { type: Number, default: 0 }
    },

    // ส่วนของเนื้อหา (Sections)
    sections: [{
        title: { type: String, required: true },
        description: { type: String },
        durationType: { type: String, enum: ['Fixed', 'Days'], default: 'Days' },
        startDate: Date,
        endDate: Date,
        duration: { type: Number, default: 30 }, // จำนวนวันที่ต้องเรียนให้จบใน Section นี้ (Days mode)
        items: [{
            itemType: { type: String, enum: ['Course', 'Class', 'Live', 'Activity', 'Test', 'Survey', 'Video', 'Audio', 'YouTube', 'Document', 'Article', 'FlashCard', 'SCORM'], required: true },
            refId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'sections.items.itemType' }, // ไอดีของคอร์สหรือคลาสที่อ้างอิง
            isMandatory: { type: Boolean, default: true },
            order: { type: Number, default: 0 }
        }]
    }],

    // การตั้งค่าการรับสมัคร
    enrollmentSettings: {
        formType: { type: String, default: 'Standard' },
        period: { 
            status: { type: String, enum: ['Open', 'Closed', 'Scheduled'], default: 'Open' },
            start: Date,
            end: Date
        },
        quota: { type: Number, default: 0 }, // 0 = Unlimited
        allowReEnrollment: { type: Boolean, default: false }, // อนุญาตให้ผู้ที่ถูกปฏิเสธลงทะเบียนซ้ำได้
        approvalRequired: { type: Boolean, default: true },
        allowCancellation: { type: Boolean, default: true }
    },

    // การเผยแพร่
    publishSettings: {
        mode: { type: String, enum: ['Published', 'Scheduled', 'Unpublished'], default: 'Unpublished' },
        startDate: Date,
        endDate: Date
    },

    status: { type: String, enum: ['draft', 'publish'], default: 'draft' },
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Pathway', pathwaySchema);
