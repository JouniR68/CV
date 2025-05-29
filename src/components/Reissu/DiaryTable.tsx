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

interface DiaryEntry {
    id: string;
    text: string;
    imageUrls?: string[];
    week?: string;
    [key: string]: any; // to allow additional Firestore fields
}

const DiaryTable: React.FC = () => {
    const [entries, setEntries] = useState<DiaryEntry[]>([]);
    const [filteredWeek, setFilteredWeek] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editedText, setEditedText] = useState<string>('');
    const [editedImages, setEditedImages] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [imagesJustAdded, setImagesJustAdded] = useState<boolean>(false);

    const fetchEntries = async () => {
        const querySnapshot = await getDocs(collection(db, 'notes'));
        const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as DiaryEntry[];
        setEntries(data);
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    const handleDelete = async (id: string) => {
        await deleteDoc(doc(db, 'notes', id));
        fetchEntries();
    };

    const handleEdit = (entry: DiaryEntry) => {
        setEditingId(entry.id);
        setEditedText(entry.text);
        setEditedImages(entry.imageUrls || []);
        setNewImages([]);
    };

    const handleImageRemove = (index: number) => {
        setEditedImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleNewImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setImagesJustAdded(true);
        }
        setNewImages(files);
    };

    const handleSave = async (entry: DiaryEntry) => {
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
            timestamp: new Date().toISOString(),
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
                <TableContainer
                    component={Paper}
                    style={{
                        display: 'flex',
                        height: '16rem',
                        overflowY: 'auto',
                    }}
                >
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
                                                            sx={{
                                                                mt: 1,
                                                                bgcolor:
                                                                    imagesJustAdded
                                                                        ? 'green'
                                                                        : 'transparent',
                                                                color: imagesJustAdded
                                                                    ? 'white'
                                                                    : 'inherit',
                                                                '&:hover': {
                                                                    bgcolor:
                                                                        imagesJustAdded
                                                                            ? 'darkgreen'
                                                                            : 'rgba(0,0,0,0.04)',
                                                                },
                                                            }}
                                                            onClick={() =>
                                                                setImagesJustAdded(
                                                                    false
                                                                )
                                                            } // reset after button click
                                                        >
                                                            {imagesJustAdded
                                                                ? 'Images Added'
                                                                : 'Add Images'}
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

export default DiaryTable;
