import React, { useState, useEffect } from "react";

const DayCounter = () => {
  const targetDate = new Date("2025-06-1");

  const calculateDaysRemaining = () => {
    const today = new Date();
    const timeDifference = targetDate - today;
    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  };

  
  const [daysRemaining, setDaysRemaining] = useState(calculateDaysRemaining() || 0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDaysRemaining(calculateDaysRemaining());
    }, 1000); // Update every second (optional for real-time changes)

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);


  return (
    <div style={{ textAlign: "left", marginTop: "50px", backgroundColor:'gray', width:'fit-content', paddingLeft:'1rem', paddingRight:'1rem' }}>
      <h1>Euro Campaign 25, startti <span style={{color:'red'}}>{daysRemaining} päivää.</span></h1>
     </div>
  );
};

export default DayCounter;
