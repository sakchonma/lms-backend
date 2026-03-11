const express = require('express');
const router = express.Router();
const { getPathways, createPathway, updatePathway, deletePathway } = require('../../controllers/admin/pathway.controller');
const { protect, admin } = require('../../middlewares/auth.middleware');

router.route('/')
    .get(protect, admin, getPathways)
    .post(protect, admin, createPathway);

router.route('/:id')
    .put(protect, admin, updatePathway)
    .delete(protect, admin, deletePathway);

module.exports = router;
