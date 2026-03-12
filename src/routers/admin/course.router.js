const express = require('express');
const router = express.Router();
const { getCourses, createCourse, updateCourse, deleteCourse, addSection, addLesson } = require('../../controllers/admin/course.controller');
const { protect, admin } = require('../../middlewares/auth.middleware');
const { upload } = require('../../configs/cloudinary');

router.route('/')
    .get(protect, admin, getCourses)
    .post(protect, admin, upload.single('image'), createCourse); 

router.route('/:id')
    .put(protect, admin, upload.single('image'), updateCourse)
    .delete(protect, admin, deleteCourse);

router.post('/:id/sections', protect, admin, addSection);
router.post('/sections/:sectionId/lessons', protect, admin, addLesson);

module.exports = router;
