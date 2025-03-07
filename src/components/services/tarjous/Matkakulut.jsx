
import { TextField, Typography, Grid } from '@mui/material';

const MatkakulutForm = ({ matkakulut, setMatkakulut, KILOMETRIKUSTANNUS}) => {
    console.log("matkakulut: ", matkakulut)
    return (
        <>
            <Typography variant="h6">Matkakulut</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        type="text"
                        label="Lähtö"
                        value={matkakulut.lahto}
                        onChange={(e) => setMatkakulut({ ...matkakulut, lahto: e.target.value })}
                        variant="outlined"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        type="text"
                        label="Määränpää"
                        value={matkakulut.maaranpaa}
                        onChange={(e) => setMatkakulut({ ...matkakulut, maaranpaa: e.target.value })}
                        variant="outlined"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <TextField
                        type="number"
                        label="km"
                        value={matkakulut.km}
                        onChange={(e) => setMatkakulut({ ...matkakulut, km: e.target.value })}
                        variant="outlined"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <TextField
                        type="number"
                        label="Määrä"
                        value={matkakulut.maara}
                        onChange={(e) => setMatkakulut({ ...matkakulut, maara: Number(e.target.value) })}
                        variant="outlined"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography>Kustannus: {Number(matkakulut.maara * (matkakulut.km * KILOMETRIKUSTANNUS)).toFixed(2) || 0}</Typography>
                </Grid>
            </Grid>
        </>
    );
};

export default MatkakulutForm;
