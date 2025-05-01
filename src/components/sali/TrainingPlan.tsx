import React, { useEffect, useState } from 'react';
import HeavyDialog from '../Dialogs/Heavy';
import TrainingTable from './TrainingTable';
import trainingData from '../../data/aito.json';
import { Training } from './types';
import saveTrainingData from './SaveTrainings'; // must be default or use named import correctly

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
    const [clickLocked, setClickLocked] = useState(false);

    const dayName = selectedDate ? getFinnishWeekday(selectedDate) : null;

    const todayTraining: Training | undefined = trainingData.plan[0]
        ? (Object.entries(trainingData.plan[0]).find(
              ([day]) => day.toLowerCase() === dayName?.toLowerCase()
          )?.[1] as Training)
        : undefined;

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
        reps: number[]
    ) => {
        if (selectedExerciseIndex === null) return;

        const updatedDone = [...doneLabel];
        updatedDone[selectedExerciseIndex] = true;
        setDoneLabel(updatedDone);

        // Store weights and reps for the completed exercise
        const updatedWeights = [...weightsData];
        const updatedReps = [...repsData];
        updatedWeights[selectedExerciseIndex] = weights;
        updatedReps[selectedExerciseIndex] = reps;
        setWeightsData(updatedWeights);
        setRepsData(updatedReps);

        handleDialogClose();

        // Check if all exercises are marked done
        const allCompleted = updatedDone.every(Boolean);

        if (allCompleted && todayTraining) {
            try {
                setSaveStatus('Saving...');
                await saveTrainingData(
                    todayTraining,
                    updatedWeights,
                    updatedReps
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

    return (
        <div>
            <h2>Treeni: {dayName}</h2>

            {todayTraining?.Voimaharjoittelu ? (
                <TrainingTable
                    todayTraining={todayTraining}
                    previousWeekData={[]}
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
                    toisto={currentToisto !== null ? currentToisto : undefined}
                    onAnswer={handleAnswer}
                />
            )}

            {saveStatus && <div>{saveStatus}</div>}
        </div>
    );
};

export default TrainingPlan;
