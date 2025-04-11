const mongoose = require('mongoose');

const seatBookingSchema = new mongoose.Schema({
  seatNumber: { type: Number, required: true },
  userId: { type: String, required: true },
  bookingDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SeatBooking', seatBookingSchema); 