import { TextField, Typography, Box } from '@mui/material';
import TehtavatForm from './Tehtavat';
import "../../css/tarjous.css"

const TarjousLomake3 = ({ tehtava, setTehtava, kuvaus, setKuvaus, tuntiarvio, setTuntiarvio, lisaaTehtava, tuntihinta, setTuntihinta, sisaltyy, setSisaltyy, muutHuomiot, setMuutHuomiot, suositukset, setSuositukset }) => {

    tuntihinta
    return (
        <div>
            <Box mt={2}>
                <Typography variant="h6">Tuntihinta</Typography>
                <TextField
                    type="number"
                    style={{ width: '5rem' }}                    
                    onChange={(e) => setTuntihinta(e.target.value === '' ? '' : Number(e.target.value))}
                    variant="outlined"
                />
            </Box>

            <TehtavatForm
                tehtava={tehtava}
                setTehtava={setTehtava}
                kuvaus={kuvaus}
                setKuvaus={setKuvaus}
                tuntiarvio={tuntiarvio}
                setTuntiarvio={setTuntiarvio}
                setTuntihinta={setTuntihinta}
                tuntihinta={tuntihinta}
                lisaaTehtava={lisaaTehtava}
            />


        </div>
    )

}

export default TarjousLomake3;