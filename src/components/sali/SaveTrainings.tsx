import firebase from 'firebase/app'; // Import Firebase
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
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
    reps: number[][] // 2D array: reps[exerciseIndex][setIndex]
): Promise<void> => {
    try {
        console.log('saveTrainingData, weights: ', weights);
        console.log('saveTrainingData, reps: ', reps);

        const trainingDoc = {
            date: new Date().toLocaleDateString(),
            hour: new Date().getHours(),
            week: getWeekNumber(new Date()),
            exercises: training.Voimaharjoittelu.liike.map((liike, i) => {
                const weightSet = weights[i] || [];
                const repSet = reps[i] || [];
                return {
                    liike,
                    sarja: training.Voimaharjoittelu.sarja[i],
                    unit1: weightSet[0] || 0,
                    unit2: weightSet[1] || 0,
                    unit3: weightSet[2] || 0,
                    unit4: weightSet[3] || 0,
                    toistot: reps[i] ?? 0,
                };
            }),
        };

        console.log('TrainingDoc:', trainingDoc);
        await addDoc(collection(db, 'test'), trainingDoc);
    } catch (error) {
        console.error('Firebase saving error: ', error);
        throw error;
    }
};

export default SaveTrainingData