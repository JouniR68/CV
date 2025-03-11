import React, { useEffect, useState } from 'react';
import trainingData from "../../../data/aito.json"; // Replace with the correct path to your JSON data
import { Button } from '@mui/material';
import { db } from "../../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import Heavy from '../Dialogs/Heavy';

const TrainingPlan = () => {
  const [data, setData] = useState([]);
  const [dayCompleted, setDayCompleted] = useState(false);
  const [nutrition, showNutrition] = useState(false);
  const [showWholeWeek, setShowWholeWeek] = useState(false);
  const [done, setDone] = useState([]);
  const [error, setError] = useState("");
  const [clicks, setClicks] = useState([]);

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

  useEffect(() => {
    console.log("Data state updated:", data);
  }, [data]);

  // Check if all tasks for today are completed
  useEffect(() => {
    if (todayTraining?.Voimaharjoittelu?.liike?.length > 0) {
      const allExercisesCompleted = todayTraining.Voimaharjoittelu.liike.every((_, index) => {
        const requiredClicks = todayTraining.Voimaharjoittelu.sarja[index];
        const actualClicks = done[index] || 0;
        return actualClicks >= requiredClicks;
      });

      if (allExercisesCompleted) {
        const dateFound = data.some(f => {
          console.log("f date:", f.date)
          return f.date === new Date().toLocaleDateString()
        });
        if (!dateFound) {
          const newEntry = {
            week: getWeekNumber(),
            training: todayTraining.Tavoite,
            date: new Date().toLocaleDateString(),
            hour: new Date().getHours()
          };
          setData(prevData => [...prevData, newEntry]);          
          setDayCompleted(true);
          return
        } 
      } else {
        console.log("Joku treenikerta vielä klikkaamatta");
      }
    }
  }, [done, data]);

  const handleClick = (i) => {
    if (clicks[i] < todayTraining?.Voimaharjoittelu.sarja[i]) {
      console.log("handleClick", clicks);
      setClicks(prev => {
        const newClicks = [...prev];
        newClicks[i] = (newClicks[i] || 0) + 1;
        return newClicks;
      });
      markDone(i);
    } else {
      setError("HandleClick else branch activated, clicks:" + clicks);
    }
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const today = new Date().getDay();
  const viikonpaivat = [
    "Sunnuntai", "Maanantai", "Tiistai", "Keskiviikko", "Torstai", "Perjantai", "Lauantai"
  ];
  let viikonpaiva = viikonpaivat[today];

  // Find today's training data
  const todayTraining = trainingData.plan[0]
    ? Object.entries(trainingData.plan[0]).find(([day]) => day.toLowerCase() === viikonpaiva.toLowerCase())?.[1]
    : {};

  const submit = async () => {
    if (dayCompleted) {
      try {
        const latestEntry = data[data.length - 1];
        console.log("Submit data:", latestEntry);
        if (latestEntry) {
          await addDoc(collection(db, "trainings"), latestEntry);
          setDayCompleted(false);
          setDone([]);
        } else {
          navigate('/errorNote', { state: { title: 'Talletus', description: 'Treeni talletettu' } });
          setTimeout(() => {
            navigate('/');
          }, 4000);

          setError("");
        }
      } catch (err) {
        console.error("Error adding document: ", err);
      }
    }
  };

  const toggleView = () => {
    setShowWholeWeek(prevState => !prevState);
  };

  const handleAnswer = (answer) => {
    console.log("Before update:", data);
    if (answer === "Kyllä") {
      setData(prev => {
        if (prev.length === 0) {
          console.log("No elements in data array, nothing to update.");
          return prev; // Prevents modifying an empty array
        }
        console.log("today: ", todayTraining.Voimaharjoittelu);
        const updatedData = [...prev];
        updatedData[updatedData.length - 1] = {
          ...updatedData[updatedData.length - 1],
          heavy: answer,
          treeni: todayTraining.Voimaharjoittelu?.liike ?? "Ei treeni dataa"
        };
        console.log("Updated data:", updatedData);
        return updatedData;
      });

      setTimeout(() => {
        console.log("Submitting after data update: ", data);
        submit();
      }, 300); // Delay submit to prevent focus issues
    } else {
      console.log(`Vastaus dialogissa ongelma`);
    }
  };

  const markDone = (i) => {
    setDone(prev => {
      const newDone = [...prev];
      newDone[i] = (newDone[i] || 0) + 1; // Increment the count
      return newDone;
    });
  };

  const openNutrition = () => {
    showNutrition(prev => !prev);
  };

  const getButtonStyle = (i) => {
    const clicks = done[i] || 0;
    const requiredClicks = todayTraining?.Voimaharjoittelu?.sarja[i] || 1;

    return {
      backgroundColor: clicks >= requiredClicks ? "green" : clicks > 0 ? "orange" : "red",
      border: "1px solid #ccc",
      color: "black",
    };
  };

  const makeColumnsPretty = (i) => ({
    padding: '0.5rem'
  });

  const getWeekNumber = (date = new Date()) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDays = (date - firstDayOfYear) / (1000 * 60 * 60 * 24); // Days passed
    return Math.ceil((pastDays + firstDayOfYear.getDay()) / 7); // Week number calculation
  };

  return (
    <div>
      <h3>{viikonpaiva} - {todayTraining?.Tavoite}</h3>
      <Button style={{ backgroundColor: dayCompleted ? 'green' : 'white', color: dayCompleted ? 'white' : 'black', fontWeight: 700 }}>
        {dayCompleted ? "Valmis" : "-"}
      </Button>{error && <h3>{error}</h3>}

      {/* Show the training exercises for the day */}
      {todayTraining?.Voimaharjoittelu?.liike && (
        <div>
          <h2>Voimaharjoittelu</h2>

          <table>
            <thead>
              <tr>
                <th>Treeni</th>
                <th>S&T</th>                
                <th>Status</th>
              </tr>
            </thead>

            {todayTraining.Voimaharjoittelu?.liike?.map((exercise, index) => (
              <tbody key={index}>
                <tr>
                  <>
                    <td style={makeColumnsPretty(index)}>
                      {exercise}
                    </td>
                    <td style={makeColumnsPretty(index)}>{todayTraining.Voimaharjoittelu.sarja[index]}/
                    {todayTraining.Voimaharjoittelu.toisto[index]}</td>
                    <td>
                      <div key={index} style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-start', alignItems: 'center' }}>

                        <Button style={getButtonStyle(index)} onClick={() => markDone(index)}>
                          <span style={{ fontWeight: 'bold' }}>{done[index]}</span>
                        </Button>
                        {console.log("clicks: ", clicks[index])}
                      </div>
                    </td>
                  </>
                </tr>
              </tbody>
            ))}
          </table>
          {dayCompleted && <Heavy onAnswer={handleAnswer} />}
        </div>
      )}

      {/* Show HIIT if available */}
      {todayTraining?.HIIT && (
        <div>
          <h2>HIIT</h2>
          <p>{todayTraining.HIIT}</p>
        </div>
      )}

      {/* Show Aerobinen liikunta if available */}
      {todayTraining?.Aerobinen_liikunta && (
        <div>
          <h2>Aerobinen liikunta</h2>
          <p>{todayTraining.Aerobinen_liikunta}</p>
        </div>
      )}

      {/* Show Nutrition if available */}
      {todayTraining?.Ravintosuositus && (
        <div>
          <h2>Ravintosuositus</h2>
          <ul>
            {Object.entries(todayTraining.Ravintosuositus).map(([meal, description], index) => (
              <li key={index}>
                <strong>{meal}</strong>: {description}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Show whole week if toggle is on */}
      {showWholeWeek && (
        <div>
          {Object.entries(trainingData.plan[0]).map(([day, details], index) => (
            <div key={index}>
              <h3>{day}</h3>
              <p>{details.Tavoite}</p>
              {/* Add other details for the day here */}
            </div>
          ))}
        </div>
      )}

      <Button onClick={toggleView}>
        {showWholeWeek ? "Päivän treeni" : "Viikon pläni"}
      </Button>

      <Button onClick={submit} disabled={!dayCompleted}>
        Execute
      </Button>

    </div>
  );
};

export default TrainingPlan;