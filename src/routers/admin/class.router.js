const express = require('express');
const router = express.Router();
const { getClasses, createClass, updateClass, deleteClass, assignUsersToClass } = require('../../controllers/admin/class.controller');
const { protect, admin } = require('../../middlewares/auth.middleware');
const { upload } = require('../../configs/cloudinary');

router.route('/')
    .get(protect, admin, getClasses)
    .post(protect, admin, upload.single('image'), createClass); 

router.route('/:id')
    .put(protect, admin, upload.single('image'), updateClass)
    .delete(protect, admin, deleteClass);

router.post('/:id/assign', protect, admin, assignUsersToClass);

module.exports = router;
