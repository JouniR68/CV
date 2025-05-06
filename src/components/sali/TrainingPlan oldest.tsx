import React, { useEffect, useState } from 'react';
import HeavyDialog from './Heavy';
import TrainingTable from './TrainingTable';
import trainingData from '../../data/aito.json';
import { Training } from './types';
import saveTrainingData from './SaveTrainings'; // must be default or use named import correctly
import { getWeekNumber } from './utils';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

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

    const dayName = selectedDate ? getFinnishWeekday(selectedDate) : null;

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


    // Get index of current day
    const weekdays = [
        'maanantai',
        'tiistai',
        'keskiviikko',
        'torstai',
        'perjantai',
        'lauantai',
        'sunnuntai',
        'test',
    ];

    const dayNames = weekdays;
    const currentDayIndex = dayNames.findIndex(
        (d) => d.toLowerCase() === dayName?.toLowerCase()
    );

    // Calculate previous day index
    const previousDayIndex = (currentDayIndex + 2) % 8; // Wrap around to Sunday if it's Monday

    const previousDayName = dayNames[previousDayIndex];

    const todayTraining: Training | undefined = trainingData.plan[0]
        ? (Object.entries(trainingData.plan[0]).find(
              ([day]) => day.toLowerCase() === previousDayName.toLowerCase()
          )?.[1] as Training)
        : undefined;

/*
    const todayTraining: Training | undefined = trainingData.plan[0]
        ? (Object.entries(trainingData.plan[0]).find(
              ([day]) => day.toLowerCase() === dayName?.toLowerCase()
          )?.[1] as Training)
        : undefined;
*/
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
        updatedFeedback[selectedExerciseIndex] = palaute;

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
                    feedback, // ✅ array of strings
                    updatedResults
                );
                setSaveStatus('Training saved successfully!');
            } catch (err) {
                setSaveStatus('Saving training failed!');
            }
        }
    };

    const getButtonStyle = (i: number): React.CSSProperties => ({

        backgroundColor: doneLabel[i] && resultData[i]
            ? 'lightgreen'
            : clicks[i] > 0 && !resultData[i]
            ? 'red'
            : '',
        cursor: 'pointer',
    });

    return (
        <div>
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

            {saveStatus && <div>{saveStatus}</div>}
        </div>
    );
};

export default TrainingPlan;
