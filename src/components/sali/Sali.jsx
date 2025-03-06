import React, { useEffect, useState } from 'react';
import trainingData from "../../../data/aito.json";
import { Button } from '@mui/material';
import { db } from "../../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const TrainingPlan = () => {
  const [data, setData] = useState([]); // Data should be an array since you're dealing with a list of records
  const [dayCompleted, setDayCompleted] = useState(false);
  const [nutriation, showNutriation] = useState(false);
  const [showWholeWeek, setShowWholeWeek] = useState(false);
  const [done, setDone] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Fetch training data from Firestore
  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'trainings'));
      const fetchedData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Run only once after initial render

  // Check if all tasks for today are completed
  useEffect(() => {
    if (done.length === todayTraining[1]?.Voimaharjoittelu?.length) {
      const hasEmpty = done.some(u => u === undefined || u === "");
      if (!hasEmpty) {
        const dateFound = data.some(f => f.date === new Date().toLocaleDateString());
        if (!dateFound) {
          const newEntry = {
            week: getWeekNumber(),
            training: todayTraining[1].Tavoite,
            date: new Date().toLocaleDateString(), // Format date to ensure consistency
            hour: new Date().getHours()
          };
          setData(prevData => [...prevData, newEntry]); // Append new training data
          setDayCompleted(true);          
        } else{
          setError("Päivän treeni on jo syötetty");
          setDayCompleted(false);
          setDone([]); // Clear undone tasks
        }                
      } 
    }
  }, [done, data]); // Runs whenever `done` or `data` changes

  // Format date consistently (YYYY-MM-DD)
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const today = new Date().getDay();
  const viikonpaivat = [
    "Sunnuntai", "Maanantai", "Tiistai", "Keskiviikko", "Torstai", "Perjantai", "Lauantai"
  ];
  const viikonpaiva = viikonpaivat[today];

  // Find today's training data
  const todayTraining = trainingData.plan
    .flatMap((week) => Object.entries(week)) // Flatten the array of objects into an array of [day, details] pairs
    .find(([day]) => day.toLowerCase() === viikonpaiva.toLowerCase()); // Find today's training based on the day

  const submit = async () => {
    if (dayCompleted) {
      try {
        await addDoc(collection(db, "trainings"), data[data.length - 1]); // Add the most recent data
        setDayCompleted(false);
        setDone([]); // Clear the 'done' array after submitting
        setError("Recordi talletettu, siirytään kotisivulle")
        setTimeout(() => {                      
          navigate('/')
        }, 4000);

        setError("")
      } catch (err) {
        console.error("Error adding document: ", err);
      }
    }
  };

  const toggleView = () => {
    setShowWholeWeek(prevState => !prevState);
  };

  const markDone = (i) => {
    setDone(prev => {
      const newDone = [...prev];
      newDone[i] = !newDone[i];
      return newDone;
    });
  };

  const openNutrientation = () => {
    showNutriation(prev => !prev);
  };

  const getButtonStyle = (i) => ({
    backgroundColor: done[i] ? "green" : "red",
    border: done[i] ? "1px solid #ccc" : "none",
    color: done[i] ? "white" : "black",
    textDecoration: done[i] ? "line-through" : "none",
  });

  const getWeekNumber = (date = new Date()) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDays = (date - firstDayOfYear) / (1000 * 60 * 60 * 24); // Days passed
    return Math.ceil((pastDays + firstDayOfYear.getDay() + 1) / 7);
  };

  return (
    <div>
      <button onClick={toggleView} style={{ marginTop: '1rem', padding: '10px', fontSize: '16px' }}>
        {showWholeWeek ? "Päivän treeni" : "Viikon pläni"}
      </button>

      {showWholeWeek ? (
        trainingData.plan.map((week, index) => (
          <div key={index} className="showWk">
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

                <h3>Ravintosuositus</h3>
                <ul>
                  {Object.entries(details.Ravintosuositus).map(([meal, food]) => (
                    <li key={meal}><strong>{meal}:</strong> {food}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))
      ) : (
        todayTraining ? (
          <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
            <h2>Viikko {getWeekNumber()}, {todayTraining[0].charAt(0).toUpperCase() + todayTraining[0].slice(1)} {new Date().toLocaleDateString()}</h2>
            <Button style={{ backgroundColor: dayCompleted ? 'green' : 'red' }} onClick={submit}>
              {dayCompleted ? "Tallenna" : "? "}              
            </Button>{error && <h3>{error}</h3>}
            <p><strong>Tavoite:</strong> {todayTraining[1].Tavoite}</p>
            <p><strong>Lämmittely (10 min):</strong> {todayTraining[1]['Lämmittely (10 min)']}</p>

            <h3>Voimaharjoittelu</h3>
            <ul>
              {todayTraining[1].Voimaharjoittelu.map((exercise, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <Button style={{ width: '100%' }} onClick={() => markDone(i)}>{exercise}</Button>
                  <Button style={getButtonStyle(i)} onClick={() => markDone(i)}>
                    {done[i] ? 'Ok' : '?'}
                  </Button>
                </div>
              ))}
            </ul>

            <Button onClick={openNutrientation}>{nutriation ? 'Piilota' : 'Ravintoinfo'}</Button>
            {nutriation && (
              <div>
                <h3>Ravintosuositus</h3>
                <ul>
                  {Object.entries(todayTraining[1].Ravintosuositus).map(([meal, food]) => (
                    <li key={meal}><strong>{meal}:</strong> {food}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : <div>Ei treeniohjelmaa tälle päivälle.</div>
      )}
    </div>
  );
};

export default TrainingPlan;
