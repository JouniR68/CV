import React from 'react';
import trainingData from "../../../data/aito.json";

const TrainingPlan = () => {
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

  // If no training data is found for today, display a message
  if (!todayTraining) {
    return <div><p></p>Ei treeniohjelmaa tälle päivälle.</div>;
  }

  // Destructure the day and details from the found training data
  const [day, details] = todayTraining;

  return (
    <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
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
  );
};

export default TrainingPlan;