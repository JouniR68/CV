import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { styled } from '@mui/material/styles';
import DiaryTable from './DiaryTable';

// Styled component
const Input = styled('input')({
  display: 'none',
});

// Utility: Get ISO week number
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((+d - +yearStart) / 86400000 + 1) / 7);
}

// Props interface
interface DiaryFormProps {
  onEntryAdded: () => void;
}

const DiaryForm: React.FC<DiaryFormProps> = ({ onEntryAdded }) => {
  const [text, setText] = useState<string>('');
  const [images, setImages] = useState<File[]>([]);
  const [location, setLocation] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [cooldownActive, setCooldownActive] = useState<boolean>(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false); // NEW

  const fetchLocation = async (): Promise<string> => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          resolve(
            data.display_name || `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`
          );
        } catch (err) {
          console.error('Reverse geocoding failed:', err);
          resolve(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
        }
      });
    });
  };

  useEffect(() => {
    fetchLocation().then((loc) => setLocation(loc));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (cooldownActive) return;

    setSaving(true);
    setCooldownActive(true);

    const imageUrls: string[] = [];
    const now = new Date();
    const docName = `note_${now.toISOString()}`;
    const week = getWeekNumber(now);

    try {
      if (images.length > 0) {
        setUploading(true);
        for (const img of images) {
          const imageRef = ref(storage, `images/${img.name}`);
          await uploadBytes(imageRef, img);
          const url = await getDownloadURL(imageRef);
          imageUrls.push(url);
        }
        setUploading(false);
      }

      await addDoc(collection(db, 'notes'), {
        text,
        imageUrls,
        location,
        timestamp: now.toISOString(),
        name: docName,
        week,
        checked,
      });

      setText('');
      setImages([]);
      setIsSaved(true);
      onEntryAdded();

      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Saving entry failed:', error);
    } finally {
      setSaving(false);
      setUploading(false);
      setTimeout(() => setCooldownActive(false), 30000);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked: isChecked } = event.target;
    setChecked((prev) => ({
      ...prev,
      [name]: isChecked,
    }));
  };

  // Determine the button label based on the current state
  const getButtonLabel = () => {
    if (uploading) return 'Loading...';
    if (saving) return 'Saving...';
    if (isSaved) return 'Saved';
    if (cooldownActive) return 'Wait...';
    return 'Submit';
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant='h5' gutterBottom>
          New Diary Entry
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid item xs={12}>
            <Typography variant='body2' color='textSecondary'>
              Location: {location || 'Fetching location...'}
            </Typography>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label='Write your thoughts...'
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <FormGroup style={{ display: 'flex', flexDirection: 'row' }}>
                <FormControlLabel
                  control={<Checkbox name='trip' onChange={handleChange} />}
                  label='Trip'
                />
                <FormControlLabel
                  control={<Checkbox name='exercise' onChange={handleChange} />}
                  label='Exercise'
                />
                <FormControlLabel
                  control={
                    <Checkbox name='diary' defaultChecked onChange={handleChange} />
                  }
                  label='Diary'
                />
              </FormGroup>
            </Grid>

            <Grid item xs={12}>
              <label htmlFor='upload-image'>
                <Input
                  accept='image/*'
                  id='upload-image'
                  type='file'
                  multiple
                  onChange={handleImageChange}
                />
                <Button
                  variant='outlined'
                  component='span'
                  sx={{
                    bgcolor: images.length > 0 ? 'green' : 'inherit',
                    color: images.length > 0 ? 'white' : 'inherit',
                  }}
                >
                  {images.length > 0 ? 'Loaded' : 'Upload Images'}
                </Button>
              </label>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant='contained'
                type='submit'
                disabled={cooldownActive || saving || uploading}
                sx={{
                  bgcolor: isSaved ? 'green' : undefined,
                  '&:hover': {
                    bgcolor: isSaved ? 'darkgreen' : undefined,
                  },
                }}
              >
                {getButtonLabel()}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

const DiaryComponent = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <div>
      <DiaryForm onEntryAdded={() => setRefresh((prev) => !prev)} />
      <DiaryTable key={refresh} />
    </div>
  );
};

export default DiaryComponent;
