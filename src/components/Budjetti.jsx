import React, { useState, useEffect } from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import { db } from '../firebase';
import { updateDoc, addDoc, getDocs, doc, collection, deleteDoc } from 'firebase/firestore';
import 'firebase/firestore';
import '../css/budget.css'
import { decodeEntity } from 'html-entities';

const BudgetManager = () => {
  const [summary, setSummary] = useState([]);
  const [latestGoal, setLatestGoal] = useState([]);
  const [newData, setNewData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogGoal, setOpenDialogGoal] = useState(false);
  const expenseCollection = collection(db, 'budjetti');
  const [goal, setGoal] = useState({});
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

  useEffect(() => {
    const fetchGoal = async () => {
      const goalCollection = collection(db, 'goals');
      const expenseSnapshot = await getDocs(goalCollection);
      const goalRef = expenseSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLatestGoal(goalRef);
    };
    fetchGoal();
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

// Add new goal
const addNewGoal = async () => {
  try {
    await addDoc(collection(db, 'goals'), goal);
    setOpenDialogGoal(false);
  } catch (error) {
    console.error('Error adding new goal:', error);
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
      window.location.reload()
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  let count = 1;
  const lGoal = latestGoal.map(f => `${count++}. ${f.tavoite}, ${f.aika}`).join('<br>')

  const monkeyFace = "&#128053;"
  return (
    <div>
      <br></br>
      <h3>Tavoiteet:</h3>
      <span style = {{color: 'white'}} dangerouslySetInnerHTML={{ __html: `${lGoal}`}}></span>      
<p></p>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenDialog(true)}
        style={{ marginBottom: '20px', marginTop: '5px',  }}
      >
        {decodeEntity(monkeyFace)}
      </Button>
      <br></br>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setOpenDialogGoal(true)}
        style={{ marginBottom: '20px' }}
      >
        Uusi Tavoite
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

      <Dialog open={openDialogGoal} onClose={() => setOpenDialogGoal(false)}>
        <DialogTitle>Tavoite entry</DialogTitle>
        <DialogContent>
          {['aika', 'tavoite'].map((field) => (
            <TextField
              key={field}
              label={field}
              fullWidth
              margin="normal"
              value={goal[field] || ''}
              onChange={(e) => setGoal({ ...goal, [field]: e.target.value })}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialogGoal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={addNewGoal} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>


      {/* Budget Summary Table */}
      <Table className="budget-form--summary">
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
            <TableCell>Säästöprosentti</TableCell>
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
              prossa = ((expense.tulot - totalExpenses) / expense.tulot) * 100;
              console.log("prossa: ", prossa + ', tulot: ' + expense.tulot + ', total: ' + totalExpenses);
            }
            //let counter = 0;

            
            return (
              <>            
              <TableRow key={expense.id}>                              
                {['aika', 'tulot', 'sahkovesi', 'vakuutukset', 'ruokajuoma', 'liikenne', 'harrastukset', 'ostokset', 'lainatLuotot', 'muutMenot', 'velat'].map((field) => (
                  <TableCell key={field} style={{ backgroundColor: prossa < 10 ? 'red' : 'transparent' }}>
                    <TextField
                      value={expense[field] || ''}
                      onChange={(e) => handleEdit(expense.id, field, e.target.value)}
                      onBlur={(e) => saveToFirebase(expense.id, field, e.target.value)}
                    />
                  </TableCell>
                ))}
                {/* Add new column for sprossa */}
                <TableCell style={{ backgroundColor: prossa < 10 ? 'red' : 'green' }}>
                  {prossa.toFixed(2)}%
                </TableCell>

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
            </>
            )
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default BudgetManager;
