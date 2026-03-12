const Class = require('../../models/Class');

exports.getClasses = async (req, res) => {
    try {
        const classes = await Class.find();
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createClass = async (req, res) => {
    try {
        console.log('--- Create Class Debug ---');
        const classData = { ...req.body };

        // Parse complex fields
        ['rounds', 'checkInSettings', 'enrollmentSettings', 'publishSettings', 'tags', 'attachments'].forEach(field => {
            if (typeof classData[field] === 'string') {
                try {
                    classData[field] = JSON.parse(classData[field]);
                } catch (e) {
                    console.error(`Error parsing ${field}:`, e);
                }
            }
        });

        // Convert strings to proper types
        if (classData.price) classData.price = Number(classData.price);
        if (classData.isMandatory) classData.isMandatory = classData.isMandatory === 'true';
        if (classData.isTemplate) classData.isTemplate = classData.isTemplate === 'true';

        if (req.file) {
            classData.image = req.file.path;
        }
        const newClass = await Class.create(classData); 
        res.status(201).json(newClass);
    } catch (error) {
        console.error('Create Class Detailed Error:', error);
        res.status(500).json({ message: error.message, details: error.errors });
    }
};

exports.updateClass = async (req, res) => {
    try {
        console.log('--- Update Class Debug ---');
        const updateData = { ...req.body };

        // Parse complex fields
        ['rounds', 'checkInSettings', 'enrollmentSettings', 'publishSettings', 'tags', 'attachments'].forEach(field => {
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
        const updatedClass = await Class.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        res.json(updatedClass);
    } catch (error) {
        console.error('Update Class Detailed Error:', error);
        res.status(500).json({ message: error.message, details: error.errors });
    }
};

exports.deleteClass = async (req, res) => {
    try {
        await Class.findByIdAndDelete(req.params.id);
        res.json({ message: 'Class removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.assignUsersToClass = async (req, res) => {
    try {
        // Implement assignment logic here if needed
        res.json({ message: 'Feature not yet fully implemented' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
