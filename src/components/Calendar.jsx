// Calendar.js
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TextField, Button, Grid, Typography, FormControlLabel, Checkbox } from '@mui/material';
import "../css/calendar.css"
import { useAuth } from "./LoginContext";
import NaytaPyynnot from "../components/services/NaytaPyynnot"
import ShowMessages from "./ShowMessages"
import { ThemeProvider } from '@mui/material';
import theme from './Theme';
import DayCounter from './DayCounter';

const Calendar = () => {
    const { t } = useTranslation();
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({ title: '', date: new Date().toISOString().split('T')[0], read: false });
    const [reqs, setReqs] = useState([]);
    const [messages, setMessage] = useState([]);
    const navigate = useNavigate()
    const { isLoggedIn } = useAuth()

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
            newEvent.date = ""
        }

        await addDoc(collection(db, 'events'), newEvent);
        setEvents([...events, newEvent]);
        setNewEvent({ title: '', date: new Date().toISOString().split('T')[0], read: false });
        window.location.reload()
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
                console.log("The document successfully deleted")
                navigate(0)
            })
            .catch(((error) => {
                console.error("Error removing document: ", error)
                navigate('/error', { state: { locationError: `${id} deleting failed.` } })
            }))

        setEvents((events) => events.filter(item => item.id != id))
    }

    const today = new Date().toISOString().split('T')[0];
    let counter = 0;


    const eventClass = events.map((event) => event.read ? "calendar-readonly" : "calendar-standard");
    // Separate events into read and unread groups
    const readEvents = events.filter(event => event.read);
    const unreadEvents = events.filter(event => !event.read);


    return (

        <ThemeProvider theme={theme}>
            {isLoggedIn ? (
                <>
                    <Grid
                        container
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }, // 3 columns on larger screens
                            gap: '2rem',
                            height: '50vh',
                            alignItems: 'center', // Centers items vertically
                            justifyContent: 'center', // Centers items horizontally                            
                            padding: '1rem',
                            marginLeft: '10rem'
                        }}
                    >



                        {/* Form */}
                        <Grid
                            item
                            sx={{
                                gridColumn: { xs: '1', sm: '1', md: '1', lg: '1' }, // Center column on larger screens
                                backgroundColor: 'white',
                                borderRadius: '5px',
                                padding: '2rem',
                                justifySelf: 'center',
                                alignSelf: 'center',
                                width: 'fit-content',
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
                            {!newEvent.read && <TextField
                                type="date"
                                value={newEvent.date}
                                fullWidth
                                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                sx={{ marginBottom: '1rem' }}
                            />
                            }
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


                        {/* Read Events */}
                        <Grid
                            item
                            sx={{
                                gridColumn: { xs: '1', sm: '1', md: '1', lg: '2' }, // Always first column
                                backgroundColor: '#f9f9f9',
                                borderRadius: '5px',
                                padding: '1rem',

                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '1rem' }}>
                                <DayCounter /> {t('EveryDay')}
                            </Typography>
                            {readEvents.map((event) => (
                                <Typography
                                    key={event.id}
                                    sx={{
                                        padding: '0.5rem',
                                        marginBottom: '0.5rem',
                                        backgroundColor: '#e0f7fa',
                                        borderRadius: '5px',
                                    }}
                                >
                                    {event.date ? `${event.title}, ${event.date}` : event.title}
                                </Typography>
                            ))}
                        </Grid>


                        {/* Unread Events */}
                        <Grid
                            item
                            sx={{
                                gridColumn: { xs: '1', sm: '2', md: '3' }, // Last column on larger screens
                                backgroundColor: '#f9f9f9',
                                borderRadius: '5px',
                                padding: '1rem',
                                marginRight: '20rem',
                                marginLeft: '1rem'
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '1rem' }}>
                                {t('Deadline')}
                            </Typography>
                            {unreadEvents.map((event) => (
                                <Grid
                                    key={event.id}
                                    sx={{
                                        marginBottom: '0.5rem',
                                        padding: '0.5rem',
                                        backgroundColor: event.date < today ? 'red' : 'green',
                                        color: 'white',
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
                                        >
                                            {t('Poista')}
                                        </Button>
                                    </Typography>
                                </Grid>
                            ))}
                        </Grid>

                    </Grid>

                    {(reqs.length > 0 || messages.length > 0) && <Grid
                        container
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '1fr', md: '1fr', lg: '1fr' },
                            gap: '1rem',
                            justifyContent: 'center', // Centers items horizontally                            
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
                    }
                </>
            ) : (
                <h1 style={{ position: 'fixed', top: '25%', left: '50%' }}>Forbidden</h1>
            )}
        </ThemeProvider>
    );

}

export default Calendar;
