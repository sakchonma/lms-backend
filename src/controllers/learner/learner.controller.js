const Course = require('../../models/Course');
const User = require('../../models/User');
const Pathway = require('../../models/Pathway');
const Class = require('../../models/Class');
const Reward = require('../../models/Reward');

// Helper function to handle Level Up and Rewards
const checkLevelUp = async (user) => {
    const xpPerLevel = 1000;
    const newLevel = Math.floor(user.xp / xpPerLevel) + 1;
    
    if (newLevel > user.level) {
        // Find rewards for the new level
        const rewards = await Reward.find({ requiredLevel: { $lte: newLevel, $gt: user.level } });
        
        user.level = newLevel;
        if (rewards.length > 0) {
            // Add rewards to inventory if not already there
            rewards.forEach(reward => {
                if (!user.inventory.includes(reward._id)) {
                    user.inventory.push(reward._id);
                }
            });
        }
        
        // Update rank based on level
        if (user.level >= 20) user.rank = 'LEGENDARY';
        else if (user.level >= 15) user.rank = 'ELITE';
        else if (user.level >= 10) user.rank = 'VETERAN';
        else if (user.level >= 5) user.rank = 'WARRIOR';
    }
};

exports.getMyClasses = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('myClasses');
        res.json(user.myClasses || []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getClassDetail = async (req, res) => {
    try {
        const cls = await Class.findById(req.params.id);
        if (!cls) return res.status(404).json({ message: 'Class not found' });
        res.json(cls);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getClassesCatalog = async (req, res) => {
    try {
        const classes = await Class.find(); 
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCourseCatalog = async (req, res) => {
    try {
        const [courses, pathways] = await Promise.all([
            Course.find({ status: 'publish' }),
            Pathway.find()
        ]);

        const coursesWithPathwayInfo = courses.map(course => {
            const parentPathways = pathways
                .filter(p => p.sections.some(s => s.items.some(i => i.refId && i.refId.toString() === course._id.toString())))
                .map(p => ({ id: p._id, title: p.title }));

            return {
                ...course._doc,
                belongsToPathways: parentPathways.length > 0 ? parentPathways : []
            };
        });

        res.json(coursesWithPathwayInfo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCourseDetail = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate({
            path: 'sections',
            populate: { path: 'lessons' },
        });
        
        if (!course) return res.status(404).json({ message: 'Course not found' });

        const pathways = await Pathway.find();
        const parentPathways = pathways.filter(p => 
            p.sections.some(s => s.items.some(i => i.refId && i.refId.toString() === course._id.toString()))
        );

        res.json({
            ...course._doc,
            belongsToPathways: parentPathways
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.enrollCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const userId = req.user._id;

        const inPathways = await Pathway.find({ "sections.items.refId": courseId });
        if (inPathways.length > 0) {
            return res.status(400).json({ 
                message: 'This course belongs to multiple pathways. Please select a pathway to enroll.',
                pathways: inPathways.map(p => ({ id: p._id, title: p.title }))
            });
        }

        const user = await User.findById(userId);
        if (user.myCourses.some(id => id.toString() === courseId)) return res.status(400).json({ message: 'Already enrolled' });
        
        await User.findByIdAndUpdate(userId, { $addToSet: { pendingCourses: courseId } });
        res.json({ message: 'Enrollment request sent.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyCourses = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('myCourses');
        res.json(user.myCourses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAssignedPathways = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('myPathways');
        
        if (!user.myPathways || user.myPathways.length === 0) {
            return res.json([]);
        }

        const pathways = await Pathway.find({ _id: { $in: user.myPathways } })
            .populate('sections.items.refId');
        
        const updatedPathways = pathways.map(pathway => {
            const allItems = pathway.sections.reduce((acc, section) => [...acc, ...section.items], []);
            
            const itemsWithStatus = allItems.map((item, index) => {
                const currentId = (item.refId?._id || item.refId)?.toString();
                let isLocked = false;
                if (index > 0) {
                    const prevId = (allItems[index - 1].refId?._id || allItems[index - 1].refId)?.toString();
                    if (!user.completedCourses.some(id => id.toString() === prevId)) isLocked = true;
                }
                return {
                    ...item._doc,
                    isLocked,
                    isCompleted: user.completedCourses.some(id => id.toString() === currentId)
                };
            });
            return { ...pathway._doc, items: itemsWithStatus };
        });
        
        res.json(updatedPathways);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.completeCourse = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user.completedCourses.includes(req.params.id)) {
            user.completedCourses.push(req.params.id);
            user.xp += 200; // XP for completing a course
            user.points += 50; // Points for completing a course
            await checkLevelUp(user);
            await user.save();
        }
        res.json({ message: 'Course marked as completed', level: user.level, xp: user.xp });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Complete a pathway and award massive XP/Points
// @route   POST /api/learner/pathways/:id/complete
exports.completePathway = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const pathway = await Pathway.findById(req.params.id);

        if (!pathway) return res.status(404).json({ message: 'Pathway not found' });
        if (user.completedPathways.includes(pathway._id)) return res.status(400).json({ message: 'Pathway already completed' });

        // Check if all courses in pathway are completed
        const allCourseIds = [];
        pathway.sections.forEach(s => s.items.forEach(i => {
            if (i.itemType === 'Course') allCourseIds.push(i.refId.toString());
        }));

        const isFullyCompleted = allCourseIds.every(id => user.completedCourses.some(cid => cid.toString() === id));
        
        if (!isFullyCompleted) {
            return res.status(400).json({ message: 'You must complete all courses in this pathway first' });
        }

        user.completedPathways.push(pathway._id);
        user.xp += 1500; // Massive XP for Pathway completion
        user.points += 500; // Massive Points
        await checkLevelUp(user);
        await user.save();

        res.json({ message: 'CONGRATULATIONS! Pathway completed!', level: user.level, xp: user.xp, points: user.points });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user inventory
// @route   GET /api/learner/inventory
exports.getInventory = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('inventory');
        res.json(user.inventory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Equip an item (Avatar or Frame)
// @route   POST /api/learner/equip
exports.equipItem = async (req, res) => {
    try {
        const { itemId } = req.body;
        const user = await User.findById(req.user._id);
        const item = await Reward.findById(itemId);

        if (!item) return res.status(404).json({ message: 'Item not found' });
        if (!user.inventory.includes(item._id)) return res.status(403).json({ message: 'You do not own this item' });

        if (item.type === 'avatar') user.equippedAvatar = item.image;
        if (item.type === 'frame') user.equippedFrame = item.image;

        await user.save();
        res.json({ message: `Successfully equipped ${item.name}`, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllPathways = async (req, res) => {
    try {
        const pathways = await Pathway.find().populate('sections.items.refId');
        res.json(pathways);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.enrollClass = async (req, res) => {
    try {
        const classId = req.params.id;
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (user.myClasses.some(id => id.toString() === classId)) return res.status(400).json({ message: 'Already enrolled' });
        await User.findByIdAndUpdate(userId, { $addToSet: { pendingClasses: classId } });
        res.json({ message: 'Enrollment request sent.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.enrollPathway = async (req, res) => {
    try {
        const pathway = await Pathway.findById(req.params.id);
        if (!pathway) return res.status(404).json({ message: 'Pathway not found' });
        const courseIds = [];
        pathway.sections.forEach(s => s.items.forEach(i => {
            if (i.itemType === 'Course') courseIds.push(i.refId.toString());
        }));
        await User.findByIdAndUpdate(req.user._id, {
            $addToSet: { pendingCourses: { $each: courseIds }, pendingPathways: pathway._id }
        });
        res.json({ message: `Successfully requested enrollment for pathway: ${pathway.title}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
