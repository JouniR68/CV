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
import {
    AeroProps,
    ConfirmationDialogProps,
    VapaaConfirmationDialogProps,
} from './types';

const ConfirmationDialog: React.FC<VapaaConfirmationDialogProps> = ({
open,
    onClose,
    onConfirm,
}) => {
    const [fiilis, setFiilis] = useState<string>('');
    const [errors, setErrors] = useState<string>('');
    const [distance, setDistance] = useState<number>(1);
    const [timeUsed, setTimeUsed] = useState<number>(1);
    const [intervals, setIntervals] = useState<number>(1);
    const [liike, setLiike] = useState<string>('Juoksu');

    //Initialization
    useEffect(() => {
        if (!open) return;
        setLiike('?');
        setFiilis('Ok');
        setErrors('');
        setDistance(1);
        setTimeUsed(5);
        setIntervals(1);
    }, [open]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        switch (name) {
            case 'liike':
                setLiike(value);
                break;
            case 'fiilis':
                setFiilis(value);
                break;
            case 'rundit':
                setIntervals(Number(value));
                break;
            case 'matka':
                setDistance(Number(value));
                break;
            case 'aika':
                setTimeUsed(Number(value));
                break;
            default:
                break;
        }
    };


    const handleSave = () => {
        onConfirm(liike, fiilis, intervals, timeUsed, distance);
        onClose();
    };

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
            <DialogTitle>{liike} Detaljit</DialogTitle>
            <DialogContent>
                <TextField
                    name='liike'
                    fullWidth
                    value={liike}
                    onChange={(e) => handleChange(e)}
                    label='Treeni esim Juoksu?'
                    sx={{ mb: 2 }}
                />

                <TextField
                    name='fiilis'
                    fullWidth
                    multiline
                    rows={3}
                    value={fiilis}
                    onChange={(e) => handleChange(e)}
                    label='Treenin kuvaus'
                    sx={{ mb: 2 }}
                />

                <TextField
                    name='rundit'
                    fullWidth
                    value={intervals}
                    onChange={(e) => handleChange(e)}
                    label='Rundit'
                    sx={{ mb: 2 }}
                />

                <TextField
                    name='matka'
                    fullWidth
                    value={distance}
                    onChange={(e) => handleChange(e)}
                    label='Matka'
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    name='aika'
                    value={timeUsed}
                    onChange={(e) => handleChange(e)}
                    label='Aika'
                    sx={{ mb: 2 }}
                />
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

const Aero: React.FC<AeroProps> = ({ onVapaaAnswer }) => {
    const [openDialog, setOpenDialog] = useState(true);

    useEffect(() => {
        setOpenDialog(true);
    }, []);

    const handleConfirm = (
        liike: string,
        fiilis: string,
        intervals: number,
        timeUsed: number,
        distance: number
    ) => {
        onVapaaAnswer(liike, fiilis, intervals, timeUsed, distance);
        setOpenDialog(false);
    };

    return (
        <ConfirmationDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            onConfirm={handleConfirm}
            handleConfirm={function (
                fiilis: string,
                intervals: number,
                timeUsed: number,
                distance: number
            ): void {
                throw new Error('Function not implemented.');
            }}
            onVapaaAnswer={function (
                liike: string,
                fiilis: string,
                intervals: number,
                timeUsed: number,
                distance: number
            ): void {
                throw new Error('Function not implemented.');
            }}
        />
    );
};

export default Aero;
