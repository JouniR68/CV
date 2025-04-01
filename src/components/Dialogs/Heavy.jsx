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
    const [weight, setWeight] = useState(0);

    return (
        <Dialog style = {{display:'flex', flexDirection:'column'}} open={open} onClose={() => onClose(null)}>
            <DialogTitle>Treeni detalit</DialogTitle>
            <DialogActions>
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder='Kirjoita palautteesi...'
                />
                <TextField
                    type='number'
                    rows={1}
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder='Paino'
                />

                <Button
                    onClick={() => onConfirm(feedback, weight)}
                    color='primary'
                    variant='contained'
                >
                    Talleta
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// eslint-disable-next-line react/prop-types
const Heavy = ({ onAnswer = () => {} }) => {
    const [openDialog, setOpenDialog] = useState(true);

    const handleConfirm = (feedback, weight) => {
        console.log('answer: ' + feedback + ', weight: ', weight);
        onAnswer(feedback, weight); // ✅ Send answer back to parent
        setOpenDialog(false);
    };

    return (
        <ConfirmationDialog
            open={true}
            onClose={setOpenDialog}
            onConfirm={handleConfirm}
        />
    );
};

export default Heavy;
