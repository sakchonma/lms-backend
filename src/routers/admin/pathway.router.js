const express = require('express');
const router = express.Router();
const { getPathways, createPathway, updatePathway, deletePathway } = require('../../controllers/admin/pathway.controller');
const { protect, admin } = require('../../middlewares/auth.middleware');
const { upload } = require('../../configs/cloudinary');

router.route('/')
    .get(protect, admin, getPathways)
    .post(protect, admin, upload.single('image'), createPathway); 

router.route('/:id')
    .put(protect, admin, upload.single('image'), updatePathway)
    .delete(protect, admin, deletePathway);

module.exports = router;
