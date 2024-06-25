import { useRef, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import Notificaatio from '../../NotificaatioDialog';

import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const AddItem = () => {
  let isUserLoggedIn = sessionStorage.getItem('loggedIn');
  const nameRef = useRef();
  const kuvausRef = useRef();
  const typeSelectorRef = useRef();

  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [type, setType] = useState('');
  const [work, setWork] = useState(false);
  const [close, setClose] = useState(false);

  console.log('isUserLoggedIn: ', isUserLoggedIn);
  if (!isUserLoggedIn || isUserLoggedIn === false) {
    sessionStorage.setItem('loggedIn', false);
    setError('käyttäjä ei ole kirjautunut');
  } else {
    isUserLoggedIn = true;
  }

  let options = [
    { value: 'firma', label: 'Yritys' },
    { value: 'henkilo', label: 'Henkilöasiakas' },
  ];

  const subjects = [
    { value: 'tilaus', label: 'Tilaus' },
    { value: 'kysely', label: 'Kysely' },
    { value: 'viesti', label: 'Viesti' },
  ];

  const personalSubjects = [{ value: 'tasks', label: 'Tasks' }];

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("data: ", data)
      const response = await axios.post(`http://localhost:3852/rent`, data);
      console.log('json response: ', response.data);
    } catch (err) {
      console.log('Meni aivan vituiksi, error: ', err);
    }
    nameRef.current.value = '';
    kuvausRef.current.value = '';
  };

  const handleData = (e) => {
    console.log('Value: ' + e.value);

    if (e.value === 'work') {      
      setData({ ...data, yhtotto: 'yritys'})
      setWork(true);
    } else {
      setData({ ...data, yhtotto: 'henkilo'})
      setWork(false);
    }

    e.target?.name === 'nimi'
      ? setData({ ...data, kontakti: e.target?.value })
      : null;
    e.target?.name === 'kuvaus'
      ? setData({ ...data, kuvaus: e.target?.value })
      : null;
  };

  const onCloseError = () => {
    console.log('onCloseError');
    console.log('error: ', error);
    setClose(true);
  };

  return (
    <div>
      {error && <Notificaatio message={error} onClose={onCloseError} />}
      {isUserLoggedIn && (
        <form className='adder--form'>
          <Select
            id='adder--select'
            name='selector'
            placeholder="Yritys / henkilö"
            onChange={handleData}
            options={options}
          />

          <Select
            id='adder--select'
            name='subjects'
            placeholder="Aihe"
            onChange={handleData}
            options={subjects}
          />

          <input
            id='adder--input'
            ref={nameRef}
            type='text'
            name='nimi'
            value='jriimala@gmail.com'
            onChange={handleData}
            placeholder='Yhteystieto'
          />

          <textarea
            id='adder--textarea'
            ref={kuvausRef}
            name='kuvaus'
            placeholder='Viesti, alustava kuvaus työntarpeesta'
            onChange={handleData}
          />
          <button id='adder--button' onClick={onSubmit}>
            Lisää data
          </button>
        </form>
      )}
    </div>
  );
};

export default AddItem;
