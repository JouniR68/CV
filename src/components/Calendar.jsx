// Calendar.js
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TextField, Button, Grid, Typography, FormControlLabel, Checkbox } from '@mui/material';
import "../css/calendar.css"
import { useAuth } from "./LoginContext";

const Calendar = () => {
    const { t } = useTranslation();
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({ title: '', date: new Date().toISOString().split('T')[0], read: false });
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


    const eventClass = events.map((event) => event.read ? "calendar-readonly" : "calendar-standard" );

    
        // Separate events into read and unread groups
        const readEvents = events.filter(event => event.read);
        const unreadEvents = events.filter(event => !event.read);
    
        return (
            <div className="calendar"  style={{ margin: '1rem auto', padding:'1rem' }}>
                {isLoggedIn ? (
                    <Grid >
                        <Grid item xs={12} md={8} lg={6}>
                            <Typography variant="h5" sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, color:'red', fontWeight:'bold' }}>
                                {t('Calendar-title')}
                            </Typography>
    
                            <Grid spacing={1} container className="calendar-form" sx={{ mt: 2 }}>
                                <Grid item xs={12}>
                                    <TextField
                                        placeholder="Tapahtuma"
                                        value={newEvent.title}
                                        fullWidth
                                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                        inputProps={{ style: { fontSize: '1rem' } }}                                        
                                    />
                                    
                                    <TextField
                                        type="date"
                                        value={newEvent.date}
                                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                        inputProps={{ style: { fontSize: '1rem'} }}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={newEvent.read}
                                                onChange={handleReadOnly}
                                                color="primary"
                                                sx={{ mt: 1, ml: 1 }}
                                            />
                                        }
                                        label="Luku!"
                                    />
                                    <Button onClick={addEvent} variant="contained" sx={{ mt: 1, ml: 1 }}>
                                        {t('addEvent')}
                                    </Button>
                                </Grid>
                            </Grid>
    
                            {/* Read Events */}
                            <Grid container className="calendar-readonly">
                                <h3 style={{paddingLeft:'1rem'}}>{t('EveryDay')}</h3>
                                {readEvents.map(event => (
                                    <Grid item xs={12} key={event.id} sx={{ padding: '0.2rem' }}>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontSize: { xs: '1rem', sm: '1.1rem' },
                                                padding: '0.5rem',
                                                border: '1px solid',
                                            }}
                                        >
                                            {event.date ? `${event.title}, ${event.date}` : event.title}
                                        </Typography>
                                    </Grid>
                                ))}
                            </Grid>
    
                            {/* Unread Events */}
                            {unreadEvents.length > 0 && <Grid container className="calendar-standard">
                            <h3 style={{paddingLeft:'1rem'}}>{t('Deadline')}</h3>
                                {unreadEvents.map(event => (
                                    <Grid
                                        item
                                        xs={12}
                                        key={event.id}
                                        sx={{
                                            padding: '0.3rem',
                                            backgroundColor: event.date < today ? 'red' : 'green',
                                            marginBottom: '0.5rem'
                                        }}
                                    >
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontSize: { xs: '1rem', sm: '1.1rem' },
                                                paddingLeft: { xs: '0.5rem', sm: '0.5rem' },
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                border: '1px solid',
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
                            </Grid>}
                        </Grid>
                    </Grid>
                ) : (
                    <h1 style={{ position: 'fixed', top: '25%', left: '50%' }}>Forbidden</h1>
                )}
            </div>
        );    
                
}

export default Calendar;
