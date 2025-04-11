const express = require('express');
const SeatBooking = require('../../models/SeatBooking');

const router = express.Router();

// Get all bookings
router.get('/all', async (req, res) => {
  try {
    // Get all bookings with user information
    const bookings = await SeatBooking.find().lean();
    
    console.log('Fetched bookings:', bookings.length);
    
    res.json({ 
      bookings,
      totalBookings: bookings.length,
      availableSeats: 80 - bookings.length
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Book seats - Updated to handle multiple seats
router.post('/book', async (req, res) => {
  try {
    console.log('Received booking request:', req.body);
    const { seatNumbers, userId } = req.body;
    
    if (!seatNumbers || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      console.log('Invalid seat numbers:', seatNumbers);
      return res.status(400).json({ error: 'Invalid seat numbers' });
    }
    
    if (!userId) {
      console.log('Missing userId in request');
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Check if any of the seats are already booked
    const existingBookings = await SeatBooking.find({
      seatNumber: { $in: seatNumbers }
    });
    
    if (existingBookings.length > 0) {
      console.log('Conflicting seats:', existingBookings);
      return res.status(400).json({ 
        error: 'Some seats are already booked',
        conflictingSeats: existingBookings.map(booking => booking.seatNumber)
      });
    }
    
    // Create booking documents for each seat
    const bookings = seatNumbers.map(seatNumber => ({
      seatNumber,
      userId
    }));
    
    console.log('Creating bookings:', bookings);
    
    // Save all bookings
    const result = await SeatBooking.insertMany(bookings);
    console.log('Booking result:', result);
    
    res.status(201).json({ 
      message: 'Seats booked successfully', 
      bookedSeats: seatNumbers 
    });
  } catch (error) {
    console.error('Seat booking error:', error);
    res.status(500).json({ error: error.message || 'Seat booking failed' });
  }
});

// Cancel a booking
router.delete('/cancel/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    await SeatBooking.findByIdAndDelete(bookingId);
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Cancellation failed' });
  }
});

// Reset all bookings (for demo/testing purposes)
router.post('/reset', async (req, res) => {
  try {
    await SeatBooking.deleteMany({});
    res.json({ message: 'All bookings have been reset' });
  } catch (error) {
    console.error('Reset bookings error:', error);
    res.status(500).json({ error: 'Failed to reset bookings' });
  }
});

module.exports = router; 