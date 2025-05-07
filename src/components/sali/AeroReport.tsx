import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Training } from './types';
import { db } from '../../firebase';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Button,
} from '@mui/material';
import '../../css/sali.css';

const AeroReport = () => {
    const [trainings, setTrainings] = useState([]);
    const [expandedWeeks, setExpandedWeeks] = useState({});
    const [expandedTrainings, setExpandedTrainings] = useState({});

    useEffect(() => {
        const fetchTrainings = async () => {
            const querySnapshot = await getDocs(
                collection(db, 'aeroTrainings1H')
            );
            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTrainings(data);
            console.log('data: ', data);
        };

        fetchTrainings();
    }, []);

    if (trainings.length === 0) {
        return <p>Ladataan treenejä...</p>;
    }
    let i = 0;
    return (
        <div>
            <div key={i++} style={{ overflowX: 'auto', width: '100%' }}>
                <TableContainer component={Paper} className='salirapsa'>
                    <Table sx={{ width: '100%', tableLayout: 'auto' }}>
                        <TableHead>
                            <TableRow
                                style={{
                                    backgroundColor: 'lightskyblue',
                                }}
                            >
                                <TableCell>Viikko</TableCell>
                                <TableCell>PVM</TableCell>
                                <TableCell>Klo</TableCell>
                                <TableCell>Liike</TableCell>
                                <TableCell>Fiilis</TableCell>
                                <TableCell>Aika</TableCell>
                                <TableCell>Intervallit</TableCell>
                                <TableCell>Matka</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {trainings.map((training: Training) => (
                                <React.Fragment key={training.id}>
                                    {/* Training Header Row with Toggle Button */}
                                    <TableRow>
                                        <TableCell>{training.week}</TableCell>
                                        <TableCell>{training.date}</TableCell>
                                        <TableCell>{training.hour}</TableCell>
                                        <TableCell>{training.liike}</TableCell>
                                        <TableCell>{training.fiilis}</TableCell>
                                        <TableCell>
                                            {training.timeUsed}
                                        </TableCell>
                                        <TableCell>
                                            {training.intervals}
                                        </TableCell>
                                        <TableCell>
                                            {training.distance}
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
};

export default AeroReport;
