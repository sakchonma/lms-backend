const express = require('express');
const router = express.Router();
const { 
    getUsers, createUser, updateUser, deleteUser, 
    getEnrollmentRequests, approveEnrollment, rejectEnrollment,
    approvePathway, rejectPathway,
    approveClassEnrollment, rejectClassEnrollment,
    getEnrolledUsers, manageParticipant 
    } = require('../../controllers/admin/user.controller');
    const { protect, admin } = require('../../middlewares/auth.middleware');
    const { upload } = require('../../configs/cloudinary');

    router.route('/')
    .get(protect, admin, getUsers)
    .post(protect, admin, upload.single('image'), createUser);

    router.get('/participants', protect, admin, getEnrolledUsers);
    router.post('/participants/manage', protect, admin, manageParticipant);

    router.get('/enrollments', protect, admin, getEnrollmentRequests);
    router.post('/enrollments/approve', protect, admin, approveEnrollment);
    router.post('/enrollments/reject', protect, admin, rejectEnrollment);
    router.post('/enrollments/pathway/approve', protect, admin, approvePathway);
    router.post('/enrollments/pathway/reject', protect, admin, rejectPathway);
    router.post('/enrollments/class/approve', protect, admin, approveClassEnrollment);
    router.post('/enrollments/class/reject', protect, admin, rejectClassEnrollment);


router.route('/:id')
    .put(protect, admin, upload.single('image'), updateUser)
    .delete(protect, admin, deleteUser);

module.exports = router;
