import { TextField, Typography, Box } from '@mui/material';
import "../../css/tarjous.css"

const TarjousLomake4 = ({sisaltyy, setSisaltyy, eiKuulu, setEiKuulu, suositukset, setSuositukset }) => {


    return (
        <div>
            <Box mt={2}>
                <Typography variant="h6">Tarjous sisältää</Typography>
                <TextField
                    placeholder="Asiakkaan kanssa sovitut tehtävät."
                    value={sisaltyy}
                    onChange={(e) => setSisaltyy(e.target.value)}
                    variant="outlined"
                    multiline
                    rows={2}
                    fullWidth
                    margin="normal"
                />
                
                <Typography variant="h6">Tarjoukseen Kuulumattomat Asiat</Typography>
                <TextField
                    placeholder="Esim. matkakulut eivät sisälly tarjoukseen"
                    value={eiKuulu}
                    onChange={(e) => setEiKuulu(e.target.value)}
                    variant="outlined"
                    multiline
                    rows={1}
                    fullWidth
                    margin="normal"
                />
                
                <Typography variant="h6">Suositukset Asiakkaalle</Typography>
                <TextField
                    placeholder="Esim. suosittelemme lisäpalveluita..."
                    value={suositukset}
                    onChange={(e) => setSuositukset(e.target.value)}
                    variant="outlined"
                    multiline
                    rows={1}
                    fullWidth
                    margin="normal"
                />
            </Box>
        </div>
    )

}

export default TarjousLomake4;