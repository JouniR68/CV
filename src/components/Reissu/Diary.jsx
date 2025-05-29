import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    Grid,
} from '@mui/material';
import {
    collection,
    addDoc,
} from 'firebase/firestore';
import { db, storage } from '../../firebase'; // Muokkaa polku oikeaksi
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { styled } from '@mui/material/styles';
import DiaryTable from './DiaryTable'

const Input = styled('input')({
    display: 'none',
});

function getWeekNumber(date) {
    const d = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

const DiaryForm = ({ onEntryAdded }) => {
    const [text, setText] = useState('');
    const [images, setImages] = useState([]);
    const [location, setLocation] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [cooldownActive, setCooldownActive] = useState(false);

    const fetchLocation = async () => {
        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await res.json();
                    resolve(
                        data.display_name ||
                            `Lat: ${latitude.toFixed(
                                4
                            )}, Lng: ${longitude.toFixed(4)}`
                    );
                } catch (err) {
                    console.error('Reverse geocoding failed:', err);
                    resolve(
                        `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(
                            4
                        )}`
                    );
                }
            });
        });
    };

    useEffect(() => {
        fetchLocation().then((loc) => setLocation(loc));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ✅ Prevent submission if cooldown is active
        if (cooldownActive) return;

        setCooldownActive(true); // ✅ Start cooldown

        const imageUrls = [];
        const now = new Date();
        const docName = `note_${now.toISOString()}`;
        const week = getWeekNumber(now);

        for (let img of images) {
            const imageRef = ref(storage, `images/${img.name}`);
            await uploadBytes(imageRef, img);
            const url = await getDownloadURL(imageRef);
            imageUrls.push(url);
        }

        await addDoc(collection(db, 'notes'), {
            text,
            imageUrls,
            location,
            timestamp: now.toISOString(),
            name: docName,
            week,
        });

        setText('');
        setImages([]);
        setIsSaved(true);
        onEntryAdded();

        setTimeout(() => {
            setIsSaved(false);
        }, 3000);

        // ✅ Reset cooldown after 30 seconds
        setTimeout(() => {
            setCooldownActive(false);
        }, 30000);
    };

    return (
        <Card sx={{ mb: 4 }}>
            <CardContent>
                <Typography variant='h5' gutterBottom>
                    New Diary Entry
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label='Write your thoughts...'
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <label htmlFor='upload-image'>
                                <Input
                                    accept='image/*'
                                    id='upload-image'
                                    type='file'
                                    multiple
                                    onChange={(e) =>
                                        setImages(Array.from(e.target.files))
                                    }
                                />
                                <Button
                                    variant='outlined'
                                    component='span'
                                    sx={{
                                        bgcolor:
                                            images.length > 0
                                                ? 'green'
                                                : 'inherit',
                                        color:
                                            images.length > 0
                                                ? 'white'
                                                : 'inherit',
                                    }}
                                >
                                    {images.length > 0
                                        ? 'Loaded'
                                        : 'Upload Images'}
                                </Button>
                            </label>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant='body2' color='textSecondary'>
                                Location: {location || 'Fetching location...'}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant='contained'
                                type='submit'
                                disabled={cooldownActive}
                                sx={{
                                    bgcolor: isSaved ? 'green' : undefined,
                                    '&:hover': {
                                        bgcolor: isSaved
                                            ? 'darkgreen'
                                            : undefined,
                                    },
                                }}
                            >
                                {isSaved
                                    ? 'Saved'
                                    : cooldownActive
                                    ? 'Wait...'
                                    : 'Submit'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    );
};

<DiaryTable />

const DiaryComponent = () => {
    const [refresh, setRefresh] = useState(false);

    return (
        <div>
            <DiaryForm onEntryAdded={() => setRefresh((prev) => !prev)} />
            <DiaryTable key={refresh} />
        </div>
    );
};

export default DiaryComponent;
