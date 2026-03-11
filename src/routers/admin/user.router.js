const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUser, deleteUser, getEnrollmentRequests, approveEnrollment, rejectEnrollment } = require('../../controllers/admin/user.controller');
const { protect, admin } = require('../../middlewares/auth.middleware');

router.route('/')
    .get(protect, admin, getUsers)
    .post(protect, admin, createUser);

router.get('/enrollments', protect, admin, getEnrollmentRequests);
router.post('/enrollments/approve', protect, admin, approveEnrollment);
router.post('/enrollments/reject', protect, admin, rejectEnrollment);

router.route('/:id')
    .put(protect, admin, updateUser)
    .delete(protect, admin, deleteUser);

module.exports = router;
