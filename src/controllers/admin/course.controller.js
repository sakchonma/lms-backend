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
    try {
        console.log('--- Create Course Debug ---');
        console.log('Body:', req.body);
        console.log('File:', req.file);

        const courseData = { ...req.body };
        
        // Parse complex fields
        ['enrollmentSettings', 'publishSettings', 'tags', 'attachments'].forEach(field => {
            if (typeof courseData[field] === 'string') {
                try {
                    courseData[field] = JSON.parse(courseData[field]);
                } catch (e) {
                    console.error(`Error parsing ${field}:`, e);
                }
            }
        });

        // Convert strings to proper types for Mongoose
        if (courseData.price) courseData.price = Number(courseData.price);
        if (courseData.isMandatory) courseData.isMandatory = courseData.isMandatory === 'true';
        if (courseData.isTemplate) courseData.isTemplate = courseData.isTemplate === 'true';

        if (req.file) {
            courseData.image = req.file.path;
        }

        const course = await Course.create(courseData);
        console.log('Successfully created course:', course._id);
        res.status(201).json(course);
    } catch (error) {
        console.error('Create Course Detailed Error:', error);
        res.status(500).json({ 
            message: error.message, 
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            details: error.errors // สำหรับ Mongoose Validation Errors
        });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        console.log('--- Update Course Debug ---');
        console.log('ID:', req.params.id);
        console.log('Body:', req.body);

        const updateData = { ...req.body };

        // Parse complex fields
        ['enrollmentSettings', 'publishSettings', 'tags', 'attachments'].forEach(field => {
            if (typeof updateData[field] === 'string') {
                try {
                    updateData[field] = JSON.parse(updateData[field]);
                } catch (e) {
                    console.error(`Error parsing ${field}:`, e);
                }
            }
        });

        // Convert strings to proper types
        if (updateData.price) updateData.price = Number(updateData.price);
        if (updateData.isMandatory) updateData.isMandatory = updateData.isMandatory === 'true';
        if (updateData.isTemplate) updateData.isTemplate = updateData.isTemplate === 'true';

        if (req.file) {
            updateData.image = req.file.path;
        }

        const course = await Course.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        console.log('Successfully updated course:', course._id);
        res.json(course);
    } catch (error) {
        console.error('Update Course Detailed Error:', error);
        res.status(500).json({ 
            message: error.message, 
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            details: error.errors
        });
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
    const { title, url, content, type, priority } = req.body;
    try {
        const lesson = await Lesson.create({ sectionId: req.params.sectionId, title, url, content, type, priority });
        await Section.findByIdAndUpdate(req.params.sectionId, { $push: { lessons: lesson._id } });
        res.status(201).json(lesson);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
