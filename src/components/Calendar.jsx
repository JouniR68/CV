// Calendar.js
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, TextField } from '@mui/material';

const Calendar = () => {
    const { t } = useTranslation();
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({ title: '', date: new Date().toISOString().split('T')[0] });
    const navigate = useNavigate()

    useEffect(() => {
        const handleKeyDown = (event) => {
            // Prevent the default action if F5 is pressed
            if (event.key === 'F5' || (event.ctrlKey && event.key === 'r')) {
                event.preventDefault();
                console.log('Refresh is disabled!');
            }
        };

        // Attach the event listener to the window
        window.addEventListener('keydown', handleKeyDown);
    }, [])


    useEffect(() => {
        const fetchEvents = async () => {
            const eventsCollection = await getDocs(collection(db, 'events'));
            setEvents(eventsCollection.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        };
        fetchEvents();
    }, []);

    const addEvent = async () => {
        await addDoc(collection(db, 'events'), newEvent);
        setEvents([...events, newEvent]);
        setNewEvent({ title: '', date: Date() });
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
                navigate(0)
            })
            .catch(((error) => {
                console.error("Error removing document: ", error)
                navigate('/error', { state: { locationError: `${id} deleting failed.` } })
            }))

    }

    return (
        <>
            <h3>{t('Calendar')}</h3>
            <div className="calendar">

                <div className="calendar-form">
                    <TextField
                        placeholder="Tapahtuma"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    />
                    <TextField type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    />
                    <Button onClick={addEvent}>{t('addEvent')}</Button>
                </div>

                <div className="calendar-task-row">
                    {events.map(event => (
                        <>
                        <div className="calendar-task">
                        <li key={event.id}>
                            {event.title}, {event.date}
                            <Button id="calRemover" onClick={() => deletor(event.id)}>Poista</Button>
                        </li>
                        </div>
                        </>
                    ))}
                </div>

            </div>
        </>
    );
};

export default Calendar;
