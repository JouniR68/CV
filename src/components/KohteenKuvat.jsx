import { useState } from 'react';
import { TextField, Button, Box, Typography, LinearProgress } from '@mui/material';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc} from "firebase/firestore"
import { db, storage } from "../firebase"



const UploadComponent = () => {
  const [targetName, setTargetName] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleSubmit = async () => {
    if (!targetName || selectedFiles.length === 0) {
      alert('Kohteen nimi on tarpeen');
      return;
    }

    setLoading(true);
    const uploadPromises = [];
    
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const storageRef = ref(storage, `kohdekuva/${targetName}/${file.name}`);
      const uploadTask = uploadBytes(storageRef, file)
        .then(snapshot => getDownloadURL(snapshot.ref))
        .then(downloadURL => {
          return addDoc(collection(db, 'kohdekuvat'), {
            targetName,
            imageUrl: downloadURL,
            fileName: file.name,
            timestamp: new Date(),
          });
        });

      uploadPromises.push(uploadTask);
    }

    try {
      await Promise.all(uploadPromises);
      alert('Lataus onnistui');
    } catch (error) {
      console.error('Error uploading images: ', error);
      alert('Lataus epäonnistui');
    } finally {
      setLoading(false);
      setProgress(0);
      setSelectedFiles([]);
      setTargetName('');
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={2}>
      <Typography variant="h4">Lataa kohteen kuvat</Typography>
      
      <TextField
        label="Kohteen nimi"
        variant="outlined"
        value={targetName}
        onChange={(e) => setTargetName(e.target.value)}
        fullWidth
        margin="normal"
      />
      
      <Button
        variant="contained"
        component="label"
        fullWidth
      >
        Valitse kuvat
        <input
          type="file"
          hidden
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />
      </Button>

      {selectedFiles.length > 0 && (
        <Typography>{selectedFiles.length} kuvia valittu</Typography>
      )}

      {loading && <LinearProgress variant="determinate" value={progress} />}
      
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={loading}
        fullWidth
        style={{ marginTop: '16px' }}
      >
        {loading ? 'Lataa...' : 'Kuvien lataus'}
      </Button>
    </Box>
  );
};

export default UploadComponent;
