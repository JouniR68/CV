import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';  // Assuming Firebase is configured
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';

const FeedbackTable = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [refresh, setRefresh] = useState(false)
  
  // Fetch data from Firebase on component mount
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'bugi'));
        const feedbackList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFeedbacks(feedbackList);
      } catch (error) {
        console.error('Error fetching feedback: ', error);
      }
    };

    fetchFeedbacks();
  }, [refresh]);


  const signing = async (id) => {
    try {
      const feedbackIndex = feedbacks.findIndex((feedback) => feedback.id === id);
      if (feedbackIndex === -1) return;

      const feedback = feedbacks[feedbackIndex];
      const newCheckedStatus = !feedback.checked;

      const docRef = doc(db, "bugi", id);
      await updateDoc(docRef, { checked: newCheckedStatus });

      const updatedFeedbacks = [...feedbacks];
      updatedFeedbacks[feedbackIndex] = { ...feedback, checked: newCheckedStatus };
      setFeedbacks(updatedFeedbacks);
    } catch (error) {
      console.error('Error updating document: ', error);
    }    
  }

  return (
    <TableContainer component={Paper} style={{ marginTop: '20px', marginLeft: '0rem' }}>
      <Typography variant="h6" align="center" gutterBottom>
        Viestit / bugit / ideat
      </Typography>
      <Table aria-label="feedback table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Päivämäärä</TableCell>
            <TableCell align="left">Nimi / Nimimerkki</TableCell>
            <TableCell align="left">Viesti</TableCell>
            <TableCell align="left">Kuittaus</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {feedbacks.map((feedback) => (
            <TableRow key={feedback.id}>
              {/* Format timestamp to readable date */}
              <TableCell>{new Date(feedback.timestamp.seconds * 1000).toLocaleString()}</TableCell>
              <TableCell>{feedback.name || 'Anonymous'}</TableCell>
              <TableCell>{feedback.message}</TableCell>
              <Button onClick={() => signing(feedback.id)}>{feedback.checked ? "kuitattu": "ei"}</Button>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FeedbackTable;
