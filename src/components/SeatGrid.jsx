import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookSeats } from '../services/api';
import './Booking.css';

/**
 * SeatGrid Component
 * Handles the train seat booking system with consecutive seat allocation
 * Features:
 * - Displays a grid of 80 seats (7 seats per row)
 * - Books consecutive seats in the same row when possible
 * - Falls back to booking from top to bottom if consecutive seats aren't available
 * - Shows booking status and success messages
 */

const SeatGrid = () => {
  // State management for seats, input, and messages
  const [seats, setSeats] = useState(Array(80).fill(null)); // null = available, object = booked with booking info
  const [numSeats, setNumSeats] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load existing bookings when component mounts or user changes
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        // Use the same API URL from environment variable
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        // Fetch all booked seats from the server
        const response = await fetch(`${API_URL}/bookings/all`);
        const data = await response.json();
        
        if (response.ok) {
          // Initialize a new array with all seats available
          const newSeats = Array(80).fill(null);
          
          // Mark booked seats with booking info including userId
          data.bookings.forEach(booking => {
            if (booking.seatNumber >= 1 && booking.seatNumber <= 80) {
              newSeats[booking.seatNumber - 1] = booking;
            }
          });
          
          setSeats(newSeats);
        } else {
          console.error('Failed to load bookings:', data.error);
        }
      } catch (error) {
        console.error('Error loading bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]); // Reload when user changes

  /**
   * Checks if a seat is available for booking
   * @param {object|null} seat - Seat object or null if available
   * @returns {boolean} True if seat is available, false if booked
   */
  const isSeatAvailable = (seat) => {
    return seat === null;
  };

  /**
   * Checks if a seat is booked by the current user
   * @param {object|null} seat - Seat object or null if available
   * @returns {boolean} True if seat is booked by current user
   */
  const isSeatBookedByCurrentUser = (seat) => {
    if (!seat || !user) return false;
    const currentUserId = user.id || user._id || user.userId;
    return seat.userId === currentUserId;
  };

  /**
   * Finds consecutive available seats in the grid
   * @param {number} numSeatsNeeded - Number of seats to book
   * @returns {number[] | null} Array of seat indices to book, or null if not enough seats
   */
  const findConsecutiveSeats = (numSeatsNeeded) => {
    const seatsPerRow = 7;
    const rows = Math.ceil(seats.length / seatsPerRow);

    // Strategy 1: Find consecutive seats in the same row
    for (let row = 0; row < rows; row++) {
      const rowStart = row * seatsPerRow;
      const rowEnd = Math.min((row + 1) * seatsPerRow, seats.length);
      let consecutive = [];
      
      for (let i = rowStart; i < rowEnd; i++) {
        if (isSeatAvailable(seats[i])) {
          consecutive.push(i);
          if (consecutive.length === numSeatsNeeded) {
            return consecutive; // Found enough consecutive seats
          }
        } else {
          consecutive = []; // Reset consecutive count when we hit a booked seat
        }
      }
    }

    // Strategy 2: If no consecutive seats in one row, book any available seats from top
    const availableSeats = [];
    for (let i = 0; i < seats.length && availableSeats.length < numSeatsNeeded; i++) {
      if (isSeatAvailable(seats[i])) {
        availableSeats.push(i);
      }
    }

    return availableSeats.length >= numSeatsNeeded ? availableSeats.slice(0, numSeatsNeeded) : null;
  };

  /**
   * Handles the seat booking process
   * Validates input, finds available seats, and updates the booking state
   */
  const handleBooking = async () => {
    if (!user) {
      setMessage('Please login to book seats');
      return;
    }

    // Input validation
    const numSeatsToBook = parseInt(numSeats);
    if (!numSeatsToBook || numSeatsToBook <= 0) {
      setMessage('Please enter a valid number of seats');
      return;
    }

    // Find and validate available seats
    const seatsToBook = findConsecutiveSeats(numSeatsToBook);
    if (!seatsToBook) {
      setMessage('Not enough seats available');
      return;
    }

    try {
      // Convert from zero-based indices to seat numbers (1-based)
      const seatNumbers = seatsToBook.map(index => index + 1);
      
      // Make sure userId is properly formatted
      // In MongoDB, user._id is typically a string representation of ObjectId
      const userId = user.id || user._id || user.userId;
      
      if (!userId) {
        setMessage('User ID not found. Please log in again.');
        return;
      }
      
      console.log('Attempting to book seats:', seatNumbers, 'for user:', userId);
      
      // Call API to book seats
      const response = await bookSeats(seatNumbers, userId);
      
      if (response.message) {
        // Update local state
        setSeats(prev => {
          const newSeats = [...prev];
          seatsToBook.forEach((index, i) => {
            newSeats[index] = {
              seatNumber: index + 1,
              userId: userId,
              bookingDate: new Date()
            };
          });
          return newSeats;
        });

        // Show success message and reset input
        setMessage('Seats successfully booked');
        setNumSeats('');
      } else {
        setMessage(response.error || 'Failed to book seats');
      }
    } catch (error) {
      console.error('Booking error:', error);
      setMessage('Error booking seats. Please try again: ' + error.message);
    }
    
    // Auto-hide message after 3 seconds
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  /**
   * Resets all bookings to initial state (for demo only)
   */
  const resetBooking = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/bookings/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        setSeats(Array(80).fill(null));
        setNumSeats('');
        setMessage('All bookings have been reset');
      } else {
        const data = await response.json();
        setMessage(data.error || 'Failed to reset bookings');
      }
    } catch (error) {
      console.error('Reset error:', error);
      setMessage('Error resetting bookings');
    }
  };

  // Calculate booking statistics
  const myBookingsCount = seats.filter(seat => isSeatBookedByCurrentUser(seat)).length;
  const otherBookingsCount = seats.filter(seat => seat !== null && !isSeatBookedByCurrentUser(seat)).length;
  const availableSeatsCount = seats.filter(seat => isSeatAvailable(seat)).length;

  if (loading) {
    return <div className="loading">Loading bookings...</div>;
  }

  return (
    <div className="booking-container">
      <h1>Ticket Booking</h1>
      
      {/* Seat Grid */}
      <div className="grid-container">
        {seats.map((seat, index) => {
          const isMyBooking = isSeatBookedByCurrentUser(seat);
          const isBooked = seat !== null;
          
          return (
            <button
              key={index + 1}
              className={`seat ${isMyBooking ? 'my-booking' : ''} ${isBooked && !isMyBooking ? 'other-booking' : ''}`}
              disabled={isBooked}
              title={isMyBooking ? 'Your booking' : (isBooked ? 'Already booked' : 'Available')}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      {/* Booking Statistics */}
      <div className="booking-info">
        <div className="status-box my-booking-status">
          My Bookings = {myBookingsCount}
        </div>
        <div className="status-box available-status">
          Available = {availableSeatsCount}
        </div>
      </div>

      {/* Booking Controls */}
      <div className="booking-controls">
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="number"
            value={numSeats}
            onChange={(e) => setNumSeats(e.target.value)}
            placeholder="Enter number of seats"
            min="1"
            max={availableSeatsCount}
          />
          <button onClick={handleBooking} className="book-button">
            Book
          </button>
        </div>
        <button onClick={resetBooking} className="reset-button">
          Reset All Bookings
        </button>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className="success-message">
          {message}
          <button className="close-btn" onClick={() => setMessage(null)}>×</button>
        </div>
      )}
    </div>
  );
};

export default SeatGrid; 