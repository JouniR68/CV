// src/RegistrationForm.js
import { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase"
import { useTranslation } from 'react-i18next';
import { generatePassword, hashPassword } from './Password';

const RegistrationForm = () => {
  const { t } = useTranslation()
  const userPwd = generatePassword()
  

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    phoneNumber: '',
    email: '',
    password: userPwd
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'contacts'), formData);
      let hashPwd = formData.password
      alert('Contact saved successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        address: '',
        phoneNumber: '',
        email: '',
        hashedPassword: hashPassword(hashPwd)
      });
    } catch (error) {
      console.error('Error saving contact: ', error);
      alert('Failed to save contact');
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
        paddingTop: 4
      }}
    >

      <Typography variant="h5" gutterBottom>
        <div className="registeration">
          <h3>{t('RegisterationForm')}</h3>
          <h6> {t('RegisterationInfo')}</h6>
        </div>

      </Typography>
      <TextField
        label="First Name"
        variant="outlined"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        required
      />
      <TextField
        label="Last Name"
        variant="outlined"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        required
      />
      <TextField
        label="Address"
        variant="outlined"
        name="address"
        value={formData.address}
        onChange={handleChange}
        required
      />
      <TextField
        label="Phone Number"
        variant="outlined"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        required
      />
      <TextField
        label="Email Address"
        variant="outlined"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        type="email"
      />
      <TextField
        label="Copy and save this, only generated supported"
        variant="outlined"
        name="password"
        InputProps={{
          readOnly: true,
        }}
        value={userPwd}
        type="text"
      />

      <Button variant="contained" color="primary" type="submit">
        Save
      </Button>
    </Box>
  );
};

export default RegistrationForm;
