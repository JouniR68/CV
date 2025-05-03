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
import { ConfirmationDialogProps } from './types';

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    exercise,
    open,
    onClose,
    onConfirm,
    series,
    toistot,
}) => {
    const [feedback, setFeedback] = useState<string>([]);
    const [reps, setReps] = useState<number[]>([]);
    const [weights, setWeights] = useState<number[]>([]);
    const [initialReps, setInitialReps] = useState<number[]>([]);
    const [errors, setErrors] = useState<{
        reps: boolean[];
        weights: boolean[];
    }>({
        reps: [],
        weights: [],
    });

    //Initialization
    useEffect(() => {
        if (!open) return;

        const initReps =
            Array.isArray(toistot) && toistot.length >= series
                ? toistot.slice(0, series)
                : Array(series).fill(0);

        setInitialReps(initReps); // <- store them
        setReps(initReps);
        setWeights(Array(series).fill(undefined));
        setFeedback('');
        setErrors({
            reps: Array(series).fill(false),
            weights: Array(series).fill(false),
        });
    }, [series, open, toistot]);

    const handleChange = (
        idx: number,
        name: 'weights' | 'reps',
        value: string
    ) => {
        const parsed = parseFloat(value);
        const isWeight = name === 'weights';
        const isValid = isWeight
            ? parsed >= 0
            : parsed >= 1 && Number.isInteger(parsed);

        if (isWeight) {
            setWeights((prev) => {
                const updated = [...prev];
                updated[idx] = parsed || 0;
                return updated;
            });
        } else {
            setReps((prev) => {
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

        if (!repsValid || !weightsValid) {
            alert(
                'Tarkista, että kaikki toistot ja painot on oikein täytetty.'
            );
            return;
        }

        const result = reps.map((rep, idx) =>
            rep < initialReps[idx] ? 'Vähenna painoa' : 'Hyväksytty'
        );

        onConfirm(feedback, weights, reps, result);
        onClose();
    };

    //label={`${idx + 1}. sarjan painot (kg)`}
    console.log('reps: ', reps);
    return (
        <Dialog
            open={open}
            onClose={(event, reason) => {
                if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                    onClose();
                }
            }}
            aria-labelledby='heavy-dialog-title'
            disableEscapeKeyDown
        >
            <DialogTitle>{exercise} Detaljit</DialogTitle>
            <DialogContent>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={feedback}
                        onChange={(e) =>
                            setFeedback(e.target.value)
                        }
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
                                    handleChange(idx, 'reps', e.target.value)
                                }
                            />
                            <TextField
                                name={`weight${idx}`}
                                type='number'
                                label={
                                    exercise !== 'Vapaa'
                                        ? `${idx + 1}. sarjan kilot`
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
                                    handleChange(idx, 'weights', e.target.value)
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

const Heavy: React.FC<HeavyProps> = ({ onAnswer, liike, sarja, toisto }) => {
    const [openDialog, setOpenDialog] = useState(true);
    const [series, setSeries] = useState<number>(1);
    const [initialReps, setInitialReps] = useState<number[]>([]);
    const [localToisto, setLocalToisto] = useState<number[] | ''>([]);

    useEffect(() => {
        if (typeof toisto === 'string') {
            const base = parseInt(toisto.split('-')[0], 10);
            if (!isNaN(base)) {
                setInitialReps(Array(series).fill(base));

                setLocalToisto(Array(series).fill(base));
            } else {
                setLocalToisto(Array(series).fill(0));
            }
        } else {
            setLocalToisto(Array(series).fill(0));
        }
    }, [toisto, series]);

    useEffect(() => {
        if (Array.isArray(sarja)) {
            setSeries(sarja[sarja.length - 1] || 1);
        } else if (typeof sarja === 'number') {
            setSeries(sarja);
        }
    }, [sarja]);

    useEffect(() => {
        setOpenDialog(true);
    }, [liike]);

    const handleConfirm = (
        feedback: string[],
        weights: number[],
        reps: number[]
    ) => {
        const result = reps.map((rep, idx) => {
            const baseline = initialReps[idx] ?? 0; // fallback to 0 if undefined
            return rep < baseline ? 'Vähennä painoa' : 'Hyväksytty';
        });

        onAnswer(liike, feedback, weights, reps, result);
        setOpenDialog(false);
    };

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
