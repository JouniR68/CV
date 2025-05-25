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
    const getStorageKey = (day: string) => `trainingClicks_${day}`;
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
    const [data, setData] = useState<Training[]>([]);
    const [resultData, setResultData] = useState<string[][]>([]);
    const [viikonpaiva, setViikonpaiva] = useState<string>('');
    const dayName = selectedDate ? getFinnishWeekday(selectedDate) : null;
    const [newDate, setNewDate] = useState<string>('');
    const [aero, setAero] = useState<boolean>(false);
    const [previousWeekData, setPreviousWeekData] = useState<Data[]>([]);
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

    const todayTraining: Training | undefined = trainingData.plan[0]
        ? (Object.entries(trainingData.plan[0]).find(
              ([day]) => day.toLowerCase() === viikonpaiva?.toLowerCase()
          )?.[1] as Training)
        : undefined;

    useEffect(() => {
        if (newDate != '' && newDate != viikonpaivat[today]) {
            setViikonpaiva(newDate);
        } else if (newDate === '') {
            setViikonpaiva(viikonpaivat[today]);
        }
    }, [newDate]);

    useEffect(() => {
        localStorage.removeItem(getStorageKey(viikonpaiva));
        const params = new URLSearchParams(window.location.search);
        const dateParam = params.get('date'); // e.g. ?date=Maanantai
        console.log('dateParam: ', dateParam);
        if (dateParam) {
            setNewDate(dateParam);
        }
    }, []);

    const fetchData = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'trainings1H'));
            const fetchedData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Omit<Training, 'id'>),
            }));
            setData(fetchedData);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []); // Run only once after initial render

    useEffect(() => {
        const fetchPreviousData = async () => {
            if (todayTraining?.Voimaharjoittelu?.liike && data.length > 0) {
                const result = await getPreviousWeekData(
                    new Date(),
                    todayTraining.Voimaharjoittelu.liike
                );
                console.log('result: ', result);
                setPreviousWeekData(result);
            }
        };

        fetchPreviousData();
    }, [data, todayTraining]);

    if (data) {
        console.log('data: ', data);
    }

    const parseDate = (dateStr: string): Date => {
        const [day, month, year] = dateStr.split('.').map(Number);
        return new Date(year, month - 1, day); // month is 0-indexed
    };

    const getPreviousWeekData = async (
        currentDate: Date,
        liikkeet: string[]
    ): Promise<number[][]> => {
        if (!data || data.length === 0) return [];

        const oneWeekAgo = new Date(currentDate);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const results: number[][] = [];

        data.forEach((entry) => {
            const entryDate = parseDate(entry.date); // 🔁 nyt toimii varmasti

            const isSameDay =
                entryDate.getFullYear() === oneWeekAgo.getFullYear() &&
                entryDate.getMonth() === oneWeekAgo.getMonth() &&
                entryDate.getDate() === oneWeekAgo.getDate();

            if (!isSameDay || !Array.isArray(entry.exercises)) return;

            entry.exercises.forEach((exercise) => {
                if (liikkeet.includes(exercise.liike)) {
                    if (Array.isArray(exercise.painot)) {
                        results.push(exercise.painot);
                    }
                }
            });
        });

        return results;
    };

    /*
    useEffect(() => {
        if (clicks.length > 0 && viikonpaiva) {
            const storageKey = getStorageKey(viikonpaiva);
            localStorage.setItem(storageKey, JSON.stringify(clicks));
        }
    }, [clicks, viikonpaiva]);
*/

    useEffect(() => {
        if (todayTraining?.Voimaharjoittelu && viikonpaiva) {
            const len = todayTraining.Voimaharjoittelu.liike.length;
            /*const storageKey = getStorageKey(viikonpaiva);
            const storedClicks = localStorage.getItem(storageKey);

            if (storedClicks) {
                try {
                    const parsed = JSON.parse(storedClicks);
                    if (Array.isArray(parsed) && parsed.length === len) {
                        setClicks(parsed);
                        return;
                    }
                } catch (e) {
                    console.error('localStorage parse error:', e);
                }
            }
                */

            // Fallback if no valid stored data
            setClicks(Array(len).fill(0));
            setDoneLabel(Array(len).fill(false));
            setWeightsData(Array(len).fill([]));
            setRepsData(Array(len).fill([]));
            setFeedback(Array(len).fill(''));
        }
    }, [todayTraining, viikonpaiva]);

    const handleClick = (i: number) => {
        if (clickLocked) return;

        const requiredSets = todayTraining?.Voimaharjoittelu.sarja[i];
        if (!requiredSets) return;

        const currentClicks = clicks[i];
        if (currentClicks >= requiredSets) return;

        setSelectedExerciseIndex(i);
        setCurrentToisto(todayTraining?.Voimaharjoittelu.toisto[i] ?? 0);
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

        const updatedClicks = [...clicks];
        updatedClicks[selectedExerciseIndex] += 1;
        setClicks(updatedClicks);

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

        // Check if all Voimaharjoittelu are marked done
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

    /*
    const liike = todayTraining?.Voimaharjoittelu.liike;
    const preWkData = getPreviousWeekData(new Date(), liike);
    console.log(
        'preWkData pre wk: ',
        preWkData + ', tämän päivän liike: ' + liike
    );
*/

    return (
        <div className='sali'>
            <h2>
                Treeni: {dayName?.toUpperCase()} ({new Date().getDate()}.
                {new Date().getMonth() + 1} )
            </h2>

            {todayTraining?.Voimaharjoittelu ? (
                <TrainingTable
                    todayTraining={todayTraining}
                    previousWeekData={previousWeekData}
                    clicks={clicks}
                    doneLabel={doneLabel}
                    handleClick={handleClick}
                    getButtonStyle={getButtonStyle}
                />
            ) : (
                <>
                    <p>Ei voimaharjoittelua tälle päivälle.</p>
                </>
            )}

            <div className='sali--extrat'>
                <Button onClick={vapaaTreeni}>
                    Recordaa juoksu/vapaa treeni
                </Button>

                <Button onClick={openSaliRapsa}>Sali rapsa</Button>
                <Button onClick={openAero}>Juoksut</Button>
            </div>

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
                    preWeek={previousWeekData[selectedExerciseIndex]}
                    onAnswer={handleAnswer}
                />
            )}

            {saveStatus && <div>{saveStatus}</div>}
            {aero && <Aero onVapaaAnswer={handleVapaaAnswer} />}
        </div>
    );
};

export default TrainingPlan;
