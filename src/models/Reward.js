const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true }, // URL รูปของรางวัล (Avatar, Badge, Frame)
    type: { 
        type: String, 
        enum: ['avatar', 'frame', 'badge', 'background'], 
        default: 'avatar' 
    },
    requiredLevel: { type: Number, required: true }, // Level ที่จะได้รับรางวัลนี้
    description: { type: String },
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Reward', rewardSchema);
