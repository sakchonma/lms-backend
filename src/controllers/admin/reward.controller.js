const Reward = require('../../models/Reward');

// @desc    Get all rewards
// @route   GET /api/admin/rewards
exports.getRewards = async (req, res) => {
    try {
        const rewards = await Reward.find().sort({ requiredLevel: 1 });
        res.json(rewards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new reward
// @route   POST /api/admin/rewards
exports.createReward = async (req, res) => {
    try {
        const { name, image, type, requiredLevel, description } = req.body;
        const reward = await Reward.create({ name, image, type, requiredLevel, description });
        res.status(201).json(reward);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete reward
// @route   DELETE /api/admin/rewards/:id
exports.deleteReward = async (req, res) => {
    try {
        await Reward.findByIdAndDelete(req.params.id);
        res.json({ message: 'Reward deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
