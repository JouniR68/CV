// Calendar.js
import { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TextField, Button, Grid, Typography, FormControlLabel, Checkbox } from '@mui/material';
import "../../../css/calendar.css";
import { useAuth } from "../../LoginContext";
import NaytaPyynnot from "../../Services/tarjous/NaytaPyynnot";
import ShowMessages from "../../ShowMessages";
import { ThemeProvider } from '@mui/material';
import theme from '../../Theme';
import DayCounter from './DayCounter';

const Calendar = () => {
    const { t } = useTranslation();
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({ title: '', date: new Date().toISOString().split('T')[0], read: false });
    const [reqs, setReqs] = useState([]);
    const [messages, setMessage] = useState([]);
    const navigate = useNavigate();
    const { isLoggedIn, timerCounting } = useAuth();

    useEffect(() => {
        if (!timerCounting) {
            navigate('/logout');
        }
    }, [timerCounting]);

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

        // Cleanup the event listener
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        const fetchEvents = async () => {
            const eventsCollection = await getDocs(collection(db, 'events'));
            setEvents(eventsCollection.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        const fetchEvents = async () => {
            const eventsCollection = await getDocs(collection(db, 'pyynnot'));
            setReqs(eventsCollection.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        const fetchEvents = async () => {
            const eventsCollection = await getDocs(collection(db, 'messages'));
            setMessage(eventsCollection.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        };
        fetchEvents();
    }, []);

    const addEvent = async () => {
        if (newEvent.read) {
            newEvent.date = "";
        }

        await addDoc(collection(db, 'events'), newEvent);
        setEvents([...events, newEvent]);
        setNewEvent({ title: '', date: new Date().toISOString().split('T')[0], read: false });
    };

    const handleReadOnly = () => {
        setNewEvent({ ...newEvent, read: !newEvent.read });
    };

    const deletor = async (id) => {
        // Get a reference to the document
        console.log("Deletor with id:", id);
        const collectionRef = collection(db, "events");
        const docRef = doc(collectionRef, id);

        deleteDoc(docRef)
            .then(() => {
                console.log("The document successfully deleted");
                /*navigate(0);*/
                setEvents((events) => events.filter(item => item.id !== id));
            })
            .catch((error) => {
                console.error("Error removing document: ", error);
                navigate('/error', { state: { locationError: `${id} deleting failed.` } });
            });


    };

    const today = new Date().toISOString().split('T')[0];

    const readEvents = events.filter(event => event.read);

    function addNewLines(str, maxChars = 40) {
        return str
            .match(new RegExp(`.{1,${maxChars}}`, 'g')) // Split string into chunks of maxChars
            .join('\n'); // Join chunks with a newline
    }

    return (
        <ThemeProvider theme={theme}>
            {isLoggedIn ? (
                <>
                    <Grid
                        container
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' },
                            gap: { xs: '0.5rem', sm: '1rem', md: '2rem' },
                            padding: { xs: '0.5rem', sm: '1rem', md: '2rem' },
                            marginBottom: { xs: '1rem', sm: '2rem' },
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            backgroundColor: 'gray'
                        }}
                    >
                        {/* Form */}
                        <Grid
                            item
                            sx={{
                                backgroundColor: 'gray',
                                borderRadius: '5px',
                                padding: '2rem',
                                width: '100%'
                            }}
                        >
                            <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '1rem' }}>
                                {t('Add Event')}
                            </Typography>
                            <TextField
                                placeholder="Tapahtuma"
                                value={newEvent.title}
                                fullWidth
                                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                sx={{ marginBottom: '1rem' }}
                            />
                            {!newEvent.read && (
                                <TextField
                                    type="date"
                                    value={newEvent.date}
                                    fullWidth
                                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                    sx={{ marginBottom: '1rem' }}
                                />
                            )}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={newEvent.read}
                                        onChange={handleReadOnly}
                                        color="primary"
                                    />
                                }
                                label="Luku!"
                            />
                            <Button
                                onClick={addEvent}
                                variant="contained"
                                sx={{ marginTop: '1rem', display: 'block', marginLeft: 'auto' }}
                            >
                                {t('addEvent')}
                            </Button>
                        </Grid>

                        {/* Unread Events */}
                        <Grid
                            item
                            sx={{
                                backgroundColor: 'gray',
                                borderRadius: '5px',
                                padding: '1rem',
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '1rem' }}>
                                {t('Deadline')}
                            </Typography>
                            {events
                                .filter(event => !event.read) // Unread events only
                                .map(event => {
                                    const isPastDue = event.date < today;
                                    return (
                                        <Grid
                                            key={event.id}
                                            sx={{
                                                marginBottom: '0.5rem',
                                                padding: '0.5rem',
                                                backgroundColor: isPastDue ? 'red' : 'green',
                                                color: isPastDue ? 'white' : 'black', // Adjust text color dynamically
                                                borderRadius: '5px',
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                {event.date ? `${event.title}, ${event.date}` : event.title}
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => deletor(event.id)}
                                                    style={{ marginLeft: '0.5rem' }}
                                                >
                                                    {t('Poista')}
                                                </Button>
                                            </Typography>
                                        </Grid>
                                    );
                                })}
                        </Grid>

                        {/* Read Events */}
                        <Grid
                            item
                            sx={{
                                border: '1px solid black',
                                borderRadius: '5px',
                                padding: '1rem',
                            }}
                        >
                            {readEvents.length > 0 && readEvents.map((event) => (
                                <Typography
                                    key={event.id}
                                    sx={{
                                        display: 'flex',
                                        padding: '0.5rem',
                                        marginBottom: '0.5rem',
                                        backgroundColor: 'gray',
                                    }}
                                >
                                    {event.date ? `${event.title}, ${event.date}` : event.title}
                                </Typography>
                            ))}
                        </Grid>
                    </Grid>

                    {(reqs.length > 0 || messages.length > 0) && (
                        <Grid
                            container
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: '1fr', md: '1fr', lg: '1fr' },
                                gap: '1rem',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '1rem',
                            }}
                        >
                            <Grid sx={{ gridColumn: '1' }}>
                                <NaytaPyynnot />
                            </Grid>

                            <Grid sx={{ gridColumn: '1' }}>
                                <ShowMessages />
                            </Grid>
                        </Grid>
                    )}
                </>
            ) : (
                <h5 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Forbidden</h5>
            )}
        </ThemeProvider>
    );
};

export default Calendar;