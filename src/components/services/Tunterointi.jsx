// src/Tunterointi.js
import { useEffect, useState } from 'react';
import { Button, TextField, Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from "../LoginContext";
import "../../css/tuntikirjaus.css"


function Tunterointi() {
  const [day, setDay] = useState(new Date().toISOString().substr(0, 10));
  const [client, setClient] = useState('');
  const [hours, setHours] = useState(0);
  const [access, setAccess] = useState(false);
  const [description, setDescription] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth()

  const isAccess = sessionStorage.getItem("adminLevel")
  console.log("isAccess: ", isAccess)

  useEffect(() => {
    if (isAccess === "valid") {
      setAccess(true)
    }
  }, [])

  const handleAddEntry = () => {
    const newEntry = {
      day,
      client,
      hours: parseFloat(hours),
      description,
      isPaid,
    };
    setEntries([...entries, newEntry]);
    // Reset inputs
    setClient('');
    setHours(0);
    setDescription('');
    setIsPaid(false);
  };


  console.log("isLoggedIn: ", isLoggedIn)

  const handleInvoice = async () => {
    try {
      handleAddEntry()
      // Save all entries to Firebase
      for (const entry of entries) {
        await addDoc(collection(db, 'tuntikirjanpito'), entry);
      }
      // Navigate to summary component
      navigate('/lasku');
    } catch (error) {
      console.error('Error saving to Firebase:', error);
    }
  };

  return (
    <div className="tuntikirjaus">
      {!access &&
        <h1>Teillä ei ole pääsyä tuntikirjaukseen</h1>
      }
      {access &&
        <div>
          <h1>Tuntikirjaus</h1>
          <TextField
            label="Päivä"
            type="date"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Tilaaja"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Työtunnit"
            type="number"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Selite"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
          />
          <FormControlLabel
            control={<Checkbox checked={isPaid} onChange={(e) => setIsPaid(e.target.checked)} />}
            label="Maksettu"
          />
          <Button variant="contained" onClick={handleAddEntry} style={{ marginRight: 10 }}>
            +
          </Button>
          <Button style={{ margin: '1rem' }} variant="outlined" onClick={() => handleInvoice()}>Talleta
          </Button>
        </div>
      }
    </div>
  );
}

export default Tunterointi;
