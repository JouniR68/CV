// src/RegistrationForm.js
import { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase"
import { useTranslation } from 'react-i18next';
import { hashPassword } from './Password';
import { useNavigate } from 'react-router-dom';

const RegistrationForm = () => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    phoneNumber: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let ok = t('ActionCompleted')
    let nok = t('OperationFailed')

    try {
      const hashPwd = await hashPassword(formData.password);

      formData.password = hashPwd
      await addDoc(collection(db, 'contacts'), formData);
      navigate('/done', { state: { description: ok }});            
    } catch (error) {
      console.error('Error saving contact: ', error);
      navigate('/error', {state: { locationError: nok }})
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: 300,
        margin: 'auto',
        paddingTop: 4,
        '@media (max-width: 600px)': { // Media query for screens 600px and below
          width: '70%',  // Adjust width for mobile devices
        }
      }}
    >

      <Typography variant="h5" gutterBottom>
        <div>
          <h3>{t('RegisterationForm')}</h3>
          <h6 style={{color:'red', textAlign:'left'}}> {t('RegisterationInfo')}</h6>
        </div>

      </Typography>
      <TextField
        label={t('Firstname')}
        variant="outlined"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        required
      />
      <TextField
        label={t('Lastname')}
        variant="outlined"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        required
      />
      <TextField
        label={t('Address')}
        variant="outlined"
        name="address"
        value={formData.address}
        onChange={handleChange}
        required
      />
      <TextField
        label={t('Phone')}
        variant="outlined"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        required
      />
      <TextField
        label={t('ProfileMail')}
        variant="outlined"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        type="email"
      />
      <TextField
        label={t('password')}
        variant="outlined"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
        type="password"
      />


      <Button variant="contained" color="primary" type="submit">
        {t('Save')}
      </Button>
    </Box>
  );
};

export default RegistrationForm;
