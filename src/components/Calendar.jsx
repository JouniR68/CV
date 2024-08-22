// Calendar.js
import { useState, useEffect, useTransition } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Calendar = () => {
    const { t } = useTranslation();
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({ title: '', date: '' });
    const navigate = useNavigate()

    useEffect(() => {
        const fetchEvents = async () => {
            const eventsCollection = await getDocs(collection(db, 'events'));
            setEvents(eventsCollection.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        };
        fetchEvents();
    }, []);

    const addEvent = async () => {
        const isDateTaken = events.some(event => event.date === newEvent.date);

        if (isDateTaken) {
            alert('This date is already booked.');
        } else {
            await addDoc(collection(db, 'events'), newEvent);
            setEvents([...events, newEvent]);
            setNewEvent({ title: '', date: '' });
        }
    };


    const deletor = async (id) => {

        // Get a reference to the document		
        console.log("Deletor with id:", id);
        const collectionRef = collection(db, "events");
        const docRef = doc(collectionRef, id);

        console.log("docRef: ", docRef)
        deleteDoc(docRef)
            .then(() => {
                console.log("The document successfully deleted")
                navigate('/done', { state: { description: `${id} deleted` } })
            })
            .catch(((error) => {
                console.error("Error removing document: ", error)
                navigate('/error', { state: { locationError: `${id} deleting failed.` } })
            }))

    }

    return (
        <div className="calendar">
            <h2>{t('Calendar')}</h2>
            <input
                type="text"
                placeholder="Event Title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            />
            <input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            />
            <button onClick={addEvent}>{t('addEvent')}</button>

            <ul>
                {events.map(event => (
                    <li key={event.id}>
                        {event.title} on {event.date}
                        <button id="calRemover" onClick={() => deletor(event.id)}>{t('Remove')}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Calendar;
