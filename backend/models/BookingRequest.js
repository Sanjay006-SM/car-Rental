const mongoose = require('mongoose');

const bookingRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true
    },
    fromDate: {
        type: Date,
        required: [true, 'Please add a start date']
    },
    toDate: {
        type: Date,
        required: [true, 'Please add an end date']
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('BookingRequest', bookingRequestSchema);
