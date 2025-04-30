import { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';
import React from 'react';

interface ConfirmationDialogProps {
    exercise: string;
    open: boolean;
    onClose: () => void;
    onConfirm: (feedback: string, weights: number[], reps: number[]) => void;
    series: number;
    toistot?: number[] | number;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    exercise,
    open,
    onClose,
    onConfirm,
    series,
    toistot,
}) => {
    const [feedback, setFeedback] = useState('');
    const [reps, setReps] = useState<number[]>([]);
    const [weights, setWeights] = useState<number[]>([]);
    const [errors, setErrors] = useState<{
        reps: boolean[];
        weights: boolean[];
    }>({
        reps: [],
        weights: [],
    });

    useEffect(() => {
        if (toistot) {
            if (Array.isArray(toistot)) {
                setReps([...toistot]);
            } else if (series > 1) {
                setReps(Array(series).fill(toistot));
            } else {
                setReps([toistot]);
            }
        } else {
            setReps(Array(series).fill(0));
        }
        setWeights(Array(series).fill(0));
        setErrors({
            reps: Array(series).fill(false),
            weights: Array(series).fill(false),
        });
    }, [toistot, series]);

    const handleChange = (
        idx: number,
        name: 'reps' | 'weights',
        value: string
    ) => {
        const parsed = parseFloat(value);
        const isReps = name === 'reps';
        const isValid = isReps
            ? parsed >= 1 && Number.isInteger(parsed)
            : parsed >= 0;

        if (isReps) {
            setReps((prev) => {
                const updated = [...prev];
                updated[idx] = parsed || 0;
                return updated;
            });
        } else {
            setWeights((prev) => {
                const updated = [...prev];
                updated[idx] = parsed || 0;
                return updated;
            });
        }

        setErrors((prev) => {
            const updated = { ...prev };
            updated[name][idx] = !isValid;
            return updated;
        });
    };

    const handleSave = () => {
        const repsValid = reps.every((r) => r >= 1 && Number.isInteger(r));
        const weightsValid = weights.every((w) => w >= 0);

        if (repsValid && weightsValid) {
            onConfirm(feedback, weights, reps);
            onClose();
        } else {
            alert(
                'Tarkista, että kaikki toistot ja painot on oikein täytetty.'
            );
        }
    };

    //label={`${idx + 1}. sarjan painot (kg)`}

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{exercise} Detaljit</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    label={
                        exercise !== 'Vapaa'
                            ? `Miten treeni meni`
                            : 'Lenkin profiili, fiilis yms'
                    }
                    sx={{ mb: 2 }}
                />
                {Array.from({ length: series }, (_, idx) => (
                    <div
                        key={idx}
                        style={{
                            display: 'flex',
                            gap: '1rem',
                            marginBottom: '1rem',
                        }}
                    >

                            <>
                                <TextField
                                    name={`reps${idx}`}
                                    type='number'
                                    label={
                                        exercise !== 'Vapaa'
                                            ? `${idx + 1}. sarjan toistot`
                                            : 'Intervallit'
                                    }
                                    value={reps[idx] ?? ''}
                                    error={errors.reps[idx]}
                                    helperText={
                                        errors.reps[idx]
                                            ? 'Anna kokonaisluku ≥ 1'
                                            : ''
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            idx,
                                            'reps',
                                            e.target.value
                                        )
                                    }
                                />
                                <TextField
                                    name={`weight${idx}`}
                                    type='number'
                                    label={
                                        exercise !== 'Vapaa'
                                            ? `${idx + 1}. sarjan toistot`
                                            : 'Matka'
                                    }
                                    value={weights[idx] ?? ''}
                                    error={errors.weights[idx]}
                                    helperText={
                                        errors.weights[idx]
                                            ? 'Arvon oltava ≥ 0'
                                            : ''
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            idx,
                                            'weights',
                                            e.target.value
                                        )
                                    }
                                />
                            </>
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

interface HeavyProps {
    onAnswer: (
        liike: string,
        palaute: string,
        weights: number[],
        reps: number[]
    ) => void;
    liike: string;
    sarja: number[];
    toisto?: number[] | number;
}

const Heavy: React.FC<HeavyProps> = ({ onAnswer, liike, sarja, toisto }) => {
    const [openDialog, setOpenDialog] = useState(true);
    const [series, setSeries] = useState<number>(1);
    const [localToisto, setLocalToisto] = useState<number[] | number | ''>('');

    useEffect(() => {
        setLocalToisto(toisto ?? '');
    }, [toisto]);

    useEffect(() => {
        setOpenDialog(true);
    }, [liike]);

    useEffect(() => {
        if (Array.isArray(sarja)) {
            setSeries(sarja[sarja.length - 1] || 1);
        }
    }, [sarja]);

    const handleConfirm = (
        feedback: string,
        weights: number[],
        reps: number[]
    ) => {
        onAnswer(liike, feedback, weights, reps);
        setOpenDialog(false);
    };

console.log("liike: ", liike)
    return (
        <ConfirmationDialog
            exercise={liike}
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            onConfirm={handleConfirm}
            series={series}
            toistot={localToisto}
        />
    );
};

export default Heavy;
