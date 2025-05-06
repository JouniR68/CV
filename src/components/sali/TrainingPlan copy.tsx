import React, { useEffect, useState } from 'react';
import HeavyDialog from './Heavy';
import TrainingTable from './TrainingTable';
import { Button, TextField } from '@mui/material';
import trainingData from '../../data/aito.json';
import { Training } from './types';
import saveTrainingData from './SaveTrainings'; // must be default or use named import correctly
import { getWeekNumber } from './utils';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import VapaaTreeniCheckbox from './Free';

const getFinnishWeekday = (date: Date): string => {
    const weekdays = [
        'maanantai',
        'tiistai',
        'keskiviikko',
        'torstai',
        'perjantai',
        'lauantai',
        'sunnuntai',
    ];
    return weekdays[date.getDay() === 0 ? 6 : date.getDay() - 1];
};

const TrainingPlan: React.FC = () => {
    const navigate = useNavigate();
    const [selectedDate] = useState<Date | null>(new Date());
    const [viikonpaiva, setViikonpaiva] = useState<string>('');
    const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<
        number | null
    >(null);
    const [clicks, setClicks] = useState<number[]>([]);
    const [doneLabel, setDoneLabel] = useState<boolean[]>([]);
    const [currentToisto, setCurrentToisto] = useState<
        number | number[] | null
    >(null);
    const [weightsData, setWeightsData] = useState<number[][]>([]);
    const [repsData, setRepsData] = useState<number[][]>([]);
    const [feedback, setFeedback] = useState<string[]>([]);
    const [clickLocked, setClickLocked] = useState(false);
    const [data, setData] = useState<[]>([]);
    const [resultData, setResultData] = useState<string[][]>([]);
    const [newDate, setNewDate] = useState<string>('');
    const [aero, setAero] = useState<boolean>(false);
    const dayName = selectedDate ? getFinnishWeekday(selectedDate) : null;
    let allCompleted = false;
    const handleVapaaTreeni = () => {
        setAero(!aero);
    };

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
        fetchData();
    }, []); // Run only once after initial render

    const today = new Date().getDay();

    const todayTraining: Training | undefined = trainingData.plan[0]
        ? (Object.entries(trainingData.plan[0]).find(
              ([day]) => day.toLowerCase() === viikonpaiva?.toLowerCase()
          )?.[1] as Training)
        : undefined;

    const getPreviousWeekData = (currentDate) => {
        const currentWeekNumber = getWeekNumber(currentDate);
        console.log('Current Week Number:', currentWeekNumber); // Debugging log

        // Filter for the previous week's data
        const previousWeekData = data.filter((entry) => {
            //console.log('Checking entry:', entry); // Log to inspect the structure
            return entry?.week === currentWeekNumber - 1; // Ensure 'week' field exists
        });

        //console.log('Previous Week Data:', previousWeekData); // Debugging log

        return previousWeekData || {}; // Return the first entry or empty object
    };

    useEffect(() => {
        if (todayTraining?.Voimaharjoittelu) {
            const len = todayTraining.Voimaharjoittelu.liike.length;
            setClicks(Array(len).fill(0));
            setDoneLabel(Array(len).fill(false));
            setWeightsData(Array(len).fill([]));
            setRepsData(Array(len).fill([]));
        }
    }, [selectedDate]);

    const handleClick = (i: number) => {
        if (clickLocked) return;

        const requiredSets = todayTraining?.Voimaharjoittelu.sarja[i];
        if (!requiredSets) return;

        if (clicks[i] >= requiredSets) return;

        setClickLocked(true);
        setTimeout(() => setClickLocked(false), 300); // Lock clicks for 300ms

        const newClicks = [...clicks];
        newClicks[i] += 1;
        setClicks(newClicks);

        const requiredReps = todayTraining?.Voimaharjoittelu.toisto[i];

        if (newClicks[i] === requiredSets) {
            setSelectedExerciseIndex(i);
            setCurrentToisto(requiredReps ?? 0);
        }
    };

    const handleDialogClose = () => {
        setSelectedExerciseIndex(null);
    };

    const handleAnswer = async (
        liike: string,
        palaute: string,
        weights: number[],
        reps: number[],
        result: string[]
    ) => {


        if (liike !== 'Vapaa') {
            //if (selectedExerciseIndex === null) return;

            const updatedDone = [...doneLabel];
            updatedDone[selectedExerciseIndex] = true;
            setDoneLabel(updatedDone);
            allCompleted = updatedDone.every(Boolean);

            const updatedWeights = [...weightsData];
            const updatedReps = [...repsData];
            const updatedFeedback = [...feedback];
            const updatedResults = [...resultData];

            updatedWeights[selectedExerciseIndex] = weights;
            updatedReps[selectedExerciseIndex] = reps;
            updatedFeedback[selectedExerciseIndex] = palaute;
            updatedResults[selectedExerciseIndex] = result;

            setWeightsData(updatedWeights);
            setRepsData(updatedReps);
            setFeedback(updatedFeedback);
            setResultData(updatedResults);

        }

        handleDialogClose(); // Always close the dialog



        if (
            (allCompleted && todayTraining)
        ) {
            try {
                await saveTrainingData(
                    liike,
                    liike !== 'Vapaa' ? todayTraining : undefined,
                    liike !== 'Vapaa' ? weightsData : [weights],
                    liike !== 'Vapaa' ? repsData : [reps],
                    liike !== 'Vapaa' ? feedback : [palaute],
                    liike !== 'Vapaa' ? resultData : [result]
                );
                navigate('/note', {
                    state: {
                        title: 'Talletus',
                        description: 'Treeni talletettu',
                    },
                });
                setTimeout(() => navigate('/'), 4000);
            } catch (err) {
                navigate('/note', {
                    state: {
                        title: 'Talletus',
                        description: 'Talletus ei onnistunut',
                    },
                });
                setTimeout(() => navigate('/'), 4000);
            }
        }
    };

    const getButtonStyle = (i: number): React.CSSProperties => ({
        backgroundColor:
            doneLabel[i] && resultData[i]
                ? 'lightgreen'
                : clicks[i] > 0 && !resultData[i]
                ? 'red'
                : '',
        cursor: 'pointer',
    });

    return (
        <div>
            <VapaaTreeniCheckbox onChange={handleVapaaTreeni} checked={aero} />
            {aero && <HeavyDialog liike='Vapaa' onAnswer={handleAnswer} />}
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

            <h2>Treeni: {viikonpaiva}</h2>

            {todayTraining?.Voimaharjoittelu ? (
                <TrainingTable
                    todayTraining={todayTraining}
                    previousWeekData={getPreviousWeekData(new Date())}
                    clicks={clicks}
                    doneLabel={doneLabel}
                    handleClick={handleClick}
                    getButtonStyle={getButtonStyle}
                />
            ) : (
                <p>Ei voimaharjoittelua tälle päivälle.</p>
            )}

            {selectedExerciseIndex !== null && todayTraining && (
                <HeavyDialog
                    liike={
                        todayTraining.Voimaharjoittelu.liike[
                            selectedExerciseIndex
                        ]
                    }
                    sarja={[
                        todayTraining.Voimaharjoittelu.sarja[
                            selectedExerciseIndex
                        ],
                    ]}
                    //toisto={currentToisto !== null ? currentToisto : undefined}
                    toisto={
                        todayTraining.Voimaharjoittelu.toisto[
                            selectedExerciseIndex
                        ]
                    }
                    onAnswer={handleAnswer}
                />
            )}
        </div>
    );
};

export default TrainingPlan;
