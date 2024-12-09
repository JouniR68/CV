import React from 'react';
import { TextField, Typography, Box } from '@mui/material';
import "../../css/tarjous.css"

const TarjoajaForm = ({ tarjoaja, setTarjoaja }) => {
    return (
        <div className="tarjouslomake-tarjoaja">
            <Box mb={4}>
                <Typography variant="h6">Tarjoaja</Typography>
                <TextField
                    type="text"
                    label="Nimi"
                    value={tarjoaja.nimi}
                    onChange={(e) => setTarjoaja({ ...tarjoaja, nimi: e.target.value })}
                    variant="outlined"
                    fullWidth
                />
                <TextField
                    type="text"
                    label="Osoite"
                    value={tarjoaja.osoite}
                    onChange={(e) => setTarjoaja({ ...tarjoaja, osoite: e.target.value })}
                    variant="outlined"
                    fullWidth
                />
                <TextField
                    type="text"
                    label="Puhelinnumero"
                    value={tarjoaja.puhelin}
                    onChange={(e) => setTarjoaja({ ...tarjoaja, puhelin: e.target.value })}
                    variant="outlined"
                    fullWidth
                />
                <TextField
                    type="email"
                    label="Sähköposti"
                    value={tarjoaja.sahkoposti}
                    onChange={(e) => setTarjoaja({ ...tarjoaja, sahkoposti: e.target.value })}
                    variant="outlined"
                    fullWidth
                />
                <TextField
                    type="text"
                    label="Y-tunnus"
                    value={tarjoaja.ytunnus}
                    onChange={(e) => setTarjoaja({ ...tarjoaja, ytunnus: e.target.value })}
                    variant="outlined"
                    fullWidth
                />
            </Box>
        </div>
    );
};

export default TarjoajaForm;
