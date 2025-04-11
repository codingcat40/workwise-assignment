import React from 'react';

const BookingMessage = ({ message, type }) => {
  const messageStyle = {
    padding: '10px 20px',
    borderRadius: '4px',
    marginTop: '10px',
    backgroundColor: type === 'success' ? '#4CAF50' : '#f44336',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1000,
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    animation: 'slideUp 0.3s ease-out'
  };

  const closeButtonStyle = {
    marginLeft: '15px',
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontSize: '20px'
  };

  return (
    <div style={messageStyle}>
      <span>{message}</span>
      <button style={closeButtonStyle}>&times;</button>
    </div>
  );
};

export default BookingMessage; 