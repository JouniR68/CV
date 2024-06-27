import { useState } from 'react';
import { Container, FormLabel, FormControlLabel, Checkbox, TextField, Button, Box, Typography, MenuItem, IconButton } from '@mui/material';
import Undersigning from './Undersigning';
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const ContractForm = () => {
    const [form, setForm] = useState({
        freelancerName: 'Jouni Riimala',
        clientName: '',
        phone: '',
        address: '',
        companyId: '',
        projectDescription: '',
        startDate: '',
        endDate: '',
        duration: true,
        rate: '',
        travelrate: ''
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "startDate" && value != "" || name === "endDate" && value != "") { 
            console.log("start date or end date has values")
            setForm(form.duration = false) 
        } else {
            setForm(form.duration = true)
        }
        

        
        setForm({ ...form, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const validate = () => {
        let tempErrors = {};
        let isValid = true;

        if (!form.freelancerName) {
            tempErrors.freelancerName = 'Freelancer name is required';
            isValid = false;
        }
        if (!form.clientName) {
            tempErrors.clientName = 'Client name is required';
            isValid = false;
        }

        if (!form.clientName) {
            tempErrors.phone = 'Phonenumber is required';
            isValid = false;
        }

        if (!form.address) {
            tempErrors.address = 'Address is required';
            isValid = false;
        }


        if (!form.companyId) {
            tempErrors.companyId = 'Company Id (Y-id) incorrect';
            isValid = false;
        }
        if (!form.projectDescription) {
            tempErrors.projectDescription = 'Project description is required';
            isValid = false;
        }



        if (!form.rate || !form.travelrate) {
            tempErrors.rate = 'Rate is required, freelancer to fullfill';
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            // Handle form submission, e.g., send form to the server
            if (!form.duration){
                alert("fails")
                return
            }
            console.log("the form is validated")
            try {
                if (form != undefined || form != "") {
                    console.log("Sending form")
                    const contractRef = await addDoc(collection(db, "Contracts"), form);
                    console.log("document written with id: ", contractRef.id) + " with form: " + form;
                    navigate('/thanks')
                }
            } catch (e) {
                console.error("Error adding contract ", e);
            }
        }
        console.log('Form form:', form);
    }

    return (
        <Container maxWidth="sm">
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    mt: 5,
                }}
            >
                <Typography variant="h4" gutterBottom>
                    IT Freelancer Work Contract
                </Typography>
                <FormLabel sx={{ textAlign: "left" }}>Freelancer: Jouni Riimala</FormLabel>
                <FormLabel sx={{ textAlign: "left" }}>Freelancer Company Id: 3210413-8</FormLabel>
                <FormLabel sx={{ textAlign: "left" }}>Address: Vuohennokantie 7, 04330 Lahela</FormLabel>
                <FormLabel sx={{ textAlign: "left" }}>Tel: 045 2385 888, Email: jriimala@gmail.com</FormLabel>

                <TextField
                    label="Client Name"
                    name="clientName"
                    type="text"
                    value={form.clientName}
                    onChange={handleChange}
                    error={Boolean(errors.clientName)}
                    helperText={errors.clientName}
                />

                <TextField
                    label="Client phone (numbers only)"
                    type="number"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    error={Boolean(errors.phone)}
                    helperText={errors.phone}
                />

                <TextField
                    label="Client Address"
                    name="address"
                    type="text"
                    value={form.address}
                    onChange={handleChange}
                    error={Boolean(errors.address)}
                    helperText={errors.address}
                />

                <TextField
                    label="Company Id"
                    name="companyId"                    
                    value={form.companyId}
                    onChange={handleChange}
                    error={Boolean(errors.companyId)}
                    helperText={errors.companyId}
                />

                <TextField
                    label="Project Description"
                    name="projectDescription"
                    value={form.projectDescription}
                    onChange={handleChange}
                    error={Boolean(errors.projectDescription)}
                    helperText={errors.projectDescription}
                    multiline
                    rows={4}
                />

                <TextField
                    label="Start Date"
                    name="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={handleChange}
                    error={Boolean(errors.startDate)}
                    helperText={errors.startDate}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    label="End Date"
                    name="endDate"
                    type="date"
                    value={form.endDate}
                    onChange={handleChange}
                    error={Boolean(errors.endDate)}
                    helperText={errors.endDate}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

                <FormControlLabel name="duration" control={<Checkbox checked={form.duration} />} label="Duration Ongoing" />


                <TextField
                    label="Hourly Rate (euros)"
                    name="rate"
                    value={form.rate}
                    onChange={handleChange}
                    error={Boolean(errors.rate)}
                    helperText={errors.rate}
                />

                <TextField
                    label="Travel Rate (euros)"
                    name="travelrate"
                    value={form.travelrate}
                    onChange={handleChange}
                    error={Boolean(errors.travelrate)}
                    helperText={errors.travelrate}
                />

                <FormLabel sx={{ textAlign: "left" }}>Payment on every two week from the signing, if the work duration exceeds one week. Within shorter contracts when the job is completed.</FormLabel>
                <Undersigning />

                <Button type="submit" variant="contained" color="primary">
                    Submit
                </Button>

            </Box>
        </Container>
    );
};

export default ContractForm;
