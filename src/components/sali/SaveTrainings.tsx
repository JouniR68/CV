import firebase from 'firebase/app'; // Import Firebase
import { db } from '../../firebase';
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { Training } from './types';

function getWeekNumber(date) {
    const tempDate = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const dayNum = tempDate.getUTCDay() || 7;
    tempDate.setUTCDate(tempDate.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
    return Math.ceil(((tempDate - yearStart) / 86400000 + 1) / 7);
}

const SaveTrainingData = async (
    training: Training,
    weights: number[][], // 2D array: weights[exerciseIndex][setIndex]
    reps: number[][], // 2D array: reps[exerciseIndex][setIndex]
    feedbacks: string[], // <-- array of strings
    results: string[][],
    location: string
) => {
    // <-- array of arrays (results per set per exercise)): Promise<void> => {
    try {
        console.log('sijainti: ', location);
        console.log('training.Voimaharjoittelu: ', training.Voimaharjoittelu);
        const trainingDoc = {
            date: new Date().toLocaleDateString(),
            location: location,
            hour: new Date().getHours(),
            week: getWeekNumber(new Date()),
            exercises: training.Voimaharjoittelu.liike.map((liike, i) => {
                const weightSet = Array.isArray(weights[i]) ? weights[i] : [];
                const repSet = Array.isArray(reps[i]) ? reps[i] : [];
                const resultSet = Array.isArray(results[i]) ? results[i] : [];

                return {
                    liike,
                    analyysi:
                        feedbacks[i] !== undefined ? [feedbacks[i]] : [''],
                    sarja: training.Voimaharjoittelu.sarja[i],
                    painot: weightSet ?? 0,
                    toistot: repSet ?? 0,
                    tulos: resultSet,
                };
            }),
        };

        console.log('TrainingDoc:', trainingDoc);
        const timestampId = new Date().toISOString().replace(/:/g, '-'); // e.g., "2025-05-07T14-30-12.123Z"
        await setDoc(doc(db, 'summer', timestampId), {
            ...trainingDoc,
            name: 'Training',
            createdAt: new Date(),
        });
    } catch (error) {
        console.error('Firebase saving error: ', error);
        throw error;
    }
};

export default SaveTrainingData;
