import { useEffect, useState } from 'react';
import { useAuth } from './LoginContext';
import { useNavigate } from 'react-router-dom';

const InactivityTimer = () => {
  const { setIsLoggedIn } = useAuth();
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const navigate = useNavigate();

  // Function to reset the timer
  const resetTimer = () => {
    setLastActivityTime(Date.now());
  };

  useEffect(() => {
    const checkInactivity = () => {
      if (Date.now() - lastActivityTime > 15 * 60 * 1000) { // 15 minutes
        setIsLoggedIn(false);
        navigate('/logout');
      }
    };

    // Set up the inactivity check
    const intervalId = setInterval(checkInactivity, 1000); // Check every second

    // Set up event listeners to reset the timer on user activity
    const events = ['click', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    return () => {
      clearInterval(intervalId);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [setIsLoggedIn, navigate]); // removed lastActivityTime from dependency array

  return null;
};

export default InactivityTimer;
