const Class = require('../../models/Class');

exports.getClasses = async (req, res) => {
    try {
        const classes = await Class.find().populate('course').populate('users', 'firstName lastName email');
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createClass = async (req, res) => {
    const { title, course, users, schedule } = req.body;
    try {
        const newClass = await Class.create({ title, course, users, schedule });
        res.status(201).json(newClass);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateClass = async (req, res) => {
    try {
        const foundClass = await Class.findById(req.params.id);
        if (foundClass) {
            foundClass.title = req.body.title || foundClass.title;
            foundClass.course = req.body.course || foundClass.course;
            foundClass.users = req.body.users || foundClass.users;
            foundClass.schedule = req.body.schedule || foundClass.schedule;

            const updatedClass = await foundClass.save();
            res.json(updatedClass);
        } else {
            res.status(404).json({ message: 'Class not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteClass = async (req, res) => {
    try {
        const foundClass = await Class.findById(req.params.id);
        if (foundClass) {
            await foundClass.remove();
            res.json({ message: 'Class removed' });
        } else {
            res.status(404).json({ message: 'Class not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.assignUsersToClass = async (req, res) => {
    const { users } = req.body;
    try {
        const foundClass = await Class.findById(req.params.id);
        if (foundClass) {
            foundClass.users = [...new Set([...foundClass.users, ...users])];
            await foundClass.save();
            res.json(foundClass);
        } else {
            res.status(404).json({ message: 'Class not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
