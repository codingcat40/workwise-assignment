// Use environment variable for API URL or fall back to localhost for development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Authentication API
export const register = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }
    
    return data;
  } catch (error) {
    console.error('Registration error:', error.message);
    throw error;
  }
};

export const login = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    return await response.json();
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Booking API
export const bookSeats = async (seatNumbers, userId) => {
  try {
    console.log('Booking request:', { seatNumbers, userId });
    
    const response = await fetch(`${API_URL}/bookings/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ seatNumbers, userId }),
    });
    
    const data = await response.json();
    console.log('Booking response:', data);
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to book seats');
    }
    
    return data;
  } catch (error) {
    console.error('Booking error:', error);
    throw error;
  }
};

export const cancelBooking = async (bookingId) => {
  try {
    const response = await fetch(`${API_URL}/bookings/cancel/${bookingId}`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error) {
    console.error('Cancellation error:', error);
    throw error;
  }
}; 