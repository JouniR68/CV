import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box, FormControl, NativeSelect
} from "@mui/material";

import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import '../index.css'

export default function Quick() {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const today = new Date().toISOString().split("T")[0]
  const [data, setData] = useState({ fName: "", lName: "", address: "", email: "", phone: "", firmId: "", description: "", pvm: today });
  const [error, setError] = useState({ error: "" })
  const [conn, setConn] = useState('')

  const getData = async () => {
    try {
      const customerRef = collection(db, "Firma")
      const querySnapshot = await getDocs(customerRef)
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      console.log("Customer data: ", data)
    } catch (error) {
      console.error("Error fetching data: ", error)
      throw {
        message: "Datan haku epäonnistui",
        statusText: "Failas",
        status: 403,
      }
    }
  }

  useEffect(() => { getData() }, [])

  const handleChange = (event) => {
    console.log("handleChange")
    const { id, value } = event.target;
    console.log("field value:", value)
    setData({ ...data, [id]: value });
  };

  const validate = () => {
    let tempErrors = { fName: "", lName: "", address: "", email: "", phone: "", firmId: "", description: "" };
    let isValid = true;

    if (!data.fName) {
      tempErrors.fName = t('Firstname-required');
      isValid = false;
    }
    else if (!data.lName) {
      tempErrors.lName = t('Lastname-required');
      isValid = false;
    }

    else if (!data.address) {
      tempErrors.address = t('Address-required');
      isValid = false;
    }

    else if (!data.description) {
      tempErrors.description = t('Email-required');
      isValid = false;
    }

    if (!data.email) {
      tempErrors.email = t('Email-required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      tempErrors.email = t('Email-NotValid');
      isValid = false;
    }

    setError(tempErrors);
    return isValid;
  };

  const save = async () => {
    if (validate()) {
      console.log("data: ", data);
      try {
        const itemRef = await addDoc(collection(db, "messages"), data);
        console.log("document written with id: ", itemRef.id) + " with data: " + data;
        navigate('/thanks')
      } catch (e) {
        console.error("Error adding document ", e.code);
        setConn(e.code)
      }
    }
  };

  return (
    <div>
      {conn != "" && conn}
      {conn === "" && <Box
        component="form"
        display="flex"
        flexDirection="column"
        alignItems="start"
        justifyContent="center"

        sx={{
          "& .MuiTextField-root": { mb: -5, width: "30ch", height:"12ch" },
        }}
        noValidate
        autoComplete="off"
      >

        <TextField
          id="fName"
          type="text"
          label={t('Firstname')}
          required
          value={data.fName}
          variant="outlined"
          onChange={handleChange}
          error={Boolean(error.fName)}
          helperText={error.fName}          
        />

        <TextField
          id="lName"
          type="text"
          label={t('Lastname')}
          required
          value={data.lName}
          variant="outlined"
          onChange={handleChange}
          error={Boolean(error.lName)}
          helperText={error.lName}          
        />

        <TextField
          id="address"
          type="text"
          label={t('Address')}
          value={data.address}
          variant="outlined"
          onChange={handleChange}
          error={Boolean(error.address)}
          helperText={error.address}          
        />

        <TextField
          id="email"
          type="text"
          label={t('Email')}
          required
          value={data.email}
          variant="outlined"
          onChange={handleChange}
          error={Boolean(error.email)}
          helperText={error.email}          
        />

        <TextField
          id="phone"
          required
          type="number"
          label={t('Phone')}
          value={data.phone}
          variant="outlined"
          onChange={handleChange}          
        />

        <p></p>
        <FormControl>
          <NativeSelect
            defaultValue={30}
            inputProps={{
              name: 'interested',
              id: 'uncontrolled-native',
            }}
          >
            <option value="message">{t('Message')}</option>
            <option value="web">JS (react, node, css etc) based coding (web) / webbi koodausta.</option>
            <option value="testing">Testing / testausta</option>
            <option value="admin">Admin work, system configuration etc / Pääkäyttäjä tehtäviä</option>
            <option value="consulting">Consulting / neuvontaa, suositteluita</option>
            <option value="installations">Sw installations, updates etc / Ohjelmiston asennuksia tai päivityksiä.</option>
          </NativeSelect>
        </FormControl>

        <TextField
          id="description"
          type="text"
          label={t('Message')}
          required
          value={data.description}
          variant="outlined"
          onChange={handleChange}
          error={Boolean(error.description)}
          helperText={error.description}
          multiline
          rows={4}          
        />

        <p />
        <p></p>

        <Button variant="contained" color="primary" style={{ mt: 5 }} onClick={() => save()}>
          {t('Save')}
        </Button>

      </Box>}
    </div>
  );
}
