import { TextField, Typography, Box } from '@mui/material';
import TehtavatForm from './Tehtavat';

const TarjousLomake3 = ({ tehtava, setTehtava, kuvaus, setKuvaus, tuntiarvio, setTuntiarvio, tuntihinta, lisaaTehtava, valinekustannus, setValineKustannus, sisaltyy, setSisaltyy, muutHuomiot, setMuutHuomiot, suositukset, setSuositukset }) => {


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

            <TehtavatForm
                tehtava={tehtava}
                setTehtava={setTehtava}
                kuvaus={kuvaus}
                setKuvaus={setKuvaus}
                tuntiarvio={tuntiarvio}
                setTuntiarvio={setTuntiarvio}
                tuntihinta={tuntihinta}
                lisaaTehtava={lisaaTehtava}
            />


        </div>
    )

}

export default TarjousLomake3;