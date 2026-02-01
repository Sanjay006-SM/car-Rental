const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    carName: {
        type: String,
        required: [true, 'Please add a car name']
    },
    brand: {
        type: String,
        required: [true, 'Please add a brand']
    },
    type: {
        type: String,
        required: [true, 'Please add a type'],
        enum: ['SUV', 'Sedan', 'Hatchback']
    },
    pricePerDay: {
        type: Number,
        required: [true, 'Please add a price per day']
    },
    available: {
        type: Boolean,
        default: true
    },
    images: {
        type: [String], // Array of Cloudinary URLs
        required: [true, 'Please add at least one image']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Car', carSchema);
