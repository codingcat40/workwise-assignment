import React, { useState } from 'react';

const BookingForm = ({ onBook, onReset }) => {
  const [seatsToBook, setSeatsToBook] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onBook(parseInt(seatsToBook, 10));
    setSeatsToBook('');
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    maxWidth: '400px',
    margin: '0 auto',
  };

  const inputStyle = {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
  };

  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <input
        type="number"
        value={seatsToBook}
        onChange={(e) => setSeatsToBook(e.target.value)}
        placeholder="Enter number of seats to book"
        min="1"
        max="7"
        required
        style={inputStyle}
      />
      <div style={buttonContainerStyle}>
        <button 
          type="submit" 
          style={{ ...buttonStyle, backgroundColor: '#4CAF50', color: 'white' }}
        >
          Book
        </button>
        <button 
          type="button" 
          onClick={onReset} 
          style={{ ...buttonStyle, backgroundColor: '#f44336', color: 'white' }}
        >
          Reset Booking
        </button>
      </div>
    </form>
  );
};

export default BookingForm; 