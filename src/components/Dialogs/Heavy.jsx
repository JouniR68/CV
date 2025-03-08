import { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material";

const ConfirmationDialog = ({ open, onClose, onConfirm, index }) => {
  return (
    <Dialog open={open} onClose={() => onClose(null)}>
      <DialogTitle>Vaikutus</DialogTitle>
      <DialogContent>
        <Typography>Liian raskas?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onConfirm(index, "Kyllä")} color="primary" variant="contained">
          Kyllä
        </Button>
        <Button onClick={() => onConfirm(index, "Ei")} color="secondary" variant="contained">
          Ei
        </Button>
      </DialogActions>
    </Dialog>
  );

}

const Heavy = ({ onAnswer }) => {
    const [openDialog, setOpenDialog] = useState(true);
  
    const handleConfirm = (index, value) => {
      console.log("answer: " + value);
      onAnswer(value); // ✅ Send answer back to parent
      setOpenDialog(false);
    };
  
    return (
      <ConfirmationDialog open={openDialog} onClose={setOpenDialog} onConfirm={handleConfirm} />
    );
}

export default Heavy;
