const express = require('express');
const router = express.Router();
const { 
    getCourseCatalog, 
    getCourseDetail, 
    getMyCourses, 
    enrollCourse, 
    getAssignedPathways, 
    completeCourse,
    getAllPathways,
    enrollPathway,
    getClassesCatalog,
    getClassDetail,
    enrollClass,
    getMyClasses
} = require('../../controllers/learner/learner.controller');
const { protect } = require('../../middlewares/auth.middleware');

router.get('/catalog', getCourseCatalog);
router.get('/classes', getClassesCatalog);
router.get('/my-classes', protect, getMyClasses);
router.get('/class/:id', getClassDetail);
router.get('/course/:id', getCourseDetail);
router.get('/my-courses', protect, getMyCourses);
router.post('/enroll/:id', protect, enrollCourse);
router.post('/enroll-class/:id', protect, enrollClass);
router.post('/complete-course/:id', protect, completeCourse);
router.get('/pathways', protect, getAssignedPathways);
router.get('/all-pathways', protect, getAllPathways);
router.post('/enroll-pathway/:id', protect, enrollPathway);

module.exports = router;
