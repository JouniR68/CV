import React, { useEffect, useState } from 'react';
import HeavyDialog from './Heavy';
import Aero from './Aero';
import TrainingTable from './TrainingTable';
import { Button, TextField } from '@mui/material';
import trainingData from '../../data/aito.json';
import { Training } from './types';
import saveVapaaTraining from './SaveVapaaTraining';
import saveTrainingData from './SaveTrainings'; // must be default or use named import correctly
import { getWeekNumber } from './utils';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';

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
    const [selectedDate] = useState<Date | null>(new Date());
    const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<
        number | null
    >(null);
    const [clicks, setClicks] = useState<number[]>([]);
    const [doneLabel, setDoneLabel] = useState<boolean[]>([]);
    const [currentToisto, setCurrentToisto] = useState<
        number | number[] | null
    >(null);
    const [saveStatus, setSaveStatus] = useState<string | null>(null);
    const [weightsData, setWeightsData] = useState<number[][]>([]);
    const [repsData, setRepsData] = useState<number[][]>([]);
    const [feedback, setFeedback] = useState<string[]>([]);
    const [clickLocked, setClickLocked] = useState(false);
    const [data, setData] = useState<[]>([]);
    const [resultData, setResultData] = useState<string[][]>([]);
    const [viikonpaiva, setViikonpaiva] = useState<string>('');
    const dayName = selectedDate ? getFinnishWeekday(selectedDate) : null;
    const [newDate, setNewDate] = useState<string>('');
    const [aero, setAero] = useState<boolean>(false);
    const navigate = useNavigate();

    const viikonpaivat = [
        'Sunnuntai',
        'Maanantai',
        'Tiistai',
        'Keskiviikko',
        'Torstai',
        'Perjantai',
        'Lauantai',
        'Test',
    ];

    const today = new Date().getDay();

    useEffect(() => {
        if (newDate != '' && newDate != viikonpaivat[today]) {
            setViikonpaiva(newDate);
        } else if (newDate === '') {
            setViikonpaiva(viikonpaivat[today]);
        }
    }, [newDate]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const dateParam = params.get('date'); // e.g. ?date=Maanantai
        console.log('dateParam: ', dateParam);
        if (dateParam) {
            setNewDate(dateParam);
        }
    }, []);

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
            console.log('Checking entry:', entry); // Log to inspect the structure
            return entry?.week === currentWeekNumber - 1; // Ensure 'week' field exists
        });

        console.log('Previous Week Data:', previousWeekData); // Debugging log

        return previousWeekData || {}; // Return the first entry or empty object
    };

    useEffect(() => {
        if (todayTraining?.Voimaharjoittelu) {
            const len = todayTraining.Voimaharjoittelu.liike.length;
            setClicks(Array(len).fill(0));
            setDoneLabel(Array(len).fill(false));
            setWeightsData(Array(len).fill([]));
            setRepsData(Array(len).fill([]));
            setFeedback(Array(len).fill(''));
        }
    }, [todayTraining]);

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

    const handleVapaaAnswer = async (
        liike: string,
        fiilis: string,
        intervals: number,
        timeUsed: number,
        distance: number
    ) => {
        try {
            setSaveStatus('Saving...');
            await saveVapaaTraining(
                liike,
                fiilis,
                intervals,
                timeUsed, // ✅ array of strings
                distance
            );
            setSaveStatus('Training saved successfully!');
        } catch (err) {
            setSaveStatus('Saving training failed!');
        }
    };
    const handleAnswer = async (
        liike: string,
        palaute: string,
        weights: number[],
        reps: number[],
        result: string[]
    ) => {
        if (selectedExerciseIndex === null) return;

        const updatedDone = [...doneLabel];
        updatedDone[selectedExerciseIndex] = true;
        setDoneLabel(updatedDone);

        // Store weights and reps for the completed exercise
        const updatedWeights = [...weightsData];
        const updatedReps = [...repsData];
        const updatedFeedback = [...feedback];

        updatedWeights[selectedExerciseIndex] = weights;
        updatedReps[selectedExerciseIndex] = reps;

        // Ensure the array is long enough
        while (updatedFeedback.length <= selectedExerciseIndex) {
            updatedFeedback.push('');
        }
        updatedFeedback[selectedExerciseIndex] = palaute || 'Ok';

        setWeightsData(updatedWeights);
        setRepsData(updatedReps);
        setFeedback(updatedFeedback);
        const updatedResults = [...resultData]; // <- manage this state like others
        updatedResults[selectedExerciseIndex] = result;
        setResultData(updatedResults); // state for all results

        handleDialogClose();

        // Check if all exercises are marked done
        const allCompleted = updatedDone.every(Boolean);

        if (allCompleted && todayTraining) {
            try {
                setSaveStatus('Saving...');
                await saveTrainingData(
                    todayTraining,
                    updatedWeights,
                    updatedReps,
                    updatedFeedback, // ✅ array of strings
                    updatedResults
                );
                setSaveStatus('Training saved successfully!');
            } catch (err) {
                setSaveStatus('Saving training failed!');
            }
        }
    };

    const getButtonStyle = (i: number): React.CSSProperties => ({
        backgroundColor: doneLabel[i]
            ? 'lightgreen'
            : clicks[i] > 0
            ? '#ffd580'
            : '',
        cursor: 'pointer',
    });

    const vapaaTreeni = () => {
        setAero(!aero);
    };

    const openSaliRapsa = () => {
        navigate('/salirapsa');
    };

    const openAero = () => {
        navigate('/aero');
    };


    return (
        <div>
            <Button onClick={openSaliRapsa}>Sali rapsa</Button>
            <Button onClick={openAero}>Juoksut</Button>
            <h2>Treeni: {dayName}</h2>

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
                <>
                    <p>Ei voimaharjoittelua tälle päivälle.</p>
                    <Button onClick={vapaaTreeni}>
                        Recordaa juoksu/vapaa treeni
                    </Button>
                </>
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

            {saveStatus && <div>{saveStatus}</div>}
            {aero && <Aero onVapaaAnswer={handleVapaaAnswer} />}
        </div>
    );
};

export default TrainingPlan;
