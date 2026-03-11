const Course = require('../../models/Course');
const Section = require('../../models/Section');
const Lesson = require('../../models/Lesson');

exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate({
            path: 'sections',
            populate: { path: 'lessons' }
        });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createCourse = async (req, res) => {
    const { title, description, image, status } = req.body;
    try {
        const course = await Course.create({ title, description, image, status });
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.json({ message: 'Course removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addSection = async (req, res) => {
    const { title, priority } = req.body;
    try {
        const section = await Section.create({ courseId: req.params.id, title, priority });
        await Course.findByIdAndUpdate(req.params.id, { $push: { sections: section._id } });
        res.status(201).json(section);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addLesson = async (req, res) => {
    const { title, videoUrl, content, type, priority } = req.body;
    try {
        const lesson = await Lesson.create({ sectionId: req.params.sectionId, title, videoUrl, content, type, priority });
        await Section.findByIdAndUpdate(req.params.sectionId, { $push: { lessons: lesson._id } });
        res.status(201).json(lesson);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
