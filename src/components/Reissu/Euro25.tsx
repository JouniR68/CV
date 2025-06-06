import React, { useState, useEffect, ChangeEvent } from 'react';
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
    InputBase,
} from '@mui/material';
import {
    updateDoc,
    doc,
    deleteDoc,
    collection,
    addDoc,
    getDocs,
} from 'firebase/firestore';
import { db, storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface DiaryEntry {
    id: string;
    text: string;
    imageUrls?: string[];
    week?: string;
    timestamp?: string;
    [key: string]: any;
}

const DiaryTable: React.FC = () => {
    const [entries, setEntries] = useState<DiaryEntry[]>([]);
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

    /*const handleDelete = async (id: string) => {
        await deleteDoc(doc(db, 'notes', id));
        await fetchEntries();
    };*/

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

        // Clear editing state and re-fetch
        setNewImages([]);
        setImagesJustAdded(false);
        setEditingId(null);
        setEditedText('');
        setEditedImages([]);
        await fetchEntries();
    };

    const weeks = [...new Set(entries.map((entry) => entry.week))];

    return (
        <>
  <TableContainer>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Timestamp</TableCell>
          <TableCell>Entry</TableCell>
          <TableCell>Location</TableCell>

        </TableRow>
      </TableHead>
      <TableBody>
        {entries
          .filter(
            (entry) =>
              entry.checked?.trip === true
          )
          .map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>
                {new Date(entry.timestamp).toLocaleString()}
              </TableCell>
              <TableCell>{entry.text}</TableCell>
              <TableCell>{entry.location}</TableCell>
              <TableCell>
                {/* Your action buttons here */}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  </TableContainer>

        </>
    );
};

export default DiaryTable;
