import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';  // Assuming Firebase is configured
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

const FeedbackTable = () => {
  const [feedbacks, setFeedbacks] = useState([]);

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
  }, []);

  return (
    <TableContainer component={Paper} style={{ marginTop: '20px' }}>
      <Typography variant="h6" align="center" gutterBottom>
        Viestit / bugit / ideat
      </Typography>
      <Table aria-label="feedback table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Päivämäärä</TableCell>
            <TableCell align="left">Nimi / Nimimerkki</TableCell>
            <TableCell align="left">Viesti</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {feedbacks.map((feedback) => (
            <TableRow key={feedback.id}>
              {/* Format timestamp to readable date */}
              <TableCell>{new Date(feedback.timestamp.seconds * 1000).toLocaleString()}</TableCell>
              <TableCell>{feedback.name || 'Anonymous'}</TableCell>
              <TableCell>{feedback.message}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FeedbackTable;
