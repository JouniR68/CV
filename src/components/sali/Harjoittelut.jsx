import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Import your Firebase configuration
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const Harjoittelut = () => {
  const [date, setDate] = useState('');
  const [target, setTarget] = useState('');
  const [description, setDescription] = useState('');
  const [trainings, setTrainings] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const trainingsCollection = collection(db, 'harjoittelut');

  // Fetch trainings from Firestore
  useEffect(() => {
    const fetchTrainings = async () => {
      const data = await getDocs(trainingsCollection);
      setTrainings(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };

    fetchTrainings();
  }, []);

  // Handle form submission
  const handleSave = async () => {
    const trainingDate = date || new Date().toISOString().split('T')[0];

    if (editingId) {
      const trainingDoc = doc(db, 'harjoittelut', editingId);
      await updateDoc(trainingDoc, {
        date: trainingDate,
        target,
        description,
      });
      setEditingId(null);
    } else {
      await addDoc(trainingsCollection, {
        date: trainingDate,
        target,
        description,
      });
    }

    // Refresh data
    const data = await getDocs(trainingsCollection);
    setTrainings(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));

    // Clear form
    setDate('');
    setTarget('');
    setDescription('');
  };

  // Handle delete
  const handleDelete = async id => {
    const trainingDoc = doc(db, 'harjoittelut', id);
    await deleteDoc(trainingDoc);

    // Refresh data
    setTrainings(trainings.filter(training => training.id !== id));
  };

  // Handle edit
  const handleEdit = training => {
    setDate(training.date);
    setTarget(training.target);
    setDescription(training.description);
    setEditingId(training.id);
  };

  return (
    <div style = {{margin:'1rem'}}>
      
      <form style = {{margin:'1rem', backgroundColor: 'gray', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', width:'50%', borderRadius: '10px'}}>
      <h2>Harjoittelupäiväkirja</h2>
        <TextField
          label="Harjoittelupäivä"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true, fontWeight:'700' }}
        />
        <TextField
          label="Kohde"
          value={target}
          onChange={e => setTarget(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Kuvaus"
          value={description}
          onChange={e => setDescription(e.target.value)}
          multiline
          rows={4}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleSave} fullWidth>
          Talleta
        </Button>
      </form>

      <TableContainer component={Paper} style = {{margin:'1rem', backgroundColor: 'gray', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', width:'50%', borderRadius: '10px'}} >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Päivämäärä</TableCell>
              <TableCell>Kohde</TableCell>
              <TableCell>Kuvaus</TableCell>
              <TableCell>Toiminnot</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trainings.map(training => (
              <TableRow key={training.id}>
                <TableCell>{training.date}</TableCell>
                <TableCell>{training.target}</TableCell>
                <TableCell>{training.description}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(training)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(training.id)} color="secondary">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Harjoittelut;
