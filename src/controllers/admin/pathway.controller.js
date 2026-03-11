const Pathway = require('../../models/Pathway');

exports.getPathways = async (req, res) => {
    try {
        let pathways = await Pathway.find().populate('courses.courseId');
        
        // กรองคอร์สที่ถูกลบ (courseId เป็น null) ออกจากข้อมูลที่ส่งไป
        const cleanedPathways = pathways.map(path => {
            const validCourses = path.courses.filter(c => c.courseId !== null);
            return { ...path._doc, courses: validCourses };
        });

        res.json(cleanedPathways);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createPathway = async (req, res) => {
    const { title, description, courses } = req.body;
    try {
        const pathway = await Pathway.create({ title, description, courses });
        res.status(201).json(pathway);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updatePathway = async (req, res) => {
    try {
        // อัปเดตข้อมูลตามปกติ
        const pathway = await Pathway.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!pathway) return res.status(404).json({ message: 'Pathway not found' });
        
        res.json(pathway);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deletePathway = async (req, res) => {
    try {
        await Pathway.findByIdAndDelete(req.params.id);
        res.json({ message: 'Pathway removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
