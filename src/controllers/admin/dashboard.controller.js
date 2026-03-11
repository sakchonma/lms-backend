const User = require('../../models/User');
const Course = require('../../models/Course');
const Class = require('../../models/Class');

exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ isTrash: false });
        const totalCourses = await Course.countDocuments();
        const totalClasses = await Class.countDocuments();

        const recentActivity = [
            // Mock recent activity for MVP
            { message: 'New user registered', time: new Date() },
            { message: 'New course created', time: new Date() },
        ];

        res.json({
            totalUsers,
            totalCourses,
            totalClasses,
            recentActivity,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
