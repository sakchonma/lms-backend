const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    image: { type: String, default: '' },
    role: { type: String, enum: ['admin', 'learner'], default: 'learner' },
    active: { type: Boolean, default: true },
    isTrash: { type: Boolean, default: false },
    myCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    myPathways: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pathway' }],
    myClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
    pendingCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    pendingPathways: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pathway' }],
    pendingClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
    completedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    // Game Stats
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    rank: { type: String, default: 'NOVICE' },
    points: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
