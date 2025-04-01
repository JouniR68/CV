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

const ConfirmationDialog = ({ exercise, open, onClose, onConfirm, index }) => {
    const [feedback, setFeedback] = useState();
    const [weight, setWeight] = useState(0);

    return (
        <Dialog
            style={{ display: 'flex', flexDirection: 'column' }}
            open={open}
            onClose={() => onClose(null)}
        >
            <DialogTitle>{exercise} detalit</DialogTitle>
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
const Heavy = ({ onAnswer = () => {}, liike}) => {
    const [openDialog, setOpenDialog] = useState(true);
    console.log('liike on Heavy dialog: ', liike);

    const handleConfirm = (feedback, weight) => {
        console.log('answer: ', liike + feedback + ', weight: ', weight);
        onAnswer(liike, feedback, weight); // ✅ Send answer back to parent
        setOpenDialog(false);
    };

    return (
        <ConfirmationDialog
            exercise ={liike}
            open={true}
            onClose={setOpenDialog}
            onConfirm={handleConfirm}
        />
    );
};

export default Heavy;
