const BookingRequest = require('../models/BookingRequest');
const Car = require('../models/Car');

// @desc    Create a booking request
// @route   POST /api/bookings
// @access  Private (User only)
exports.createBooking = async (req, res) => {
    try {
        const { carId, fromDate, toDate } = req.body;

        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        if (!car.available) {
            return res.status(400).json({ message: 'Car is not available for booking' });
        }

        const booking = await BookingRequest.create({
            userId: req.user._id,
            carId,
            fromDate,
            toDate
        });

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get bookings for a company
// @route   GET /api/bookings/company
// @access  Private (Company only)
exports.getCompanyBookings = async (req, res) => {
    try {
        // Find cars owned by this company
        const cars = await Car.find({ companyId: req.company._id });
        const carIds = cars.map(car => car._id);

        // Find bookings for those cars
        const bookings = await BookingRequest.find({ carId: { $in: carIds } })
            .populate('userId', 'name email')
            .populate('carId', 'carName brand');

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (Company only)
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const booking = await BookingRequest.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Verify car belongs to company
        const car = await Car.findById(booking.carId);
        if (car.companyId.toString() !== req.company._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this booking' });
        }

        booking.status = status;
        await booking.save();

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get bookings for a user
// @route   GET /api/bookings/my
// @access  Private (User only)
exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await BookingRequest.find({ userId: req.user._id })
            .populate('carId', 'carName brand images pricePerDay');

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
