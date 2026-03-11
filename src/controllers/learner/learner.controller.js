const Course = require('../../models/Course');
const User = require('../../models/User');
const Pathway = require('../../models/Pathway');

exports.getCourseCatalog = async (req, res) => {
    try {
        const courses = await Course.find({ status: 'publish' });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCourseDetail = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate({
            path: 'sections',
            populate: {
                path: 'lessons',
            },
        });
        if (course) {
            res.json(course);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
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

exports.enrollCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const userId = req.user._id;

        const user = await User.findById(userId);
        
        // ตรวจสอบว่าลงทะเบียนหรือยัง (ใช้ String เปรียบเทียบ)
        const isEnrolled = user.myCourses.some(id => id.toString() === courseId);
        if (isEnrolled) {
            return res.status(400).json({ message: 'Already enrolled and approved' });
        }

        const isPending = user.pendingCourses.some(id => id.toString() === courseId);
        if (isPending) {
            return res.status(400).json({ message: 'Request is already pending' });
        }

        // ใช้ $addToSet เพื่อป้องกันข้อมูลซ้ำและบันทึกลง DB ทันที
        await User.findByIdAndUpdate(userId, {
            $addToSet: { pendingCourses: courseId }
        });

        res.json({ message: 'Enrollment request sent. Waiting for admin approval.' });
    } catch (error) {
        console.error("Enrollment Error:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getAssignedPathways = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const pathways = await Pathway.find({ 'courses.courseId': { $in: user.myCourses } }).populate('courses.courseId');
        
        const updatedPathways = pathways.map(pathway => {
            const coursesWithStatus = pathway.courses.sort((a, b) => a.order - b.order).map((item, index) => {
                let isLocked = false;
                if (index > 0) {
                    const prevCourseId = pathway.courses[index - 1].courseId._id;
                    if (!user.completedCourses.includes(prevCourseId)) {
                        isLocked = true;
                    }
                }
                return {
                    ...item._doc,
                    isLocked,
                    isCompleted: user.completedCourses.includes(item.courseId._id)
                };
            });
            return { ...pathway._doc, courses: coursesWithStatus };
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
        const pathways = await Pathway.find().populate('courses.courseId');
        res.json(pathways);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.enrollPathway = async (req, res) => {
    try {
        const pathway = await Pathway.findById(req.params.id);
        if (!pathway) return res.status(404).json({ message: 'Pathway not found' });

        const courseIds = pathway.courses.map(c => c.courseId.toString());
        const userId = req.user._id;

        // เพิ่มทุกคอร์สใน Pathway เข้าไปที่ pendingCourses (ถ้ายังไม่มี)
        await User.findByIdAndUpdate(userId, {
            $addToSet: { pendingCourses: { $each: courseIds } }
        });

        res.json({ message: `Successfully requested enrollment for all ${courseIds.length} courses in the pathway!` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
