import React from "react";
import { FormControlLabel, Checkbox } from "@mui/material";

const VapaaTreeniCheckbox = ({ checked, onChange }) => {
    
  return (
    <FormControlLabel
      control={<Checkbox checked={checked} onChange={onChange} />}
      label="Vapaa treeni"
    />
  );
};

export default VapaaTreeniCheckbox;
