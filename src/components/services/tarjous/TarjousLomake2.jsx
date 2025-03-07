import { TextField, Typography, Box } from '@mui/material';
import TehtavatForm from './Tehtavat';
import MatkakulutForm from './Matkakulut';
import "../../../css/tarjous.css"

const TarjousLomake2 = ({matkakulut, setMatkakulut }) => {

    const KILOMETRIKUSTANNUS = 0.57;
    return (
        <div>
            <MatkakulutForm matkakulut={matkakulut} setMatkakulut={setMatkakulut} KILOMETRIKUSTANNUS={KILOMETRIKUSTANNUS} />            
        </div>
    )

}

export default TarjousLomake2;