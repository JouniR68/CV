import React, { useState } from 'react';
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Box,
  Typography,
  Paper,
} from '@mui/material';
import { db } from '../../firebase'; // Muokkaa polku oikeaksi
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const Velka: React.FC = () => {
  const [velkoja, setVelkoja] = useState('');
  const [summa, setSumma] = useState('');
  const [kohde, setKohde] = useState('');
  const [aika, setAika] = useState('');
  const [hoidettu, setHoidettu] = useState(false);

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, 'velat'), {
        velkoja,
        summa: parseFloat(summa),
        kohde,
        aika: aika ? Timestamp.fromDate(new Date(aika)) : null,
        hoidettu,
        luotu: Timestamp.now(),
      });
      // Tyhjennä kentät tallennuksen jälkeen
      setVelkoja('');
      setSumma('');
      setKohde('');
      setAika('');
      setHoidettu(false);
      alert('Velka tallennettu!');
    } catch (error) {
      console.error('Virhe tallennettaessa:', error);
      alert('Virhe tallennuksessa.');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, margin: 'auto', mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Lisää uusi velka
      </Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="velkoja"
          value={velkoja}
          onChange={(e) => setVelkoja(e.target.value)}
          required
        />
        <TextField
          label="Summa (€)"
          type="number"
          value={summa}
          onChange={(e) => setSumma(e.target.value)}
          required
        />
        <TextField
          label="Kohde"
          value={kohde}
          onChange={(e) => setKohde(e.target.value)}
        />
        <TextField
          label="Päivämäärä"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={aika}
          onChange={(e) => setAika(e.target.value)}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={hoidettu}
              onChange={(e) => setHoidettu(e.target.checked)}
            />
          }
          label="Hoidettu"
        />
        <Button variant="contained" onClick={handleSubmit}>
          Tallenna velka
        </Button>
      </Box>
    </Paper>
  );
};

export default Velka;
