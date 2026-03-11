const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../../controllers/admin/dashboard.controller');
const { protect, admin } = require('../../middlewares/auth.middleware');

router.get('/', protect, admin, getDashboardStats);

module.exports = router;
