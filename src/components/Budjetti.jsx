import React, { useState, useEffect } from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import { db } from '../firebase';
import { updateDoc, addDoc, getDocs, doc, collection, deleteDoc } from 'firebase/firestore';
import 'firebase/firestore';

const BudgetManager = () => {
  const [summary, setSummary] = useState([]);
  const [newData, setNewData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const expenseCollection = collection(db, 'budjetti');
  // Fetch data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      const expenseSnapshot = await getDocs(expenseCollection);
      const expenseList = expenseSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSummary(expenseList);
    };
    fetchData();
  }, []);

  // Handle editing data locally
  const handleEdit = (id, field, value) => {
    setSummary(prevSummary =>
      prevSummary.map(expense =>
        expense.id === id ? { ...expense, [field]: value } : expense
      )
    );
  };

  // Save updates to Firebase
  const saveToFirebase = async (id, field, value) => {
    try {
      const expensesDocRef = doc(db, 'budjetti', id)
      await updateDoc(expensesDocRef, { [field]: value });  
      console.log('Document with ID: ${id} updated')
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  // Add new data
  const addNewData = async () => {
    try {
      await addDoc(collection(db, 'budjetti'), newData);
      setOpenDialog(false);
    } catch (error) {
      console.error('Error adding new document:', error);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
    await deleteDoc(doc(db, 'budjetti', id));
    window.location.reload()    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };


  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenDialog(true)}
        style={{ marginBottom: '20px' }}
      >
        Add New Entry
      </Button>

      {/* Add New Data Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Budget Entry</DialogTitle>
        <DialogContent>
          {['aika', 'tulot', 'sahkovesi', 'vakuutukset', 'ruokajuoma', 'liikenne', 'harrastukset', 'ostokset', 'lainatLuotot', 'muutMenot', 'velat'].map((field) => (
            <TextField
              key={field}
              label={field}
              fullWidth
              margin="normal"
              value={newData[field] || ''}
              onChange={(e) => setNewData({ ...newData, [field]: e.target.value })}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={addNewData} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Budget Summary Table */}
      <Table className = "budget-form--summary">
        <TableHead>
          <TableRow>
            <TableCell>Aika</TableCell>
            <TableCell>Tulot</TableCell>
            <TableCell>Sähkö/vesi</TableCell>
            <TableCell>Vakuutukset</TableCell>
            <TableCell>Ruoka/juoma</TableCell>
            <TableCell>Liikenne</TableCell>
            <TableCell>Harrastukset</TableCell>
            <TableCell>Ostokset</TableCell>
            <TableCell>Lainat/Luotot</TableCell>
            <TableCell>Muut Menot</TableCell>
            <TableCell>Velat</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {summary.map((expense) => {
            let prossa = 0;
             const totalExpenses =
             parseFloat(expense.sahkovesi) +
             parseFloat(expense.vakuutukset) +
             parseFloat(expense.ruokajuoma) +
             parseFloat(expense.liikenne) +
             parseFloat(expense.harrastukset) +
             parseFloat(expense.ostokset) +
             parseFloat(expense.lainatLuotot) +
             parseFloat(expense.muutMenot) +
             parseFloat(expense.velat);
            
           if (expense.tulot > 0) {
             prossa =  ((expense.tulot - totalExpenses) / expense.tulot) * 100;
             console.log("prossa: ", prossa + ', tulot: ' + expense.tulot + ', total: ' + totalExpenses);             
           }
            
            return (
            <TableRow key={expense.id}>
              {['aika', 'tulot', 'sahkovesi', 'vakuutukset', 'ruokajuoma', 'liikenne', 'harrastukset', 'ostokset', 'lainatLuotot', 'muutMenot', 'velat'].map((field) => (
                <TableCell key={field} style = {{backgroundColor: prossa < 10 ? 'red' : 'transparent' }}>
                  <TextField
                    value={expense[field] || ''}
                    onChange={(e) => handleEdit(expense.id, field, e.target.value)}
                    onBlur={(e) => saveToFirebase(expense.id, field, e.target.value)}
                  />
                </TableCell>
              ))}
              <TableCell>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDelete(expense.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          )})}
        </TableBody>
      </Table>
    </div>
  );
};

export default BudgetManager;
