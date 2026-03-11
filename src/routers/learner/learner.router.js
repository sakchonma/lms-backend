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
    enrollPathway 
} = require('../../controllers/learner/learner.controller');
const { protect } = require('../../middlewares/auth.middleware');

router.get('/catalog', getCourseCatalog);
router.get('/course/:id', getCourseDetail);
router.get('/my-courses', protect, getMyCourses);
router.post('/enroll/:id', protect, enrollCourse);
router.post('/complete-course/:id', protect, completeCourse);
router.get('/pathways', protect, getAssignedPathways);
router.get('/all-pathways', protect, getAllPathways);
router.post('/enroll-pathway/:id', protect, enrollPathway);

module.exports = router;
