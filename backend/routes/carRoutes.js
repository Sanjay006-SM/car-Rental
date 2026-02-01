const express = require('express');
const router = express.Router();
const { addCar, getCars, getCarById } = require('../controllers/carController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

// Public routes
router.get('/', getCars);
router.get('/:id', getCarById);

// Protected company routes
// upload.array('images', 5) allows up to 5 images to be uploaded
router.post('/add', protect, authorize('company'), upload.array('images', 5), addCar);

module.exports = router;
