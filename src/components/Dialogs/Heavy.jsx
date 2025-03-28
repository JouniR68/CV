import { useState } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    TextField,
} from '@mui/material';

const ConfirmationDialog = ({ open, onClose, onConfirm, index }) => {
    const [feedback, setFeedback] = useState();

    return (
        <Dialog open={open} onClose={() => onClose(null)}>
            <DialogTitle>Vaikutus</DialogTitle>
            <DialogContent>
                <Typography>Analyysi</Typography>
            </DialogContent>
            <DialogActions>
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder='Kirjoita palautteesi...'
                />

                <Button
                    onClick={() => onConfirm(index, feedback)}
                    color='primary'
                    variant='contained'
                >
                    Talleta
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const Heavy = ({ onAnswer }) => {
    const [openDialog, setOpenDialog] = useState(true);

    const handleConfirm = (index, value) => {
        console.log('answer: ' + value);
        onAnswer(value); // ✅ Send answer back to parent
        setOpenDialog(false);
    };

    return (
        <ConfirmationDialog
            open={openDialog}
            onClose={setOpenDialog}
            onConfirm={handleConfirm}
        />
    );
};

export default Heavy;
