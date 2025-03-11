import { useState } from "react";

const ClickTracker = ({ requiredClicks }) => {
  const [clicks, setClicks] = useState(0);
  const [dayCompleted, setDayCompleted] = useState(false);

  const handleClick = () => {
    if (clicks < requiredClicks) {
      const newClicks = clicks + 1;
      setClicks(newClicks);

      if (newClicks === requiredClicks) {
        setDayCompleted(true);
      }
    }
  };

  return (
    <div>
      <p>Clicks: {clicks}</p>
      <button onClick={handleClick} disabled={dayCompleted}>
        Click Me
      </button>
      {dayCompleted && <p>Day Completed!</p>}
    </div>
  );
};

export default ClickTracker;
