import {useState} from 'react';
import { FormControlLabel, Checkbox } from '@mui/material';

const VapaaTreeniCheckbox = ({ checked, onChange}  ) => {
    console.log('checked:', checked);
const [vast, setVast] = useState(false)

/*
    const handleChange = (checked) => {
        checked ? setVast(true) : setVast(false);
    };
*/
    return (
        <FormControlLabel
            control={<Checkbox checked={checked} onChange={onChange} />}
            label='Vapaa treeni'

        />
    );
};

export default VapaaTreeniCheckbox;
