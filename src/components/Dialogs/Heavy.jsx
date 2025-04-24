/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    TextField,
} from '@mui/material';

const ConfirmationDialog = ({
    exercise,
    open,
    onClose,
    onConfirm,
    index,
    series,
}) => {
    const [feedback, setFeedback] = useState();
    const [unit1, setUnit1] = useState();
    const [unit2, setUnit2] = useState();
    const [unit3, setUnit3] = useState();
    const [unit4, setUnit4] = useState();
    const [vapaa, setVapaa] = useState(false);

    const handleUnitChange = (index, target) => {
        const name = target.name;
        console.log(
            'handleUnitChange, name: ',
            name + ', value: ',
            target.value
        );
        name === 'tfUnit1' ? setUnit1(parseFloat(target.value)) : 0;
        name === 'tfUnit2' ? setUnit2(parseFloat(target.value)) : 0;
        name === 'tfUnit3' ? setUnit3(parseFloat(target.value)) : 0;
        name === 'tfUnit4' ? setUnit4(parseFloat(target.value)) : 0;
    };

    return (
        <Dialog open={open} onClose={() => onClose(null)}>
            <DialogTitle>{exercise} Detalit</DialogTitle>
            <DialogActions
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignContent: 'center',
                    justifyContent: 'center',
                    gap: '1rem',
                }}
            >


                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    label='Miten treeni meni?'
                />
                {/* Render a TextField for each unit */}
                <TextField
                    key={index}
                    name='tfUnit1'
                    type='number'
                    label='1. sarjan kg/km'
                    value={unit1}
                    onChange={(e) => handleUnitChange(index, e.target)}
                />
                {exercise != 'Vapaa' && (
                    <>
                        <TextField
                            key={index}
                            name='tfUnit2'
                            type='number'
                            label='2. sarjan painot'
                            value={unit2}
                            onChange={(e) => handleUnitChange(index, e.target)}
                        />
                        <TextField
                            key={index}
                            name='tfUnit3'
                            type='number'
                            label='3. sarjan painot'
                            value={unit3}
                            onChange={(e) => handleUnitChange(index, e.target)}
                        />
                    </>
                )}
                {series > 3 && (
                    <TextField
                        key={index}
                        name='tfUnit4'
                        label='4. sarjan painot'
                        type='number'
                        value={unit4}
                        onChange={(e) => handleUnitChange(index, e.target)}
                    />
                )}
                <Button
                    onClick={() =>
                        onConfirm(
                            feedback,
                            unit1,
                            unit2 || null,
                            unit3 || null,
                            unit4 || null
                        )
                    }
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
const Heavy = ({ onAnswer = () => {}, liike, sarja }) => {
    const [openDialog, setOpenDialog] = useState(true);
    const [series, setSeries] = useState(null);

    console.log('liike on Heavy dialog: ', liike + ", sarja:", sarja);

    useEffect(() => {
        if (Array.isArray(sarja)) {
            console.log('sarja on Heavy dialog: ', sarja[sarja.length - 1]);
            setSeries(sarja[sarja.length - 1]);
        }
    }, [sarja]);

    //console.log("Onko sarja array?", Array.isArray(sarja))

    const handleConfirm = (feedback, unit1, unit2, unit3, unit4) => {
        console.log(
            'Heavy answer: ',
            liike + feedback + ', unit: ',
            unit1,
            unit2,
            unit3,
            unit4
        );
        onAnswer(liike, feedback, unit1, unit2, unit3, unit4); // ✅ Send answer back to parent
        sarja = [];
        setOpenDialog(false);
    };

    return (
        <ConfirmationDialog
            exercise={liike}
            open={true}
            onClose={setOpenDialog}
            onConfirm={handleConfirm}
            series={series}
        />
    );
};

export default Heavy;
