import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box, FormControl, NativeSelect
} from "@mui/material";

import { db } from "../../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import '../../index.css'

export default function Contacts({tilausnro,  contactDetails, onContactChange}) {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const today = new Date().toISOString().split("T")[0]
  const [data, setData] = useState({ fName: "", lName: "", address: "", email: "", phone: "", firmId: "", description: "", pvm: today, tilausnro: tilausnro });
  const [error, setError] = useState({ error: "" })
  const [conn, setConn] = useState('')

  /*
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
*/
  const handleChange = (event) => {
    console.log("handleChange")
    const { name, value } = event.target;    
    onContactChange({...contactDetails, [name]:value})
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
        const itemRef = await addDoc(collection(db, "contacts"), data);
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
        <h3>Yhteystiedot:</h3>      
      <Box
        component="form"
        display="grid"
        gridTemplateColumns="auto auto auto"
        flexDirection="column"
        alignItems="start"
        justifyContent="center"
        gap={1}

        sx={{
          "& .MuiTextField-root": { mb: -4, width: "30ch", height: "12ch" },
        }}
        noValidate
        autoComplete="off"
      >


        <TextField
          id="fName"
          type="text"
          label="Etunimi"
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
          label="Sukunimi"
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
          label="Osoite"
          value={data.address}
          variant="outlined"
          onChange={handleChange}
          error={Boolean(error.address)}
          helperText={error.address}
        />

        <TextField
          id="email"
          type="text"
          label="Sähköposti"
          value={data.email}
          variant="outlined"
          onChange={handleChange}
          error={Boolean(error.email)}
          helperText={error.email}
        />

        <TextField
          id="phone"
          type="number"
          label="Puhelin"
          required
          value={data.phone}
          variant="outlined"
          onChange={handleChange}
        />

        <p></p>

        <TextField
          id="description"
          type="text"
          label="Viesti"
          value={data.description}
          variant="outlined"
          onChange={handleChange}
          error={Boolean(error.description)}
          helperText={error.description}
          multiline
          rows={4}
        />

      </Box>
    </div>
  );
}
