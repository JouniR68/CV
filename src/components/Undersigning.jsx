import React, { useState } from 'react';
import { Container, TextField, Typography, Box, FormLabel } from '@mui/material';

const Undersigning = () => {
    const [form, setForm] = useState({
        freelancerName: '',
        freelancerSignature: '',
        freelancerDate: '',
        clientName: '',
        clientSignature: '',
        clientDate: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log('Undersigning form data:', form);
    };

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
                <Typography variant="h5" gutterBottom>
                    Freelancer Undersigning
                </Typography>
                <FormLabel sx={{ textAlign: "left" }}>Jouni Riimala</FormLabel>
                <TextField
                    label="Freelancer Signature"
                    name="freelancerSignature"
                    value={form.freelancerSignature}
                    onChange={handleChange}
                />
                <TextField
                    label="Date"
                    name="freelancerDate"
                    type="date"
                    value={form.freelancerDate}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

                <Typography variant="h5" gutterBottom>
                    Client Undersigning
                </Typography>
                <TextField
                    label="Client Name"
                    name="clientName"
                    value={form.clientName}
                    onChange={handleChange}
                />
                <TextField
                    label="Client Signature"
                    name="clientSignature"
                    value={form.clientSignature}
                    onChange={handleChange}
                />
                <TextField
                    label="Date"
                    name="clientDate"
                    type="date"
                    value={form.clientDate}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />


                <FormLabel sx={{ textAlign: "left" }}>Electronical signing not yet supported, pls print the form and sign it and send the undersigned file to jriimala@gmail.com</FormLabel>

            </Box>
        </Container>
    );
};

export default Undersigning;
``
