import { useState } from 'react';
import { db } from '../../../firebase'; // Adjust if needed
import { collection, addDoc } from 'firebase/firestore';
import { TextField, Button, Box, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const AddToSuberbForm = () => {
  const [selitys, setSelitys] = useState('');
  const [päivä, setPäivä] = useState(null);
  const [km, setKm] = useState('');
  const [euro, setEuro] = useState('');
  const [ostopaikka, setOstopaikka] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selitys || !päivä || !km || !euro || !ostopaikka) {
      alert('Täytä kaikki kentät');
      return;
    }

    try {
      // Format date to 'dd.MM.yyyy' before saving
      const formattedDate = päivä ? dayjs(päivä).format('DD.MM.YYYY') : '';

      const superbCollection = collection(db, 'suberb');
      await addDoc(superbCollection, {
        selitys,
        päivä: formattedDate, // Store as formatted string
        km: km ? parseFloat(km) : 0,
        euro: euro ? parseFloat(euro) : 0,
        ostopaikka,
      });

      // Clear form fields after successful submission
      setSelitys('');
      setPäivä(null);
      setKm('');
      setEuro('');
      setOstopaikka('');

      alert('Data lisätty onnistuneesti');
    } catch (error) {
      console.error('Virhe tallennettaessa: ', error);
      alert('Virhe tietojen lisäämisessä');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', padding: 2, backgroundColor: 'white' }}>
      <Typography variant="h6" gutterBottom>
        Lisää huoltomerkintä
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Selitys"
          fullWidth
          variant="outlined"
          margin="normal"
          value={selitys}
          onChange={(e) => setSelitys(e.target.value)}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Päivä"
            value={päivä}
            onChange={setPäivä}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </LocalizationProvider>
        <TextField
          label="Km"
          fullWidth
          variant="outlined"
          margin="normal"
          type="number"
          value={km}
          onChange={(e) => setKm(e.target.value)}
        />
        <TextField
          label="€"
          fullWidth
          variant="outlined"
          margin="normal"
          type="number"
          value={euro}
          onChange={(e) => setEuro(e.target.value)}
        />
        <TextField
          label="Ostopaikka"
          fullWidth
          variant="outlined"
          margin="normal"
          value={ostopaikka}
          onChange={(e) => setOstopaikka(e.target.value)}
        />

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
          Tallenna
        </Button>
      </form>
    </Box>
  );
};

export default AddToSuberbForm;
