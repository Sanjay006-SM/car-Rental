const Car = require('../models/Car');

// @desc    Add a new car
// @route   POST /api/cars/add
// @access  Private (Company only)
exports.addCar = async (req, res) => {
    try {
        const { carName, brand, type, pricePerDay } = req.body;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'Please upload at least one image' });
        }

        // Extract URLs from Cloudinary upload result
        const imageUrls = req.files.map(file => file.path);

        const car = await Car.create({
            companyId: req.company._id,
            carName,
            brand,
            type,
            pricePerDay,
            images: imageUrls
        });

        res.status(201).json(car);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all cars
// @route   GET /api/cars
// @access  Public
exports.getCars = async (req, res) => {
    try {
        const cars = await Car.find({ available: true }).populate('companyId', 'companyName phone address');
        res.json(cars);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get car by ID
// @route   GET /api/cars/:id
// @access  Public
exports.getCarById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id).populate('companyId', 'companyName phone address');
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.json(car);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
