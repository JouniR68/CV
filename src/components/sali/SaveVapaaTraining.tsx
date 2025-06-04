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

const SaveVapaaTraining = async (
    liike: string,
    fiilis: string,
    intervals: number,
    timeUsed: number,
    distance: number,
    location: string
) => {
    console.log(
        'Vapaa: ' +
            liike +
            ', fiilis: ' +
            fiilis +
            ', intervals: ' +
            intervals +
            ', timeUsed: ' +
            timeUsed +
            ', distance: ' +
            distance +
            ', location: ' +
            location
    );

    try {
        const trainingDoc = {
            date: new Date().toLocaleDateString(),
            hour: new Date().getHours(),
            week: getWeekNumber(new Date()),
            liike,
            fiilis,
            intervals,
            timeUsed,
            distance,
            location,
        };

        console.log('TrainingDoc:', trainingDoc);
        const timestampId = new Date().toISOString().replace(/:/g, '-'); // e.g., "2025-05-07T14-30-12.123Z"
        await setDoc(doc(db, 'aeroTrainings1H', timestampId), {
            ...trainingDoc,
            name: 'Training',
            createdAt: new Date(),
        });
    } catch (error) {
        console.error('Firebase saving error: ', error);
        throw error;
    }
};

export default SaveVapaaTraining;
