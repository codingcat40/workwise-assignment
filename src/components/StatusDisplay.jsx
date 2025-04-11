import React from 'react';

const StatusDisplay = ({ bookedSeats, totalSeats }) => {
  const availableSeats = totalSeats - bookedSeats.length;

  const statusStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '10px',
  };

  const itemStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const numberStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '5px 0',
  };

  const labelStyle = {
    fontSize: '14px',
    color: '#666',
  };

  return (
    <div style={statusStyle}>
      <div style={itemStyle}>
        <div style={numberStyle}>{bookedSeats.length}</div>
        <div style={labelStyle}>Booked Seats</div>
      </div>
      <div style={itemStyle}>
        <div style={numberStyle}>{availableSeats}</div>
        <div style={labelStyle}>Available Seats</div>
      </div>
    </div>
  );
};

export default StatusDisplay; 