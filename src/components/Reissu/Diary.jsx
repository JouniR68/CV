import React, { useState, useEffect } from 'react';
import {
    ToggleButtonGroup,
    ToggleButton,
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Grid,
} from '@mui/material';
import {
    updateDoc,
    doc,
    deleteDoc,
    collection,
    addDoc,
    getDocs,
    Timestamp,
} from 'firebase/firestore';
import { db, storage } from '../../firebase'; // Muokkaa polku oikeaksi
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { styled } from '@mui/material/styles';

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
        onEntryAdded();
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
                            <Button variant='contained' type='submit'>
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    );
};

const DiaryTable = () => {
    const [entries, setEntries] = useState([]);
    const [filteredWeek, setFilteredWeek] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editedText, setEditedText] = useState('');
    const [editedImages, setEditedImages] = useState([]);
    const [newImages, setNewImages] = useState([]);

    const fetchEntries = async () => {
        const querySnapshot = await getDocs(collection(db, 'notes'));
        const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setEntries(data);
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    const handleDelete = async (id) => {
        await deleteDoc(doc(db, 'notes', id));
        fetchEntries();
    };

    const handleEdit = (entry) => {
        setEditingId(entry.id);
        setEditedText(entry.text);
        setEditedImages(entry.imageUrls || []);
        setNewImages([]);
    };

    const handleImageRemove = (index) => {
        setEditedImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleNewImagesChange = (e) => {
        setNewImages(Array.from(e.target.files));
    };

    const handleSave = async (entry) => {
        const docRef = doc(db, 'notes', entry.id);
        let updatedImageUrls = [...editedImages];

        for (let img of newImages) {
            const imageRef = ref(storage, `images/${Date.now()}_${img.name}`);
            await uploadBytes(imageRef, img);
            const url = await getDownloadURL(imageRef);
            updatedImageUrls.push(url);
        }

        await updateDoc(docRef, {
            text: editedText,
            imageUrls: updatedImageUrls,
            timestamp: new Date().toISOString(), // Optional: update timestamp
        });

        setEditingId(null);
        fetchEntries();
    };

    const weeks = [...new Set(entries.map((entry) => entry.week))];

    return (
        <>
            <ToggleButtonGroup
                exclusive
                value={filteredWeek}
                onChange={(e, newWeek) => setFilteredWeek(newWeek)}
                sx={{ mb: 2 }}
            >
                {weeks.map((week) => (
                    <ToggleButton key={week} value={week}>
                        {`Week ${week}`}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>

            {filteredWeek && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Timestamp</TableCell>
                                <TableCell>Entry</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {entries
                                .filter((entry) => entry.week === filteredWeek)
                                .map((entry) => (
                                    <TableRow key={entry.id}>
                                        <TableCell>
                                            {new Date(
                                                entry.timestamp
                                            ).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            {editingId === entry.id ? (
                                                <>
                                                    <TextField
                                                        fullWidth
                                                        multiline
                                                        rows={3}
                                                        value={editedText}
                                                        onChange={(e) =>
                                                            setEditedText(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    <div
                                                        style={{
                                                            marginTop: '8px',
                                                        }}
                                                    >
                                                        {editedImages.map(
                                                            (url, i) => (
                                                                <div
                                                                    key={`${url}-${i}`}
                                                                    style={{
                                                                        display:
                                                                            'inline-block',
                                                                        position:
                                                                            'relative',
                                                                        marginRight: 8,
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={
                                                                            url
                                                                        }
                                                                        alt={`edit-${i}`}
                                                                        width={
                                                                            120
                                                                        }
                                                                        height={
                                                                            80
                                                                        }
                                                                        style={{
                                                                            objectFit:
                                                                                'cover',
                                                                        }}
                                                                    />
                                                                    <Button
                                                                        size='small'
                                                                        onClick={() =>
                                                                            handleImageRemove(
                                                                                i
                                                                            )
                                                                        }
                                                                        style={{
                                                                            position:
                                                                                'absolute',
                                                                            top: 0,
                                                                            right: 0,
                                                                        }}
                                                                    >
                                                                        ❌
                                                                    </Button>
                                                                </div>
                                                            )
                                                        )}{' '}
                                                    </div>
                                                    <label
                                                        htmlFor={`edit-upload-${entry.id}`}
                                                    >
                                                        <Input
                                                            accept='image/*'
                                                            id={`edit-upload-${entry.id}`}
                                                            type='file'
                                                            multiple
                                                            onChange={
                                                                handleNewImagesChange
                                                            }
                                                        />
                                                        <Button
                                                            variant='outlined'
                                                            component='span'
                                                            sx={{ mt: 1 }}
                                                        >
                                                            Add Images
                                                        </Button>
                                                    </label>
                                                </>
                                            ) : (
                                                <>
                                                    <Typography>
                                                        {entry.text}
                                                    </Typography>
                                                    {entry.imageUrls &&
                                                        entry.imageUrls.map(
                                                            (url, idx) => (
                                                                <img
                                                                    key={`${url}-${idx}`}
                                                                    src={url}
                                                                    alt={`uploaded-${idx}`}
                                                                    width='200'
                                                                    height='150'
                                                                    style={{
                                                                        objectFit:
                                                                            'cover',
                                                                        marginTop:
                                                                            '8px',
                                                                        marginRight:
                                                                            '8px',
                                                                    }}
                                                                />
                                                            )
                                                        )}
                                                </>
                                            )}
                                        </TableCell>
                                        <TableCell>{entry.location}</TableCell>
                                        <TableCell>
                                            {editingId === entry.id ? (
                                                <>
                                                    <Button
                                                        variant='contained'
                                                        color='primary'
                                                        onClick={() =>
                                                            handleSave(entry)
                                                        }
                                                        sx={{ mr: 1 }}
                                                    >
                                                        Save
                                                    </Button>
                                                    <Button
                                                        variant='outlined'
                                                        onClick={() =>
                                                            setEditingId(null)
                                                        }
                                                    >
                                                        Cancel
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        variant='outlined'
                                                        onClick={() =>
                                                            handleEdit(entry)
                                                        }
                                                        sx={{ mr: 1 }}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant='outlined'
                                                        color='error'
                                                        onClick={() =>
                                                            handleDelete(
                                                                entry.id
                                                            )
                                                        }
                                                    >
                                                        X
                                                    </Button>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </>
    );
};

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
