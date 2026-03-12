const Course = require('../../models/Course');
const User = require('../../models/User');
const Pathway = require('../../models/Pathway');

const Class = require('../../models/Class');

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
        // Fetch all classes regardless of status for now to ensure data shows up
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
            // Find all pathways this course belongs to by checking items in each section
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

        // Find all pathways this course belongs to
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

        // Get full details for each pathway
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
            await user.save();
        }
        res.json({ message: 'Course marked as completed' });
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
        const { roundId } = req.body;

        const user = await User.findById(userId);
        if (user.myClasses.some(id => id.toString() === classId)) {
            return res.status(400).json({ message: 'Already enrolled in this class' });
        }
        
        if (user.pendingClasses.some(id => id.toString() === classId)) {
            return res.status(400).json({ message: 'Enrollment request already pending' });
        }

        await User.findByIdAndUpdate(userId, { 
            $addToSet: { pendingClasses: classId } 
        });

        res.json({ message: 'Enrollment request for class sent. Waiting for admin approval.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.enrollPathway = async (req, res) => {
    try {
        const pathway = await Pathway.findById(req.params.id);
        if (!pathway) return res.status(404).json({ message: 'Pathway not found' });
        
        // Extract all course IDs from all sections
        const courseIds = [];
        pathway.sections.forEach(s => {
            s.items.forEach(i => {
                if (i.itemType === 'Course') courseIds.push(i.refId.toString());
            });
        });

        await User.findByIdAndUpdate(req.user._id, {
            $addToSet: { 
                pendingCourses: { $each: courseIds },
                pendingPathways: pathway._id
            }
        });
        res.json({ message: `Successfully requested enrollment for pathway: ${pathway.title}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
