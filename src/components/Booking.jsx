import React, { useState } from 'react';
import './Booking.css';

const Booking = () => {
  const [seats, setSeats] = useState(Array(80).fill(false));
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [numSeats, setNumSeats] = useState('');
  const [message, setMessage] = useState(null);

  const findConsecutiveSeats = (numSeatsNeeded) => {
    const seatsPerRow = 7;
    const rows = Math.ceil(seats.length / seatsPerRow);

    // First try: Look for consecutive seats in the same row
    for (let row = 0; row < rows; row++) {
      const rowStart = row * seatsPerRow;
      const rowEnd = Math.min((row + 1) * seatsPerRow, seats.length);
      let consecutive = [];
      
      for (let i = rowStart; i < rowEnd; i++) {
        if (!seats[i]) {
          consecutive.push(i);
          if (consecutive.length === numSeatsNeeded) {
            return consecutive;
          }
        } else {
          consecutive = [];
        }
      }
      // If we found some consecutive seats but not enough, reset and try next row
      consecutive = [];
    }

    // Second try: Book any available seats from top to bottom
    const availableSeats = [];
    for (let i = 0; i < seats.length && availableSeats.length < numSeatsNeeded; i++) {
      if (!seats[i]) {
        availableSeats.push(i);
      }
    }

    return availableSeats.length >= numSeatsNeeded ? availableSeats.slice(0, numSeatsNeeded) : null;
  };

  const handleBooking = () => {
    const numSeatsToBook = parseInt(numSeats);
    if (!numSeatsToBook || numSeatsToBook <= 0) {
      setMessage({ text: 'Please enter a valid number of seats', type: 'error' });
      return;
    }

    const seatsToBook = findConsecutiveSeats(numSeatsToBook);
    if (!seatsToBook) {
      setMessage({ text: 'Not enough seats available', type: 'error' });
      return;
    }

    setSeats(prev => {
      const newSeats = [...prev];
      seatsToBook.forEach(index => {
        newSeats[index] = true;
      });
      return newSeats;
    });

    setMessage({ text: 'Seat successfully booked', type: 'success' });
    setNumSeats('');
    
    // Auto-hide message after 3 seconds
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  const resetBooking = () => {
    setNumSeats('');
    setMessage(null);
  };

  return (
    <div className="booking-container">
      <h1>Ticket Booking</h1>
      
      <div className="grid-container">
        {seats.map((isBooked, index) => (
          <button
            key={index + 1}
            className={`seat ${isBooked ? 'booked' : 'available'}`}
            disabled={isBooked}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <div className="booking-info">
        <div className="status-box booked-status">
          Booked Seats = {seats.filter(seat => seat).length}
        </div>
        <div className="status-box available-status">
          Available Seats = {seats.filter(seat => !seat).length}
        </div>
      </div>

      <div className="booking-controls">
        <input
          type="number"
          value={numSeats}
          onChange={(e) => setNumSeats(e.target.value)}
          placeholder="Enter number of seats"
          min="1"
          max={seats.filter(seat => !seat).length}
        />
        <button onClick={handleBooking} className="book-button">
          Book
        </button>
      </div>

      <button onClick={resetBooking} className="reset-button">
        Reset Booking
      </button>

      {message && (
        <div className="success-message">
          {message.text}
          <button className="close-btn" onClick={() => setMessage(null)}>×</button>
        </div>
      )}
    </div>
  );
};

export default Booking; 