import React, { useEffect, useRef, useState } from 'react';
import trainingData from '../../../data/aito.json'; // Replace with the correct path to your JSON data
import { Button, TextField } from '@mui/material';
import { db } from '../../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Heavy from '../Dialogs/Heavy';
import VapaaTreeniCheckbox from './Free';
import '../../css/sali.css';

const TrainingPlan = () => {
    const [data, setData] = useState([]);
    const [dayCompleted, setDayCompleted] = useState(false);
    const [nutrition, showNutrition] = useState(false);
    const [showWholeWeek, setShowWholeWeek] = useState(false);
    const [done, setDone] = useState([]);
    const [error, setError] = useState('');
    const [clicks, setClicks] = useState([]);
    const [newDate, setNewDate] = useState('');
    const [viikonpaiva, setViikonpaiva] = useState(''); //
    const [aero, setAero] = useState(false);
    const navigate = useNavigate();
    //const [lock, setLock] = useState(false);
    const addedEntryRef = useRef(false); // Prevent infinite loop
    const newDataRef = useRef([]);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [showHeavy, setShowHeavy] = useState(false);
    const [exerciseCompleted, setExerciseCompleted] = useState(false);
    const [response, setResponse] = useState([]);

    // Fetch training data from Firestore
    const fetchData = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'trainings'));
            const fetchedData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setData(fetchedData);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []); // Run only once after initial render

    const today = new Date().getDay();
    const viikonpaivat = [
        'Sunnuntai',
        'Maanantai',
        'Tiistai',
        'Keskiviikko',
        'Torstai',
        'Perjantai',
        'Lauantai',
    ];

    //If user  types date to the form, it will be stored to newDate variable.
    useEffect(() => {
        if (newDate != '' && newDate != viikonpaivat[today]) {
            setViikonpaiva(newDate);
        } else if (newDate === '') {
            setViikonpaiva(viikonpaivat[today]);
        }
    }, [newDate]);

    const todayTraining = trainingData.plan[0]
        ? Object.entries(trainingData.plan[0]).find(
              ([day]) => day.toLowerCase() === viikonpaiva.toLowerCase()
          )?.[1]
        : {};

    useEffect(() => {
        if (addedEntryRef.current) return; // Prevent multiple entries
        if (todayTraining?.Voimaharjoittelu?.liike?.length > 0) {
            const allExercisesCompleted =
                todayTraining.Voimaharjoittelu.liike.every((_, index) => {
                    const requiredClicks =
                        todayTraining.Voimaharjoittelu.sarja[index];
                    let actualClicks = done[index] || 0;
                    return actualClicks >= requiredClicks;
                });

            if (allExercisesCompleted) {
                const today = new Date().toISOString().split('T')[0]; // Format date to 'YYYY-MM-DD'
                const dateFound = data.some((f) => {
                    console.log('f date:', f.date);
                    return f.date === today;
                });

                if (!dateFound) {
                    const newEntry = {
                        week: getWeekNumber(),
                        date: new Date().toLocaleDateString(),
                        hour: new Date().getHours(),
                        training: todayTraining.Tavoite,
                        details: todayTraining.Voimaharjoittelu.liike,
                    };
                    newDataRef.current = newEntry;
                    //newDataRef.current.details_analyysi = response;
                    setDayCompleted(true);
                    addedEntryRef.current = true; // Mark as added
                    return;
                } else {
                    setDayCompleted(false);
                    setDone([]);
                    navigate('/errorNote', {
                        state: {
                            title: '',
                            description: 'Päivän treeni on jo talletettu',
                        },
                    });
                }
            } else {
                console.log('Joku treenikerta vielä klikkaamatta');
            }
        }
    }, [clicks, done, todayTraining]);

    const handleClick = (i) => {
        console.log('clicks[i]: ', clicks[i]);
        console.log(
            'todayTraining?.Voimaharjoittelu.sarja[i]:',
            todayTraining?.Voimaharjoittelu.sarja[i]
        );

        const currentClicks = clicks[i] || 0; // Default to 0 if undefined

        if (currentClicks < todayTraining?.Voimaharjoittelu.sarja[i]) {
            setClicks((prev) => {
                const newClicks = [...prev];
                newClicks[i] = currentClicks + 1;
                return newClicks;
            });

            markDone(i);

            const requiredClicks = todayTraining?.Voimaharjoittelu.sarja[i];
            if (currentClicks + 1 === requiredClicks) {
                setShowHeavy(true); // Show Heavy component after completing an exercise
            }
        } else {
            console.error('handleClick error branch');
        }
    };

    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    // Find today's training data
    todayTraining
        ? Object.entries(trainingData.plan[0]).find(
              ([day]) => day.toLowerCase() === viikonpaiva.toLowerCase()
          )?.[1]
        : {};

    const submit = async () => {
        //if (dayCompleted) {
        try {
            console.log('today: ', new Date().toLocaleDateString());
            console.log('Data to be pushed:', newDataRef.current);

            await addDoc(collection(db, 'trainings'), newDataRef.current); //push data to the firebase
            setDayCompleted(false); //Initialize dayCompleted and done
            setDone([]);
            navigate('/note', {
                state: {
                    title: 'Talletus',
                    description: 'Treeni talletettu',
                },
            });
            setTimeout(() => {
                navigate('/');
            }, 4000);
            setError('');
        } catch (err) {
            console.error('Error adding document: ', err);
        }
        //}
    };

    const toggleView = () => {
        setShowWholeWeek((prevState) => !prevState);
    };

    useEffect(() => {
        console.log('Current response length:', response.length);
        console.log('response data: ', Object.entries(response));
    }, [response]); // Runs whenever response changes

    const handleAnswer = (feedback, weight) => {
        if (!feedback) {
            console.log('No msg');
            return;
        }
        console.log('analyse:', feedback + ', ' + weight);

        // Update state correctly
        setResponse((prev) => {
            const updatedResponse = [
                ...prev,
                { analyysi: feedback, paino: weight },
            ];
            console.log('Updated response:', updatedResponse);
            setClicks([]);
            setShowHeavy(false); // Hide Heavy after response

            // Update newDataRef after response updates
            newDataRef.current = {
                ...newDataRef.current,
                details_analyysi: updatedResponse,
            };

            return updatedResponse; // Return the new state
        });

        console.log('currentExerciseIndex: ', currentExerciseIndex);
        console.log(
            'todayTraining.Voimaharjoittelu.liike.length - 1: ',
            todayTraining.Voimaharjoittelu.liike.length - 1
        );
        // Move to the next exercise or submit if it's the last one-1
        if (
            currentExerciseIndex <
            todayTraining.Voimaharjoittelu.liike.length - 1
        ) {
            setCurrentExerciseIndex((prev) => prev + 1);
        } else if (
            currentExerciseIndex ===
            todayTraining.Voimaharjoittelu.liike.length - 1
        ) {
            console.log(
                'handleAnswer, currentExerciseIndex === todayTraining.Voimaharjoittelu.liike.length -1'
            );
            submit();
        } else {
            console.error('Jotain meni pieleen handleAnswerissa');
        }
    };

    const markDone = (i) => {
        setDone((prev) => {
            const newDone = [...prev];
            newDone[i] = (newDone[i] || 0) + 1; // Increment the count
            return newDone;
        });
    };

    const openNutrition = () => {
        showNutrition((prev) => !prev);
    };

    const getButtonStyle = (i) => {
        const clicks = done[i] || 0;
        const requiredClicks = todayTraining?.Voimaharjoittelu?.sarja[i] || 1;

        return {
            backgroundColor:
                clicks >= requiredClicks
                    ? 'green'
                    : clicks > 0
                    ? 'orange'
                    : 'red',
            border: '1px solid #ccc',
            color: 'black',
        };
    };

    const makeColumnsPretty = (i) => ({
        padding: '0.5rem',
    });

    const getWeekNumber = (date = new Date()) => {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDays = (date - firstDayOfYear) / (1000 * 60 * 60 * 24); // Days passed
        return Math.ceil((pastDays + firstDayOfYear.getDay()) / 7); // Week number calculation
    };

    const haePaiva = () => {
        console.log('viikonpaiva: ', viikonpaiva);
        setViikonpaiva(viikonpaiva);
    };

    const setDate = (event) => {
        console.log('new date: ', event);
        setNewDate(event);
    };

    const handleVapaaTreeni = () => {
        setAero(!aero);
    };

    return (
        <div>
            <div className='changeDate'>
                <TextField
                    style={{
                        marginTop: '1rem',
                        width: '7rem',
                        border: '1px solid',
                        textAlign: 'center',
                    }}
                    onChange={(event) => setDate(event.target.value)}
                ></TextField>
                <Button
                    style={{ width: 'fit-content', padding: '0.5rem' }}
                    onClick={haePaiva}
                >
                    Hae
                </Button>
                <VapaaTreeniCheckbox onChange={handleVapaaTreeni} />
            </div>

            {!aero &&
                viikonpaiva !== 'Lauantai' &&
                viikonpaiva !== 'Sunnuntai' && (
                    <h3>
                        {viikonpaiva} - {todayTraining?.Tavoite}
                    </h3>
                )}

            <Button
                style={{
                    backgroundColor: dayCompleted ? 'green' : 'lightblue',
                    color: dayCompleted ? 'white' : 'black',
                    fontWeight: 700,
                    border: '1px solid',
                    marginTop: '1rem',
                }}
                //onClick={submit}
            >
                {dayCompleted ? 'Tikissä' : 'Ei suoritettu'}
            </Button>
            {error && <h3>{error}</h3>}

            {/* Show the training exercises for the day
            {!aero && todayTraining?.Voimaharjoittelu?.liike && (
            )}

            */}

            <div>
                <h2>Voimaharjoittelu</h2>

                {showHeavy ? (
                    <Heavy onSubmit={handleAnswer} />
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Treeni</th>
                                <th>S&T</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {todayTraining?.Voimaharjoittelu?.liike?.map(
                                (exercise, index) =>
                                    index === currentExerciseIndex ? ( // Only show the current exercise
                                        <tr key={index}>
                                            <td>{exercise}</td>
                                            <td>
                                                {
                                                    todayTraining
                                                        .Voimaharjoittelu.sarja[
                                                        index
                                                    ]
                                                }
                                                /
                                                {
                                                    todayTraining
                                                        .Voimaharjoittelu
                                                        .toisto[index]
                                                }
                                            </td>
                                            <td>
                                                <Button
                                                    style={getButtonStyle(
                                                        index
                                                    )}
                                                    onClick={() =>
                                                        handleClick(index)
                                                    }
                                                >
                                                    {clicks}
                                                </Button>
                                            </td>
                                        </tr>
                                    ) : null
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {showHeavy && <Heavy onAnswer={handleAnswer} />}

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
                        {Object.entries(todayTraining.Ravintosuositus).map(
                            ([meal, description], index) => (
                                <li key={index}>
                                    <strong>{meal}</strong>: {description}
                                </li>
                            )
                        )}
                    </ul>
                </div>
            )}

            {/* Show whole week if toggle is on */}
            {showWholeWeek && (
                <div>
                    {Object.entries(trainingData.plan[0]).map(
                        ([day, details], index) => (
                            <div key={index}>
                                <h3>{day}</h3>
                                <p>{details.Tavoite}</p>
                                {/* Add other details for the day here */}
                            </div>
                        )
                    )}
                </div>
            )}

            <Button onClick={toggleView}>
                {showWholeWeek ? 'Päivän treeni' : 'Viikon pläni'}
            </Button>

            <Button onClick={submit} disabled={!dayCompleted}>
                Execute
            </Button>
        </div>
    );
};

export default TrainingPlan;
