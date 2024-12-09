// src/RegistrationForm.js
import { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase"
import { useTranslation } from 'react-i18next';
import { hashPassword } from './Password';
import { useNavigate } from 'react-router-dom';
import "../css/signing.css"

const RegistrationForm = () => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    phoneNumber: '',
    email: '',
    password: '',
    created: new Date().toLocaleDateString()
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
      navigate('/done', { state: { description: ok } });
    } catch (error) {
      console.error('Error saving contact: ', error);
      navigate('/error', { state: { locationError: nok } })
    }
  };

  return (
    <div>
            <Box
                component="form"
                onSubmit={handleSubmit}
                className="register"
            >

        <Typography variant="h5">
          <h5> {t('RegisterationInfo')}</h5>
        </Typography>
        
        <TextField
          label={t('Firstname')}
          variant="outlined"
          name="firstName"
          value={formData.firstName}
          inputProps={{
            style: {
              fontWeight: 'bold'
            },
          }}
          fullWidth
          onChange={handleChange}
          required
        />
        <TextField
          label={t('Lastname')}
          variant="outlined"
          name="lastName"
          value={formData.lastName}
          fullWidth
          inputProps={{
            style: {
              fontWeight: 'bold',
            },
          }}
          onChange={handleChange}
          required
        />
        <TextField
          label={t('RegAddress')}
          variant="outlined"
          name="address"
          value={formData.address}
          fullWidth
          inputProps={{
            style: {
              fontWeight: 'bold',
            },
          }}
          onChange={handleChange}
          required
        />
        <TextField
          label={t('Phone')}
          variant="outlined"
          name="phoneNumber"
          value={formData.phoneNumber}
          fullWidth
          inputProps={{
            style: {
              fontWeight: 'bold',
            },
          }}
          onChange={handleChange}
          required
        />
        <TextField
          label={t('ProfileMail')}
          variant="outlined"
          name="email"
          value={formData.email}
          fullWidth
          inputProps={{
            style: {
              fontWeight: 'bold',
            },
          }}
          onChange={handleChange}
          required
          type="email"
        />
        <TextField
          label={t('password')}
          variant="outlined"
          name="password"
          value={formData.password}
          fullWidth
          inputProps={{
            style: {
              fontWeight: 'bold',
            },
          }}
          onChange={handleChange}
          required
          type="password"
        />


        <Button variant="contained" color="primary" type="submit" size="small">
          {t('Save')}
        </Button>
      </Box>
    </div>
  );
};

export default RegistrationForm;
