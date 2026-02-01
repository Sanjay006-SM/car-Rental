const express = require('express');
const router = express.Router();
const { createBooking, getCompanyBookings, updateBookingStatus, getUserBookings } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('user'), createBooking);
router.get('/my', protect, authorize('user'), getUserBookings);
router.get('/company', protect, authorize('company'), getCompanyBookings);
router.put('/:id/status', protect, authorize('company'), updateBookingStatus);

module.exports = router;
