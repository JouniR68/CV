import React, { useState } from "react";
import {
  TextField,
  Button,
  Box
} from "@mui/material";

import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function AddData(props) {
  const { application } = props;

  const today = new Date().toISOString().split("T")[0]
  const [data, setData] = useState({ fName: "", lName: "", address: "", email: "", phone: "", firmId: "", description: "", pvm: today });
  const [error, setError] = useState({ error: "" })

  const handleChange = (event) => {
    console.log("handleChange")
    const { id, value } = event.target;
    console.log("field value:", value)
    setData({ ...data, [id]: value });
  };

  const validate = () => {
    let tempErrors = { fName: "", lName:"", address:"", email: "", phone:"", firmId:"", description:"" };
    let isValid = true;

    if(!data.fName){
      tempErrors.email = "First name is required";
      isValid = false;
    } 
    else if (!data.lName) {
      tempErrors.email = "Last name is required";
      isValid = false;
    }

    else if (!data.address) {
      tempErrors.address = "Address is required";
      isValid = false;
    }

    else if (!data.description) {
      tempErrors.address = "Pls, fill your message.";
      isValid = false;
    }



    if (!data.email) {
      tempErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      tempErrors.email = "Email is not valid";
      isValid = false;
    }

    if (data.firmId.length != 9) {
      tempErrors.firmId = "Company id is not valid"
      isValid = false;
    }

    setError(tempErrors);
    return isValid;
  };
  const resetFields = () => {

    setData({ ...data, [id]: "" })
  }


  //https://firebase.google.com/docs/firestore/quickstart
  const save = async () => {

    if (validate()) {
      console.log("data: ", data);
      try {
        if (data != undefined || data != "") {
          let emailValid = data.email
          !emailValid.includes('@') ? "Invalid email" : ""

          const itemRef = await addDoc(collection(db, "Firma"), data);
          console.log("document written with id: ", itemRef.id) + " with data: " + data;
        }


      } catch (e) {
        console.error("Error adding document ", e);
      }
    }
  };



  return (
    <div>
      <div style={{ textAlign: "left" }}>Prior starting, written agreement from details to be written (especially from the work over few days).<br></br>Fill the form so that I can contact you, thx in advanced.</div>
      <p></p>

      <Box
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
          style={{ width: "200px", margin: "5px" }}
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
          style={{ width: "200px", margin: "5px" }}
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
          style={{ width: "400px", margin: "5px" }}
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



        <br></br>
        <TextField
          style={{ width: "300px", margin: "5px", mt: "-5" }}
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
          style={{ width: "200px", margin: "5px", mt: "-5" }}
          id="phone"
          type="number"
          label="Phonenumber"
          value={data.phone}
          variant="outlined"
          onChange={handleChange}
        />

        <TextField
          style={{ width: "400px", margin: "5px", mt: "-5" }}
          id="firmId"
          type="text"
          label="Company id (Y-tunnus for the billing)"
          value={data.firmId}
          variant="outlined"
          onChange={handleChange}
          error={Boolean(error.firmId)}
          helperText={error.firmId}
        />


        <br />
        <TextField
          style={{ width: "500px", margin: "5px" }}
          id="description"
          type="text"
          label="I need / message:"
          variant="outlined"
          required
          value={data.description}
          multiline
          rows={6}
          onChange={handleChange}
        />
        <br />
        <Button variant="contained" color="primary" onClick={() => save()}>
          SAVE
        </Button>
      </Box>
    </div>
  );
}
