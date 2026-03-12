const User = require('../../models/User');
const Pathway = require('../../models/Pathway');

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

        const userData = { username, password, email, firstName, lastName, role };
        if (req.file) {
            userData.image = req.file.path;
        }

        const user = await User.create(userData);
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

            if (req.file) {
                user.image = req.file.path;
            }

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
        // 1. ดึงคำขอแบบทั้ง Pathway
        const usersWithPathways = await User.find({ "pendingPathways.0": { "$exists": true } })
            .select('firstName lastName email pendingPathways')
            .populate({
                path: 'pendingPathways',
                select: 'title sections',
                populate: { path: 'sections.items.refId', select: 'title' }
            });

        const pathwayRequests = [];
        const userPathwayCourses = {}; // เก็บ courseIds ที่ติดอยู่ใน pathway ของแต่ละ user (key เป็น userId string)

        usersWithPathways.forEach(user => {
            const userIdStr = user._id.toString();
            if (!userPathwayCourses[userIdStr]) userPathwayCourses[userIdStr] = new Set();
            
            user.pendingPathways.forEach(path => {
                let courseCount = 0;
                path.sections?.forEach(section => {
                    section.items?.forEach(item => {
                        if (item.itemType === 'Course' && item.refId) {
                            courseCount++;
                            // ตรวจสอบว่าเป็น Object (populated) หรือเป็นแค่ ID
                            const cId = item.refId._id ? item.refId._id.toString() : item.refId.toString();
                            userPathwayCourses[userIdStr].add(cId);
                        }
                    });
                });

                pathwayRequests.push({
                    type: 'pathway',
                    userId: user._id,
                    userName: `${user.firstName} ${user.lastName}`,
                    userEmail: user.email,
                    itemId: path._id,
                    itemTitle: path.title,
                    courseCount: courseCount
                });
            });
        });

        // 2. ดึงคำขอแบบทีละคอร์ส
        const usersWithCourses = await User.find({ "pendingCourses.0": { "$exists": true } })
            .select('firstName lastName email pendingCourses')
            .populate('pendingCourses', 'title');
        
        const courseRequests = [];
        usersWithCourses.forEach(user => {
            const userIdStr = user._id.toString();
            user.pendingCourses.forEach(course => {
                const isAlreadyInPathway = userPathwayCourses[userIdStr]?.has(course._id.toString());
                
                if (!isAlreadyInPathway) {
                    courseRequests.push({
                        type: 'course',
                        userId: user._id,
                        userName: `${user.firstName} ${user.lastName}`,
                        userEmail: user.email,
                        itemId: course._id,
                        itemTitle: course.title
                    });
                }
            });
        });

        // 3. ดึงคำขอแบบคลาสเรียน
        const usersWithClasses = await User.find({ "pendingClasses.0": { "$exists": true } })
            .select('firstName lastName email pendingClasses')
            .populate('pendingClasses', 'title');

        const classRequests = [];
        usersWithClasses.forEach(user => {
            user.pendingClasses.forEach(cls => {
                classRequests.push({
                    type: 'class',
                    userId: user._id,
                    userName: `${user.firstName} ${user.lastName}`,
                    userEmail: user.email,
                    itemId: cls._id,
                    itemTitle: cls.title
                });
            });
        });

        res.json([...pathwayRequests, ...courseRequests, ...classRequests]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.approvePathway = async (req, res) => {
    const { userId, pathwayId } = req.body;
    try {
        const [user, pathway] = await Promise.all([
            User.findById(userId),
            Pathway.findById(pathwayId)
        ]);

        if (user && pathway) {
            // ดึง courseIds ทั้งหมดจากทุก section ใน pathway
            const courseIds = [];
            pathway.sections?.forEach(section => {
                section.items?.forEach(item => {
                    if (item.itemType === 'Course' && item.refId) {
                        courseIds.push(item.refId.toString());
                    }
                });
            });

            // 1. เอา Pathway ออกจาก pendingPathways
            user.pendingPathways = user.pendingPathways.filter(id => id.toString() !== pathwayId);
            
            // 2. เอาคอร์สที่อยู่ใน Pathway นี้ออกจาก pendingCourses (ถ้ามีขอแยกมา)
            user.pendingCourses = user.pendingCourses.filter(id => !courseIds.includes(id.toString()));

            // 3. เพิ่มทุกคอร์สเข้าไปใน myCourses
            courseIds.forEach(cId => {
                if (!user.myCourses.some(id => id.toString() === cId)) {
                    user.myCourses.push(cId);
                }
            });

            await user.save();
            res.json({ message: 'Pathway and all its courses approved successfully' });
        } else {
            res.status(404).json({ message: 'User or Pathway not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.rejectPathway = async (req, res) => {
    const { userId, pathwayId } = req.body;
    try {
        const [user, pathway] = await Promise.all([
            User.findById(userId),
            Pathway.findById(pathwayId)
        ]);

        if (user && pathway) {
            // ดึง courseIds ทั้งหมดจาก pathway เพื่อล้างออกจาก pendingCourses ด้วย
            const courseIds = [];
            pathway.sections?.forEach(section => {
                section.items?.forEach(item => {
                    if (item.itemType === 'Course' && item.refId) {
                        courseIds.push(item.refId.toString());
                    }
                });
            });

            // 1. เอา Pathway ออกจาก pendingPathways
            user.pendingPathways = user.pendingPathways.filter(id => id.toString() !== pathwayId);
            
            // 2. เอาคอร์สที่อยู่ใน Pathway นี้ออกจาก pendingCourses (คืนค่าทั้งหมด)
            user.pendingCourses = user.pendingCourses.filter(id => !courseIds.includes(id.toString()));

            await user.save();
            res.json({ message: 'Pathway request and all associated course requests rejected' });
        } else {
            res.status(404).json({ message: 'User or Pathway not found' });
        }
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

exports.approveClassEnrollment = async (req, res) => {
    const { userId, classId } = req.body;
    try {
        const user = await User.findById(userId);
        if (user) {
            user.pendingClasses = (user.pendingClasses || []).filter(id => id.toString() !== classId);
            if (!user.myClasses.some(id => id.toString() === classId)) {
                user.myClasses.push(classId);
            }
            await user.save();
            res.json({ message: 'Class enrollment approved successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.rejectClassEnrollment = async (req, res) => {
    const { userId, classId } = req.body;
    try {
        const user = await User.findById(userId);
        if (user) {
            user.pendingClasses = (user.pendingClasses || []).filter(id => id.toString() !== classId);
            await user.save();
            res.json({ message: 'Class enrollment rejected' });
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

exports.getEnrolledUsers = async (req, res) => {
    const { type, itemId } = req.query;
    try {
        let filter = {};
        if (type === 'course') {
            filter = { myCourses: itemId };
        } else if (type === 'pathway') {
            filter = { myPathways: itemId };
        } else if (type === 'class') {
            filter = { myClasses: itemId };
        }

        const enrolledUsers = await User.find(filter).select('firstName lastName email username role');
        res.json(enrolledUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.manageParticipant = async (req, res) => {
    const { userId, itemId, type, action } = req.body; // action: 'add' or 'remove'
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        let field = '';
        if (type === 'course') field = 'myCourses';
        else if (type === 'pathway') field = 'myPathways';
        else if (type === 'class') field = 'myClasses';

        // Ensure the array exists
        if (!user[field]) user[field] = [];

        if (action === 'add') {
            if (!user[field].some(id => id && id.toString() === itemId)) {
                user[field].push(itemId);
            }

            // IF PATHWAY: Also add all courses in that pathway to user.myCourses
            if (type === 'pathway') {
                const Pathway = require('../../models/Pathway');
                const pathway = await Pathway.findById(itemId);
                if (pathway) {
                    pathway.sections?.forEach(section => {
                        section.items?.forEach(item => {
                            if (item.itemType === 'Course' && item.refId) {
                                const cId = item.refId.toString();
                                if (!user.myCourses.some(id => id.toString() === cId)) {
                                    user.myCourses.push(cId);
                                }
                            }
                        });
                    });
                }
            }
        } else if (action === 'remove') {
            user[field] = user[field].filter(id => id && id.toString() !== itemId);
            
            // IF PATHWAY: Also remove all courses in that pathway from user.myCourses
            if (type === 'pathway') {
                const Pathway = require('../../models/Pathway');
                const pathway = await Pathway.findById(itemId);
                if (pathway) {
                    const courseIdsInPathway = [];
                    pathway.sections?.forEach(section => {
                        section.items?.forEach(item => {
                            if (item.itemType === 'Course' && item.refId) {
                                courseIdsInPathway.push(item.refId.toString());
                            }
                        });
                    });
                    
                    // Filter out courses that belong to this pathway
                    user.myCourses = user.myCourses.filter(id => !courseIdsInPathway.includes(id.toString()));
                }
            }
        }

        await user.save();
        res.json({ message: `User ${action === 'add' ? 'added to' : 'removed from'} ${type} successfully` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
