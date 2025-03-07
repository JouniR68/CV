import React from 'react';
import { TextField, Typography, Box } from '@mui/material';

const AsiakasForm = ({ saaja, setSaaja }) => {
    return (
        <div className="tarjouslomake-asiakas">
            <Box mb={4}>
                <Typography variant="h6">Asiakas</Typography>
                <TextField
                    type="text"
                    label="Nimi"
                    value={saaja.nimi}
                    onChange={(e) => setSaaja({ ...saaja, nimi: e.target.value })}
                    variant="outlined"
                    fullWidth
                />
                <TextField
                    type="text"
                    label="Osoite"
                    value={saaja.osoite}
                    onChange={(e) => setSaaja({ ...saaja, osoite: e.target.value })}
                    variant="outlined"
                    fullWidth
                />
                <TextField
                    type="text"
                    label="Puhelinnumero"
                    value={saaja.puhelin}
                    onChange={(e) => setSaaja({ ...saaja, puhelin: e.target.value })}
                    variant="outlined"
                    fullWidth
                />
                <TextField
                    type="email"
                    label="Sähköposti"
                    value={saaja.sahkoposti}
                    onChange={(e) => setSaaja({ ...saaja, sahkoposti: e.target.value })}
                    variant="outlined"
                    fullWidth
                />
                <TextField
                    type="text"
                    label="Y-tunnus"
                    value={saaja.ytunnus}
                    onChange={(e) => setSaaja({ ...saaja, ytunnus: e.target.value })}
                    variant="outlined"
                    fullWidth
                />
            </Box>
        </div>
    );
};

export default AsiakasForm;
