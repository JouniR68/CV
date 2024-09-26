import { TextField, Typography, Box } from '@mui/material';

const Extras = ({ valinekustannus, setValineKustannus, sisaltyy, setSisaltyy, muutHuomiot, setMuutHuomiot, suositukset, setSuositukset }) => {


    return (
        <div>
            <Box mt={2}>
                <Typography variant="h6">Työväline kustannukset</Typography>
                <TextField
                    type="number"
                    style={{ width: '5rem' }}
                    value={valinekustannus}
                    onChange={(e) => setValineKustannus(e.target.value === '' ? '' : Number(e.target.value))}
                    variant="outlined"
                />
            </Box>
            <hr />
            <Box mt={4}>
                <Typography variant="h6">Tarjous sisältää</Typography>
                <TextField
                    placeholder="Asiakkaan kanssa sovitut tehtävät."
                    value={sisaltyy}
                    onChange={(e) => setSisaltyy(e.target.value)}
                    variant="outlined"
                    multiline
                    rows={3}
                    fullWidth
                    margin="normal"
                />
                <hr />
                <Typography variant="h6">Tarjoukseen Kuulumattomat Asiat</Typography>
                <TextField
                    placeholder="Esim. matkakulut eivät sisälly tarjoukseen"
                    value={muutHuomiot}
                    onChange={(e) => setMuutHuomiot(e.target.value)}
                    variant="outlined"
                    multiline
                    rows={3}
                    fullWidth
                    margin="normal"
                />

                <hr />
                <Typography variant="h6">Suositukset Asiakkaalle</Typography>
                <TextField
                    placeholder="Esim. suosittelemme lisäpalveluita..."
                    value={suositukset}
                    onChange={(e) => setSuositukset(e.target.value)}
                    variant="outlined"
                    multiline
                    rows={3}
                    fullWidth
                    margin="normal"
                />
            </Box>
        </div>
    )

}

export default Extras;