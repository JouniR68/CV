import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Button, TextField, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Grid
} from '@mui/material';
import { doc, deleteDoc,  collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';
import { db, storage } from '../../firebase'; // Muokkaa polku oikeaksi

//import { initializeApp } from 'firebase/app';
import { /*getStorage,*/ ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { styled } from '@mui/material/styles';

/*
const app = initializeApp(db);
getFirestore(app);
const storage = getStorage(app);
*/

const Input = styled('input')({
  display: 'none',
});

const DiaryForm = ({ onEntryAdded }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState('');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      setLocation(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = '';

    if (image) {
      const imageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(imageRef, image);
      imageUrl = await getDownloadURL(imageRef);
    }

    await addDoc(collection(db, 'notes'), {
      text,
      imageUrl,
      location,
      timestamp: new Date().toISOString(),
    });

    setText('');
    setImage(null);
    onEntryAdded();
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>New Diary Entry</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Write your thoughts..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <label htmlFor="upload-image">
                <Input
                  accept="image/*"
                  id="upload-image"
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                />
                <Button variant="outlined" component="span">
                  Upload Image
                </Button>
              </label>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">
                Location: {location || 'Fetching location...'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" type="submit">Submit</Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

const DiaryTable = () => {
  const [entries, setEntries] = useState([]);

  const fetchEntries = async () => {
    const querySnapshot = await getDocs(collection(db, 'notes'));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setEntries(data);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'notes', id));
    fetchEntries();
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Text</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Timestamp</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map((entry, idx) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.text}</TableCell>
              <TableCell>
                {entry.imageUrl && (
                  <img src={entry.imageUrl} alt="uploaded" width="400" height="300" style={{ objectFit: 'cover' }} />
                )}
              </TableCell>
              <TableCell>{entry.location}</TableCell>
              <TableCell>{new Date(entry.timestamp).toLocaleString()}</TableCell>
              <TableCell>
                <Button variant="outlined" color="error" onClick={() => handleDelete(entry.id)}>X</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const DiaryComponent = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <div>
      <DiaryForm onEntryAdded={() => setRefresh(prev => !prev)} />
      <DiaryTable key={refresh} />
    </div>
  );
};

export default DiaryComponent;
