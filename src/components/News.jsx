import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, Typography, DialogActions, Button } from '@mui/material';
import { db } from '../firebase'; // Adjust the path based on your Firebase setup
import { Link } from 'react-router-dom';

export default function CollectionCounts() {
  const [open, setOpen] = useState(false);
  const [counts, setCounts] = useState({ contacts: 0, bugi: 0, events: 0, tarjouspyynto: 0});

  useEffect(() => {
    const fetchCounts = async () => {
      const contactsCount = (await getDocs(collection(db, 'contacts'))).size;
      const tarjouspyyntoCount = (await getDocs(collection(db, 'tarjouspyynto'))).size;
      const querySnapshot = await (getDocs(collection(db, 'bugi')))
      const bugiCount = querySnapshot.docs.filter(doc => doc.data().checked === false).length;
      const eventsCount = (await getDocs(collection(db, 'events'))).size;
      setCounts({ contacts: contactsCount, bugi: bugiCount, events: eventsCount, tarjouspyynto: tarjouspyyntoCount });
      setOpen(true)
    };

    if (sessionStorage.getItem('email') === 'jr@softa-apu.fi') {
      fetchCounts();
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  console.log("counts: ", counts)
  return sessionStorage.getItem('email') === 'jr@softa-apu.fi' ? (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Data yhteenveto</DialogTitle>
      <DialogContent dividers>
        {counts.contacts > 2 && <Typography variant="body1">Tunnareita: {counts.contacts}</Typography>}
      
        {counts.bugi > 0 &&
          <Typography variant="body1">Kuittaamattomia viestejä: <Link to="/palaute">{counts.bugi}</Link></Typography>
        }
        {counts.events > 0 && <Typography variant="body1">Tapahtumia: <Link to="/calendar">{counts.events}</Link></Typography>}
      
        {counts.tarjouspyynto > 0 && <Typography variant="body1">Tarjouspyyntö: <Link to="/admin/naytaPyynnot">{counts.tarjouspyynto}</Link></Typography>}
      
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Sulje
        </Button>
      </DialogActions>
    </Dialog>
  ) : ''
}
