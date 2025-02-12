import React, { useState, useEffect } from "react";

const DayCounter = () => {
  const targetDate = new Date("2034-06-15");
  const freePension = new Date("2029-01-1");
  const offFromBoose = new Date("2024-01-1");

  const calculateDaysRemaining = () => {
    const today = new Date();
    const timeDifference = targetDate - today;
    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  };

  const freePensionRemaining = () => {
    const today = new Date();
    const timeDifference = freePension - today;
    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  };

  const alcoFreeDays = () => {
    const today = new Date();
    const timeDifference =  today - offFromBoose;
    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  };

  const [daysRemaining, setDaysRemaining] = useState(calculateDaysRemaining() || 0);
  const [freePensionStart, setFreePensionRemaining] = useState(freePensionRemaining() || 0);
  const [alcoOffDays, setAlcoOffDays] = useState(alcoFreeDays() || 0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDaysRemaining(calculateDaysRemaining());
      setFreePensionRemaining(freePensionRemaining());
      setAlcoOffDays(alcoFreeDays());
    }, 1000); // Update every second (optional for real-time changes)

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);


  return (
    <div style={{ textAlign: "left", marginTop: "50px", backgroundColor:'gray', width:'fit-content', paddingLeft:'1rem', paddingRight:'1rem' }}>
      <h5>Mandatum eläkemaksujen<br></br>alkuun <span style={{color:'red'}}>{freePensionStart} päivää (1.1.2029-31.12.2035).</span><br></br>
      Alkosta vapaa <span style={{color:'red'}}>{alcoOffDays} päivää (1.1.2024)</span><br></br>
      Eläkkeeseen <span style={{color:'red'}}>{parseInt(daysRemaining)} päivää (15.6.2034, {parseFloat(daysRemaining/365).toFixed(2)} vuosissa.)</span></h5>
    </div>
  );
};

export default DayCounter;
