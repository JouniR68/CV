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

export default function Contacts({ contactDetails, onContactChange }) {
    console.log("contactDetails: ", contactDetails + ', ' + onContactChange)
    const navigate = useNavigate();
    const { t } = useTranslation();
    const today = new Date().toISOString().split("T")[0]
    //const [data, setData] = useState({ fName: "", lName: "", address: "", email: "", phone: "", firmId: "", description: "", pvm: today});
    const [error, setError] = useState({ error: "" })

    const handleChange = (Event) => {
        console.log("Contacts handleChange, event: ")
        const { name, value } = Event.target;
        onContactChange({ ...contactDetails, [name]: value })
    };


    return (
        <div>
            <h3>Yhteystiedot:</h3>
            <Box
                component="form"
                display="grid"
                gridTemplateColumns="auto auto auto"
                flexDirection="column"                                                
                gap={1}                
                noValidate
                autoComplete="off"
            >


                <TextField
                    name="Etunimi"
                    type="text"
                    label="Etunimi"                    
                    value={contactDetails.Etunimi || ""}
                    required
                    variant="outlined"
                    onChange={handleChange}
                    error={Boolean(error.Etunimi)}                    
                />

                <TextField
                    name="Sukunimi"
                    type="text"
                    label="Sukunimi"   
                    value={contactDetails.Sukunimi || ""}                 
                    required
                    variant="outlined"
                    onChange={handleChange}
                    error={Boolean(error.Sukunimi)}                    
                />

                <TextField
                    name="Osoite"
                    type="text"
                    label="Osoite"                    
                    variant="outlined"
                    value={contactDetails.Osoite || ""}
                    onChange={handleChange}
                    error={Boolean(error.Osoite)}
                    
                />

                <TextField
                    name="Sähköposti"
                    type="text"
                    label="Sähköposti"
                    value={contactDetails.Sähköposti || ""}
                    variant="outlined"                    
                    onChange={handleChange}
                    error={Boolean(error.email)}
                    helperText={error.email}
                />

                <TextField
                    name="Puhelin"
                    type="number"
                    label="Puhelin"            
                    value={contactDetails.Puhelin || ""}        
                    required
                    variant="outlined"
                    onChange={handleChange}
                />

                <p></p>

                <TextField
                    name="Viesti"
                    type="text"
                    label="Viesti"        
                    value={contactDetails.Viesti || ""}            
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
