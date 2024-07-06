import { useState } from "react";
import {
  TextField,
  Button,
  Box, FormControl, InputLabel, NativeSelect
} from "@mui/material";

import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Quick() {
  const navigate = useNavigate();


  const today = new Date().toISOString().split("T")[0]
  const [data, setData] = useState({ fName: "", lName: "", address: "", email: "", phone: "", firmId: "", description: "", pvm: today });
  const [error, setError] = useState({ error: "" })
  const [conn, setConn] = useState('Some technical (cloud) issues, pls call / send mail')

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
      tempErrors.fName = "First name is required";
      isValid = false;
    }
    else if (!data.lName) {
      tempErrors.lName = "Last name is required";
      isValid = false;
    }

    else if (!data.address) {
      tempErrors.address = "Address is required";
      isValid = false;
    }

    else if (!data.description) {
      tempErrors.description = "Pls, fill your message.";
      isValid = false;
    }

    if (!data.email) {
      tempErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      tempErrors.email = "Email is not valid";
      isValid = false;
    }

    setError(tempErrors);
    return isValid;
  };
  
  const save = async () => {

    if (validate()) {
      console.log("data: ", data);
      try {
        if (data != undefined || data != "") {
          //let emailValid = data.email
          //!emailValid.includes('@') ? "Invalid email" : ""

          const itemRef = await addDoc(collection(db, "Firma"), data);
          alert(itemRef.id)
          console.log("document written with id: ", itemRef.id) + " with data: " + data;
          navigate('/thanks')
        }


      } catch (e) {
        console.error("Error adding document ", e.code);
        setConn(e.code)
      }
    }
  };



  return (
    <div className="adder">            
      {conn != "" && conn}
      {conn === "" && <Box
        component="form"
        display="flex"
        flexDirection="column"
        alignItems="start"
        justifyContent="center"

        sx={{
          "& .MuiTextField-root": { mb: -5, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >

        <TextField
          style={{ width: "180px", margin: "5px" }}
          id="fName"
          type="text"
          label="First Name"
          required
          value={data.fName}
          variant="outlined"
          onChange={handleChange}
          error={Boolean(error.fName)}
          helperText={error.fName}

        />

        <TextField
          style={{ width: "180px", margin: "5px" }}
          id="lName"
          type="text"
          label="Last Name"
          required
          value={data.lName}
          variant="outlined"
          onChange={handleChange}
          error={Boolean(error.lName)}
          helperText={error.lName}
        />

        <TextField
          style={{ width: "180px", margin: "5px" }}
          id="address"
          type="text"
          label="Address"
          required
          value={data.address}
          variant="outlined"
          onChange={handleChange}
          error={Boolean(error.address)}
          helperText={error.address}
        />

        <TextField
          style={{ width: "180px", margin: "5px", mt: "-5" }}
          id="email"
          type="text"
          label="Email"
          required
          value={data.email}
          variant="outlined"
          onChange={handleChange}
          error={Boolean(error.email)}
          helperText={error.email}
        />

        <TextField
          style={{ width: "180px", margin: "5px", mt: "-5" }}
          id="phone"
          type="number"
          label="Phonenumber"
          value={data.phone}
          variant="outlined"
          onChange={handleChange}
        />

        <p></p>
        <FormControl>
          <InputLabel variant="standard" htmlFor="uncontrolled-native">
            Pick one
          </InputLabel>
          <NativeSelect
            defaultValue={30}
            inputProps={{
              name: 'interested',
              id: 'uncontrolled-native',
            }}
          >
            <option value="message">The message / viesti</option>
            <option value="web">JS (react, node, css etc) based coding (web) / webbi koodausta.</option>
            <option value="testing">Testing / testausta</option>
            <option value="admin">Admin work, system configuration etc / Pääkäyttäjä tehtäviä</option>
            <option value="consulting">Consulting / neuvontaa, suositteluita</option>
            <option value="installations">Sw installations, updates etc / Ohjelmiston asennuksia tai päivityksiä.</option>
            


          </NativeSelect>
        </FormControl>

        <TextField
          style={{ width: "180px", margin: "5px", mt: "-5" }}
          id="description"
          type="text"
          label="The message"
          required
          value={data.description}
          variant="outlined"
          onChange={handleChange}
          error={Boolean(error.description)}
          helperText={error.description}
          multiline
          rows={4}
        />


        <br />

        <Button variant="contained" color="primary" onClick={() => save()}>
          SAVE
        </Button>
      </Box>}
    </div>
  );
}
