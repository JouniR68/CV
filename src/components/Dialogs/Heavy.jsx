/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';

const ConfirmationDialog = ({
    exercise,
    open,
    onClose,
    onConfirm,
    series,
    toistot,
}) => {
    const [feedback, setFeedback] = useState('');
    const [unit1, setUnit1] = useState('');
    const [unit2, setUnit2] = useState('');
    const [unit3, setUnit3] = useState('');
    const [unit4, setUnit4] = useState('');
    const [reps, setReps] = useState([]);

    useEffect(() => {
        if (toistot) {
            if (Array.isArray(toistot)) {
                setReps([...toistot]); // clone parent toisto array
            } else if (series > 1) {
                setReps(new Array(series).fill(toistot));
            } else {
                setReps([toistot]); // if single number, wrap it to array
            }
        }
    }, [toistot]);

    const handleUnitChange = (idx, target) => {
        const name = target.name;
        const value = target.value;

        if (name.startsWith('reps')) {
            const repsValue = parseInt(value, 10);
            setReps((prevReps) => {
                const newReps = [...prevReps];
                newReps[idx] = repsValue;
                return newReps;
            });
        } else if (name === 'tfUnit1') {
            setUnit1(parseFloat(value));
        } else if (name === 'tfUnit2') {
            setUnit2(parseFloat(value));
        } else if (name === 'tfUnit3') {
            setUnit3(parseFloat(value));
        } else if (name === 'tfUnit4') {
            setUnit4(parseFloat(value));
        }
    };

    const handleSave = () => {
        onConfirm(feedback, unit1, unit2, unit3, unit4, reps);
        onClose();
    };

    return (
        <Dialog open={open} onClose={() => onClose(null)}>
            <DialogTitle>{exercise} Detaljit</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    label='Miten treeni meni?'
                    sx={{ mb: 2 }}
                />

                {[...Array(series)].map((_, idx) => (
                    <div
                        key={idx}
                        style={{
                            display: 'flex',
                            gap: '1rem',
                            marginBottom: '1rem',
                        }}
                    >
                        <TextField
                            key={`reps-${idx}`}
                            name={`reps${idx}`}
                            type='number'
                            label={`${idx + 1}. sarjan toistot`}
                            value={reps[idx] || ''}
                            onChange={(e) => handleUnitChange(idx, e.target)}
                        />
                        <TextField
                            name={`tfUnit${idx + 1}`}
                            type='number'
                            label={`${idx + 1}. sarjan painot`}
                            value={
                                idx === 0
                                    ? unit1
                                    : idx === 1
                                    ? unit2
                                    : idx === 2
                                    ? unit3
                                    : idx === 3
                                    ? unit4
                                    : ''
                            }
                            onChange={(e) => handleUnitChange(idx, e.target)}
                        />
                    </div>
                ))}
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={handleSave}
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
const Heavy = ({ onAnswer = () => {}, liike, sarja, toisto }) => {
    const [openDialog, setOpenDialog] = useState(true);
    const [series, setSeries] = useState(null);
    const [localToisto, setLocalToisto] = useState('');

    useEffect(() => {
        // Initialize when component mounts or props change
        setLocalToisto(toisto || '');
    }, [toisto]);

    console.log('liike on Heavy dialog: ', liike, ', sarja:', sarja);
    if (Array.isArray(toisto)) {
        console.log('Toisto array: ', toisto);
    } else {
        console.log('toisto: ', toisto);
    }

    useEffect(() => {
        setOpenDialog(true); // open dialog when new exercise comes
    }, [liike]);

    useEffect(() => {
        if (Array.isArray(sarja)) {
            setSeries(sarja[sarja.length - 1]);
        }
    }, [sarja]);

    const handleConfirm = (feedback, unit1, unit2, unit3, unit4, reps) => {
        console.log(
            'Heavy answer: ',
            liike,
            feedback,
            'units:',
            unit1,
            unit2,
            unit3,
            unit4,
            'reps:',
            reps
        );
        onAnswer(liike, feedback, unit1, unit2, unit3, unit4, reps);
        setOpenDialog(false);
    };

    return (
        <ConfirmationDialog
            exercise={liike}
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            onConfirm={handleConfirm}
            series={series || 1}
            toistot={localToisto}
        />
    );
};

export default Heavy;
