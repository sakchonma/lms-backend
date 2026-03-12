const Pathway = require('../../models/Pathway');

exports.getPathways = async (req, res) => {
    try {
        const pathways = await Pathway.find().populate('sections.items.refId');
        res.json(pathways);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createPathway = async (req, res) => {
    try {
        console.log('--- Create Pathway Debug ---');
        const pathwayData = { ...req.body };

        // Parse complex fields
        ['sections', 'durationSettings', 'enrollmentSettings', 'publishSettings', 'tags', 'attachments'].forEach(field => {
            if (typeof pathwayData[field] === 'string') {
                try {
                    pathwayData[field] = JSON.parse(pathwayData[field]);
                } catch (e) {
                    console.error(`Error parsing ${field}:`, e);
                }
            }
        });

        // Convert strings to proper types
        if (pathwayData.price) pathwayData.price = Number(pathwayData.price);
        if (pathwayData.isMandatory) pathwayData.isMandatory = pathwayData.isMandatory === 'true';
        if (pathwayData.isTemplate) pathwayData.isTemplate = pathwayData.isTemplate === 'true';

        if (req.file) {
            pathwayData.image = req.file.path;
        }
        const newPathway = await Pathway.create(pathwayData); 
        res.status(201).json(newPathway);
    } catch (error) {
        console.error('Create Pathway Detailed Error:', error);
        res.status(500).json({ message: error.message, details: error.errors });
    }
};

exports.updatePathway = async (req, res) => {
    try {
        console.log('--- Update Pathway Debug ---');
        const updateData = { ...req.body };

        // Parse complex fields
        ['sections', 'durationSettings', 'enrollmentSettings', 'publishSettings', 'tags', 'attachments'].forEach(field => {
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
        const updatedPathway = await Pathway.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        res.json(updatedPathway);
    } catch (error) {
        console.error('Update Pathway Detailed Error:', error);
        res.status(500).json({ message: error.message, details: error.errors });
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
