import React, { useEffect, useState } from 'react';
import { useAuth } from './LoginContext';

const InactivityTimer = () => {
  const { logout } = useAuth();
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());

  // Function to reset the timer
  const resetTimer = () => {
    setLastActivityTime(Date.now());
  };

  useEffect(() => {
    // Set up the inactivity check
    const checkInactivity = () => {
      if (Date.now() - lastActivityTime > 1 * 20 * 1000) { // 10 minutes
        logout();
      }
    };

    const intervalId = setInterval(checkInactivity, 1000); // Check every second

    // Set up event listeners to reset the timer on user activity
    const events = ['click', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    return () => {
      clearInterval(intervalId);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [lastActivityTime, logout]);

  return null;
};

export default InactivityTimer;
