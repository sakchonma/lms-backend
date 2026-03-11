const express = require('express');
const router = express.Router();
const { getClasses, createClass, updateClass, deleteClass, assignUsersToClass } = require('../../controllers/admin/class.controller');
const { protect, admin } = require('../../middlewares/auth.middleware');

router.route('/')
    .get(protect, admin, getClasses)
    .post(protect, admin, createClass);

router.route('/:id')
    .put(protect, admin, updateClass)
    .delete(protect, admin, deleteClass);

router.post('/:id/assign', protect, admin, assignUsersToClass);

module.exports = router;
