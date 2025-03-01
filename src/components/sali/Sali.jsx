import React, { useState } from 'react';
import trainingData from "../../../data/aito.json";

const TrainingPlan = () => {
  const [showWholeWeek, setShowWholeWeek] = useState(false); // State to manage toggle

  // Get today's day of the week as a number (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const today = new Date().getDay();

  // Map the day number to the corresponding Finnish day name
  const viikonpaivat = [
    "Sunnuntai",
    "Maanantai",
    "Tiistai",
    "Keskiviikko",
    "Torstai",
    "Perjantai",
    "Lauantai"
  ];

  // Get today's day name in Finnish
  const viikonpaiva = viikonpaivat[today];

  // Find today's training data
  const todayTraining = trainingData.plan
    .flatMap((week) => Object.entries(week)) // Flatten the array of objects into an array of [day, details] pairs
    .find(([day]) => day.toLowerCase() === viikonpaiva.toLowerCase()); // Find the entry where the day matches today's day

  // Toggle between showing the whole week and today's training
  const toggleView = () => {
    setShowWholeWeek(!showWholeWeek);
  };

  return (
    <div>
      {/* Toggle Button */}
      <button onClick={toggleView} style={{ marginBottom: '20px', padding: '10px', fontSize: '16px' }}>
        {showWholeWeek ? "Näytä vain tänään" : "Näytä koko viikko"}
      </button>

      {/* Render today's training or the whole week based on the toggle state */}
      {showWholeWeek ? (
        // Render the whole week
        trainingData.plan.map((week, index) => (
          <div key={index}>
            {Object.entries(week).map(([day, details]) => (
              <div key={day} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
                <h2>{day.charAt(0).toUpperCase() + day.slice(1)}</h2>
                <p><strong>Tavoite:</strong> {details.Tavoite}</p>
                <p><strong>Lämmittely (10 min):</strong> {details['Lämmittely (10 min)']}</p>

                <h3>Voimaharjoittelu</h3>
                <ul>
                  {details.Voimaharjoittelu.map((exercise, i) => (
                    <li key={i}>{exercise}</li>
                  ))}
                </ul>

                <p><strong>HIIT (10-15 min):</strong> {details['HIIT (10-15 min)']}</p>
                <p><strong>Aerobinen liikunta:</strong> {details['Aerobinen liikunta']}</p>

                <h3>Ravintosuositus</h3>
                <ul>
                  {Object.entries(details.Ravintosuositus).map(([meal, food]) => (
                    <li key={meal}>
                      <strong>{meal}:</strong> {food}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))
      ) : (
        // Render today's training
        todayTraining ? (
          <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
            <h2>{todayTraining[0].charAt(0).toUpperCase() + todayTraining[0].slice(1)}</h2>
            <p><strong>Tavoite:</strong> {todayTraining[1].Tavoite}</p>
            <p><strong>Lämmittely (10 min):</strong> {todayTraining[1]['Lämmittely (10 min)']}</p>

            <h3>Voimaharjoittelu</h3>
            <ul>
              {todayTraining[1].Voimaharjoittelu.map((exercise, i) => (
                <li key={i}>{exercise}</li>
              ))}
            </ul>

            <p><strong>HIIT (10-15 min):</strong> {todayTraining[1]['HIIT (10-15 min)']}</p>
            <p><strong>Aerobinen liikunta:</strong> {todayTraining[1]['Aerobinen liikunta']}</p>

            <h3>Ravintosuositus</h3>
            <ul>
              {Object.entries(todayTraining[1].Ravintosuositus).map(([meal, food]) => (
                <li key={meal}>
                  <strong>{meal}:</strong> {food}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>Ei treeniohjelmaa tälle päivälle.</div>
        )
      )}
    </div>
  );
};

export default TrainingPlan;