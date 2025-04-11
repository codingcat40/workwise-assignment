import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import SeatGrid from './components/SeatGrid';
import Login from './components/Login';
import Signup from './components/Signup';
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/booking" element={<SeatGrid />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App; 