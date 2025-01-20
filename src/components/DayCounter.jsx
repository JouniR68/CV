import React, { useState, useEffect } from "react";

const DayCounter = () => {
  const targetDate = new Date("2034-06-15");

  const calculateDaysRemaining = () => {
    const today = new Date();
    const timeDifference = targetDate - today;
    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  };

  const [daysRemaining, setDaysRemaining] = useState(calculateDaysRemaining());

  useEffect(() => {
    const interval = setInterval(() => {
      setDaysRemaining(calculateDaysRemaining());
    }, 1000); // Update every second (optional for real-time changes)

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px", backgroundColor:'gray', width:'fit-content', paddingLeft:'1rem', paddingRight:'1rem' }}>
      <h5>Eläkkeeseen {daysRemaining} päivää</h5>
    </div>
  );
};

export default DayCounter;
