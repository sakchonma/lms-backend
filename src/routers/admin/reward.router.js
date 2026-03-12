const express = require('express');
const router = express.Router();
const { getRewards, createReward, deleteReward } = require('../../controllers/admin/reward.controller');
const { protect, admin } = require('../../middlewares/auth.middleware');

router.use(protect);
router.use(admin);

router.get('/', getRewards);
router.post('/', createReward);
router.delete('/:id', deleteReward);

module.exports = router;
