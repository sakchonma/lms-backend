const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
    title: { type: String, required: true },
    type: { 
        type: String, 
        enum: [
            'Video', 'Audio', 'YouTube', 'Document', 'Article', 
            'FlashCard', 'SCORM', 'Weblink', 'File', 
            'Test', 'Survey', 'Activity'
        ], 
        default: 'Video' 
    },
    url: { type: String }, // สำหรับไฟล์, วิดีโอ, ลิงก์
    content: { type: String }, // สำหรับบทความ หรือรายละเอียดเพิ่มเติม
    priority: { type: Number, default: 0 },
});

module.exports = mongoose.model('Lesson', lessonSchema);
