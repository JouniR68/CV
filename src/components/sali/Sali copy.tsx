import React, { useEffect, useRef, useState } from 'react';
import trainingData from '../../../data/aito.json';
import { Button, TextField } from '@mui/material';
import { db } from '../../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Heavy from './Heavy';
import VapaaTreeniCheckbox from './Free';
import '../../css/sali.css';
import {
    Training,
    TrainingPlanData,
    TrainingEntry,
    Analysis,
    HeavyProps,
} from './types';

const TrainingPlan: React.FC = () => {
    const [data, setData] = useState<TrainingEntry[]>([]);
    const [dayCompleted, setDayCompleted] = useState<boolean>(false);
    const [nutrition, setShowNutrition] = useState<boolean>(false);
    const [showWholeWeek, setShowWholeWeek] = useState<boolean>(false);
    const [done, setDone] = useState<number[]>([]);
    const [error, setError] = useState<string>('');
    const [clicks, setClicks] = useState<number[]>([]);
    const [newDate, setNewDate] = useState<string>('');
    const [viikonpaiva, setViikonpaiva] = useState<string>('');
    const [aero, setAero] = useState<boolean>(false);
    const navigate = useNavigate();
    const addedEntryRef = useRef<boolean>(false);
    const newDataRef = useRef<Partial<TrainingEntry>>({});
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
    const [showHeavy, setShowHeavy] = useState<boolean>(false);
    const [response, setResponse] = useState<Analysis[]>([]);
    const currentExerciseRef = useRef<string>('');
    const sarjaRef = useRef<number[]>([]);
    const toistotRef = useRef<number[]>([]);
    const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<
        number | null
    >(null);

    const todayTraining: Training | undefined = trainingData.plan[0]
        ? (Object.entries(trainingData.plan[0]).find(
              ([day]) => day.toLowerCase() === viikonpaiva.toLowerCase()
          )?.[1] as Training)
        : undefined;

    const [doneLabel, setDoneLabel] = useState(
        () => todayTraining?.Voimaharjoittelu?.liike?.map(() => false) || []
    );

    function getWeekNumber(date) {
        const tempDate = new Date(
            Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
        );
        const dayNum = tempDate.getUTCDay() || 7;
        tempDate.setUTCDate(tempDate.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
        return Math.ceil(((tempDate - yearStart) / 86400000 + 1) / 7);
    }
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

    useEffect(() => {
        if (newDate != '' && newDate != viikonpaivat[today]) {
            setViikonpaiva(newDate);
        } else if (newDate === '') {
            setViikonpaiva(viikonpaivat[today]);
        }
    }, [newDate]);

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

                const newEntry = {
                    week: getWeekNumber(new Date()),
                    date: new Date().toLocaleDateString(),
                    hour: new Date().getHours(),
                    training: todayTraining.Tavoite,
                    details: todayTraining.Voimaharjoittelu.liike,
                };
                newDataRef.current = newEntry;
                newDataRef.current.details_analyysi = response;
                setDayCompleted(true);
                addedEntryRef.current = true; // Mark as added
                return;
            } else {
                console.log('Joku treenikerta vielä klikkaamatta');
            }
        }
    }, [clicks, done, todayTraining]);

    const handleVapaaTreeni = () => {
        setAero(!aero);
        console.log('handleVapaaTreeni, aero: ', aero);
    };

    useEffect(() => {
        if (todayTraining?.Voimaharjoittelu?.liike?.[currentExerciseIndex]) {
            currentExerciseRef.current =
                todayTraining.Voimaharjoittelu.liike[currentExerciseIndex];
            console.log(
                'currentExerciseRef.current on useEffect: ',
                currentExerciseRef.current
            );
        }
    }, [currentExerciseIndex, todayTraining]);

    const getPreviousWeekData = (currentDate) => {
        const currentWeekNumber = getWeekNumber(currentDate);
        console.log('Current Week Number:', currentWeekNumber); // Debugging log

        // Filter for the previous week's data
        const previousWeekData = data.filter((entry) => {
            console.log('Checking entry:', entry); // Log to inspect the structure
            return entry.week === currentWeekNumber - 1; // Ensure 'week' field exists
        });

        console.log('Previous Week Data:', previousWeekData); // Debugging log

        return previousWeekData || {}; // Return the first entry or empty object
    };

    const previousWeekData = getPreviousWeekData(new Date());

    // Debugging the structure of `previousWeekData` to see if it's correct
    console.log('', previousWeekData);

    const markDone = (i) => {
        setDone((prev) => {
            const newDone = [...prev];
            newDone[i] = (newDone[i] || 0) + 1; // Increment the count
            return newDone;
        });
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

    const handleClick = (i) => {
        const currentClicks = clicks[i] || 0;

        if (currentClicks < todayTraining?.Voimaharjoittelu.sarja[i]) {
            setClicks((prev) => {
                const newClicks = [...prev];
                newClicks[i] = currentClicks + 1;
                return newClicks;
            });

            markDone(i);
            sarjaRef.current[i] = todayTraining?.Voimaharjoittelu.sarja[i];
            toistotRef.current[i] = todayTraining?.Voimaharjoittelu.toisto[i];

            const requiredClicks = todayTraining?.Voimaharjoittelu.sarja[i];
            if (currentClicks + 1 === requiredClicks) {
                setSelectedExerciseIndex(i);
                setShowHeavy(true);
            }
        } else {
            console.error('handleClick error branch');
        }
    };

    //console.log("toistot: ", toistotRef.current)
    const submit = async () => {
        try {
            await addDoc(collection(db, 'trainings'), newDataRef.current);
            setDayCompleted(false);
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
    };

    const toggleView = () => {
        setShowWholeWeek((prevState) => !prevState);
        console.log('päivä / week:', showWholeWeek);
    };

    useEffect(() => {
        console.log('Current response length:', response.length);
        console.log('response data: ', Object.entries(response));
    }, [response]); // Runs whenever response changes

    const handleAnswer = (
        liike: string,
        feedback: string,
        weights: number[],
        reps: number[]
    ) => {
        if (!feedback) {
            console.log('Teksti unohtui');
            return;
        }
        console.log(
            'handleAswer, liike: ',
            liike + 'analyse:',
            feedback + ', weights: ' + weights + ', toistot:',
            reps
        );

        const unit1 = weights[0];
        const unit2 = weights[1] || 0;
        const unit3 = weights[2] || 0;
        const unit4 = weights[3] || 0;
        // Update state correctly
        setResponse((prev) => {
            let updatedResponse = [
                ...prev,
                {
                    liike: liike,
                    analyysi: feedback,
                    unit1: unit1,
                    unit2: unit2,
                    unit3: unit3,
                    unit4: unit4,
                    toistot: reps,
                },
            ];

            console.log('Updated response:', updatedResponse);
            setClicks([]);
            setShowHeavy(false); // Hide Heavy after response

            // Update newDataRef after response updates
            if (liike != 'Vapaa') {
                newDataRef.current = {
                    ...newDataRef.current,
                    details_analyysi: updatedResponse,
                    sarjat: [...sarjaRef.current], // Store updated sets
                    toistot: [...toistotRef.current], // Store updated reps
                };
            } else if (liike === 'Vapaa') {
                updatedResponse = [];
                updatedResponse = [
                    ...prev,
                    {
                        liike: liike,
                        analyysi: feedback,
                        unit1: unit1,
                    },
                ];

                newDataRef.current = {
                    ...newDataRef.current,
                    details_analyysi: updatedResponse,
                    date: new Date().toLocaleDateString(),
                    hour: new Date().getHours(),
                    week: getWeekNumber(new Date()),
                };
            }

            return updatedResponse; // Return the new state
        });

        console.log('currentExerciseIndex: ', currentExerciseIndex);

        if (liike !== 'Vapaa') {
            console.log('currentExerciseIndex:', currentExerciseIndex);
            const liikeIndex = todayTraining.Voimaharjoittelu.liike.findIndex(
                (exercise) => exercise === liike
            );
            setDoneLabel((prev) => {
                const updated = [...prev];
                updated[liikeIndex] = true; // ✅ Mark the exercise that matches 'liike'
                return updated;
            });

            if (
                currentExerciseIndex <
                todayTraining.Voimaharjoittelu.liike.length - 1
            ) {
                setCurrentExerciseIndex((prev) => prev + 1);
            } else if (
                currentExerciseIndex ===
                todayTraining.Voimaharjoittelu.liike.length - 1
            ) {
                submit();
                setSelectedExerciseIndex(null);
            }
        } else {
            submit();
            setSelectedExerciseIndex(null);
        }
    };

    console.log(
        JSON.stringify('previousWeekData struct:', previousWeekData, null, 2)
    );

    /*
                                <th style={{ textAlign: 'center' }}>
                                    Prev kg's
                                </th>

                                    const previousExercise = previousWeekData
                                        .flatMap(
                                            (obj) => obj.details_analyysi || []
                                        )
                                        .find(
                                            (item) => item.liike === exercise
                                        );

                                    // Log to see if previousExercise is actually found
                                    console.log(
                                        'Previous Exercise for ',
                                        exercise,
                                        ':',
                                        previousExercise
                                    );

                                    // Log the previousExercise object
                                    console.log(
                                        'Previous Exercise:',
                                        previousExercise
                                    );

                                    if (previousExercise) {
                                        console.log(
                                            'Previous Exercise Date:',
                                            previousWeekData.date
                                        );
                                    }

                                            <td>
                                                {/* If previousExercise is undefined, show '-' }
                                                {previousExercise
                                                    ? `${
                                                          previousExercise.unit1 ||
                                                          '-'
                                                      }, ${
                                                          previousExercise.unit2 ||
                                                          '-'
                                                      },
                                                  ${
                                                      previousExercise.unit3 ||
                                                      '-'
                                                  }
                                                ${previousExercise.unit4 || ''}`
                                                    : '-'}{' '}
                                            </td>

                                */
    return (
        <div className='sali'>
            <TextField
                style={{
                    marginTop: '1rem',
                    marginRight: '1rem',
                    width: '7rem',
                    border: '1px solid',
                    textAlign: 'center',
                }}
                onChange={(event) => setNewDate(event.target.value)}
                placeholder='päivä?'
            ></TextField>
            <VapaaTreeniCheckbox onChange={handleVapaaTreeni} checked={aero} />
            {error && <h3>{error}</h3>}
            {!showWholeWeek && (
                <div>
                    {aero && <Heavy liike='Vapaa' onAnswer={handleAnswer} />}
                    <h2>
                        {viikonpaiva} - {todayTraining?.Tavoite}
                    </h2>
                    <table>
                        <thead>
                            <tr style={{ backgroundColor: 'orange' }}>
                                <th style={{ textAlign: 'center' }}>Treeni</th>
                                <th style={{ textAlign: 'center' }}>S&T</th>
                                <th style={{ textAlign: 'center' }}>Donet</th>
                            </tr>
                        </thead>
                        <tbody>
                            {todayTraining?.Voimaharjoittelu?.liike?.map(
                                (exercise, index) => {
                                    // Debugging the exercise and the data
                                    console.log('Exercise:', exercise);


                                    return (
                                        <tr key={index}>
                                            <td style={{ marginLeft: '2rem' }}>
                                                {exercise}
                                            </td>
                                            <td style={{ paddingLeft: '2rem' }}>
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
                                            <td style={{ paddingLeft: '1rem' }}>
                                                <Button
                                                    style={getButtonStyle(
                                                        index
                                                    )}
                                                    onClick={() =>
                                                        handleClick(index)
                                                    }
                                                >
                                                    {doneLabel[index]
                                                        ? 'Done'
                                                        : clicks[index] ||
                                                          'Do it'}
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            {showHeavy && (
                <Heavy
                    onAnswer={handleAnswer}
                    liike={
                        todayTraining.Voimaharjoittelu.liike[
                            selectedExerciseIndex
                        ]
                    }
                    sarja={sarjaRef.current}
                    toisto={toistotRef?.current[selectedExerciseIndex] || []}
                />
            )}
            {console.log('sali, toisto - > Heavylle: ', toistotRef.current)}
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
            <Button onClick={() => toggleView()}>
                {showWholeWeek ? 'Päivän treeni' : 'Viikon pläni'}
            </Button>
        </div>
    );
};

export default TrainingPlan;
