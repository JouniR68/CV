import React, { useState } from 'react';
import { Container, TextField, Button, Box, Typography, MenuItem } from '@mui/material';

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
        rate: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
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


        if (!form.companyId.length < 8) {
            tempErrors.clientName = 'Company Id (Y-id) incorrect';
            isValid = false;
        }
        if (!form.projectDescription) {
            tempErrors.projectDescription = 'Project description is required';
            isValid = false;
        }
        if (!form.startDate) {
            tempErrors.startDate = 'Start date is required';
            isValid = false;
        }
        if (!form.endDate) {
            tempErrors.endDate = 'End date is required';
            isValid = false;
        }
        if (!form.rate) {
            tempErrors.rate = 'Rate is required';
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            // Handle form submission, e.g., send form to the server
            try {
                if (form != undefined || form != "") {
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


/*
        <TextField
          label="Currency"
          name="currency"
          select
          value={form.currency}
          onChange={handleChange}
        >
          <MenuItem value="USD">USD</MenuItem>
          <MenuItem value="EUR">EUR</MenuItem>
          <MenuItem value="GBP">GBP</MenuItem>
          <MenuItem value="INR">INR</MenuItem>
        </TextField>

*/


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
            <TextField
                label="Freelancer Name"
                name="freelancerName"
                value={form.freelancerName}
                onChange={handleChange}
                error={Boolean(errors.freelancerName)}
                helperText={errors.freelancerName}
            />
            <TextField
                label="Client Name"
                name="clientName"
                value={form.clientName}
                onChange={handleChange}
                error={Boolean(errors.clientName)}
                helperText={errors.clientName}
            />

            <TextField
                label="Contact phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                error={Boolean(errors.phone)}
                helperText={errors.phone}
            />

            <TextField
                label="Address"
                name="address"
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
            <TextField
                label="Rate"
                name="rate"
                value={form.rate}
                onChange={handleChange}
                error={Boolean(errors.rate)}
                helperText={errors.rate}
            />
            <Button type="submit" variant="contained" color="primary">
                Submit
            </Button>
        </Box>
    </Container>
);
};

export default ContractForm;
