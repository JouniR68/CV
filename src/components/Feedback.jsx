import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';  // Assuming Firebase is configured here
import { useNavigate } from 'react-router-dom';

const FeedbackDialog = ({ open, handleClose }) => {
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!message) {
      alert("Message can't be empty");
      return;
    }

    try {
      // Add document to Firebase
      await addDoc(collection(db, 'bugi'), {
        message: message,
        name: name || 'Anonymous',  // If no name provided, default to 'Anonymous'
        timestamp: Timestamp.now(), // Store the current date and time
        checked:false
      });

      // Clear fields
      setMessage('');
      setName('');

      // Close dialog and navigate to "thanks" page
      handleClose();
      navigate('/thanks');
    } catch (error) {
      console.error('Error saving to Firebase: ', error);
      alert('Submission failed. Try again later.');
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"        
        sx={{
          '& .MuiDialogContent-root': {
            padding: '20px'
          },
          '& .MuiDialogTitle-root': {
            paddingBottom: 0
          }          
        }}
      >
        <DialogTitle>Bugi, Idea / nopea viesti</DialogTitle>
        <DialogContent>
          {/* Text area for the feedback */}
          <TextField
            label="Anna viestisi"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            margin="normal"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{
              marginBottom: '16px'
            }}
          />
          {/* Optional TextField for name/alias */}
          <TextField
            label="Nimesi / Nimimerkkisi (valinnainen)"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Peruuta</Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">Lähetä teksti</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FeedbackDialog;
