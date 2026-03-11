const User = require('../../models/User');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({ isTrash: false }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createUser = async (req, res) => {
    const { username, password, email, firstName, lastName, role } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ username, password, email, firstName, lastName, role });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.firstName = req.body.firstName || user.firstName;
            user.lastName = req.body.lastName || user.lastName;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;
            user.active = req.body.active !== undefined ? req.body.active : user.active;

            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getEnrollmentRequests = async (req, res) => {
    try {
        // ใช้ "pendingCourses.0" เพื่อเช็คว่ามีสมาชิกอย่างน้อย 1 ตัว
        const usersWithRequests = await User.find({ "pendingCourses.0": { "$exists": true } })
            .select('firstName lastName email pendingCourses')
            .populate('pendingCourses', 'title');
        
        // Flatten data for easier UI handling
        const requests = [];
        usersWithRequests.forEach(user => {
            user.pendingCourses.forEach(course => {
                requests.push({
                    userId: user._id,
                    userName: `${user.firstName} ${user.lastName}`,
                    userEmail: user.email,
                    courseId: course._id,
                    courseTitle: course.title
                });
            });
        });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.approveEnrollment = async (req, res) => {
    const { userId, courseId } = req.body;
    try {
        const user = await User.findById(userId);
        if (user) {
            // กรองออกโดยเปรียบเทียบเป็น String
            user.pendingCourses = user.pendingCourses.filter(id => id.toString() !== courseId);
            
            const alreadyIn = user.myCourses.some(id => id.toString() === courseId);
            if (!alreadyIn) {
                user.myCourses.push(courseId);
            }
            await user.save();
            res.json({ message: 'Enrollment approved successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.rejectEnrollment = async (req, res) => {
    const { userId, courseId } = req.body;
    try {
        const user = await User.findById(userId);
        if (user) {
            user.pendingCourses = user.pendingCourses.filter(id => id.toString() !== courseId);
            await user.save();
            res.json({ message: 'Enrollment rejected' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.isTrash = true;
            await user.save();
            res.json({ message: 'User moved to trash' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
