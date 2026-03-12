const express = require('express');
const router = express.Router();
const { 
    getCourseCatalog, 
    getCourseDetail, 
    getMyCourses, 
    enrollCourse, 
    completeCourse,
    getAssignedPathways,
    getAllPathways,
    enrollPathway,
    getClassesCatalog,
    getClassDetail,
    getMyClasses,
    enrollClass,
    completePathway,
    getInventory,
    equipItem
} = require('../../controllers/learner/learner.controller');
const { protect } = require('../../middlewares/auth.middleware');

router.use(protect);

// --- My Progress Routes ---
router.get('/my-courses', getMyCourses);
router.get('/my-classes', getMyClasses);
router.get('/pathways', getAssignedPathways);

// --- Catalog Routes ---
router.get('/catalog', getCourseCatalog);
router.get('/classes', getClassesCatalog);
router.get('/all-pathways', getAllPathways);

// --- Detail Routes ---
router.get('/course/:id', getCourseDetail);
router.get('/class/:id', getClassDetail);

// --- Enrollment & Actions ---
router.post('/course/:id/enroll', enrollCourse);
router.post('/enroll/:id', enrollCourse);

router.post('/course/:id/complete', completeCourse);
router.post('/complete-course/:id', completeCourse);

router.post('/pathway/:id/enroll', enrollPathway);
router.post('/enroll-pathway/:id', enrollPathway);
router.post('/pathway/:id/complete', completePathway);

router.post('/class/:id/enroll', enrollClass);
router.post('/enroll-class/:id', enrollClass);

// --- Profile & Gamification ---
router.get('/inventory', getInventory);
router.post('/equip', equipItem);

module.exports = router;
