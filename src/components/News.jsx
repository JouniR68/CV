import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, Typography, DialogActions, Button } from '@mui/material';
import { db } from '../firebase'; // Adjust the path based on your Firebase setup

export default function CollectionCounts() {
  const [open, setOpen] = useState(false);
  const [counts, setCounts] = useState({ contacts: 0, bugi: 0, events: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      const contactsCount = (await getDocs(collection(db, 'contacts'))).size;
      const bugiCount = (await getDocs(collection(db, 'bugi'))).size;
      const eventsCount = (await getDocs(collection(db, 'events'))).size;

      setCounts({ contacts: contactsCount, bugi: bugiCount, events: eventsCount });
      setOpen(true)
    };

    if (sessionStorage.getItem('email') === 'jr@softa-apu.fi') {
      fetchCounts();
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return sessionStorage.getItem('email') === 'jr@softa-apu.fi' ? (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Data yhteenveto</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1">Tunnareita: {counts.contacts}</Typography>
        <Typography variant="body1">Viestejä: {counts.bugi}</Typography>
        <Typography variant="body1">Tapahtumia: {counts.events}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Sulje
        </Button>
      </DialogActions>
    </Dialog>
  ): ''
}
