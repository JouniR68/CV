import React from 'react';
import { TextField, Typography, Grid, Button } from '@mui/material';
import "../../css/tarjous.css"

const TehtavatForm = ({ tehtava, setTehtava, kuvaus, setKuvaus, tuntiarvio, setTuntiarvio, tuntihinta, lisaaTehtava }) => {
    return (
        <>
            <Typography variant="h6">Tehtävät</Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                    <TextField
                        type="text"
                        label="Tehtävä"
                        value={tehtava}
                        onChange={(e) => setTehtava(e.target.value)}
                        variant="outlined"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        type="text"
                        label="Kuvaus"
                        value={kuvaus}
                        onChange={(e) => setKuvaus(e.target.value)}
                        variant="outlined"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        type="number"
                        label="Tuntiarvio"
                        value={tuntiarvio}
                        onChange={(e) => setTuntiarvio(e.target.value)}
                        variant="outlined"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography>Kustannus: {(tuntiarvio * tuntihinta).toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Button onClick={lisaaTehtava} variant="contained">
                        Syötä uusi
                    </Button>
                </Grid>
            </Grid>
        </>
    );
};

export default TehtavatForm;
