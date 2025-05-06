import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
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

const TrainingsTable = () => {
    const [trainings, setTrainings] = useState([]);
    const [expandedWeeks, setExpandedWeeks] = useState({});
    const [expandedTrainings, setExpandedTrainings] = useState({});

    useEffect(() => {
        const fetchTrainings = async () => {
            const querySnapshot = await getDocs(collection(db, 'trainings1H'));
            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTrainings(data);
            console.log('data: ', data);
        };

        fetchTrainings();
    }, []);

    // Group trainings by week
    const groupedByWeek = Object.entries(
        trainings.reduce((acc, training) => {
            const week = training.week;

            if (!acc[week]) acc[week] = { trainings: [], hasUnit1: false };

            // Check if any analysis contains 'unit1'
            if (
                Array.isArray(training.details_analyysi) &&
                training.details_analyysi.some((detail) =>
                    Object.hasOwn(detail, 'unit1')
                )
            ) {
                acc[week].hasUnit1 = true;
            }

            acc[week].trainings.push(training);
            return acc;
        }, {})
    )
        .sort(([weekA], [weekB]) => weekB - weekA) // Sort weeks in descending order
        .map(([week, { trainings, hasUnit1 }]) => {
            const parseDate = (str) => {
                const [day, month, year] = str.split('.');
                return new Date(`${year}-${month}-${day}`);
            };

            const sortedTrainings = [...trainings].sort((a, b) => {
                const dateDiff = parseDate(b.date) - parseDate(a.date);
                if (dateDiff !== 0) return dateDiff;
                return b.hour - a.hour; // Sort hours descending
            });
            return [week, { trainings: sortedTrainings, hasUnit1 }];
        });

    const toggleWeek = (week) => {
        setExpandedWeeks((prev) => ({
            ...prev,
            [week]: !prev[week],
        }));
    };

    const toggleTraining = (trainingId) => {
        setExpandedTrainings((prev) => ({
            ...prev,
            [trainingId]: !prev[trainingId],
        }));
    };

    if (trainings.length === 0) {
        return <p>Ladataan treenejä...</p>;
    }

    const tulos = trainings.map((t) =>
        t.exercises?.map((e) => {
            const hasBadResult = e?.tulos?.some((s) => s === 'Vähennä painoa');
            return hasBadResult ? 'Vähennä painoa' : 'Ok';
        })
    );

    return (
        <div>
            {groupedByWeek.map(([week, { trainings }]) => (
                <div key={week} style={{ overflowX: 'auto', width: '100%' }}>
                    <Typography variant='h6' gutterBottom>
                        Viikko {week}{' '}
                        <Button
                            sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}
                            onClick={() => toggleWeek(week)}
                        >
                            {expandedWeeks[week] ? '−' : '+'}
                        </Button>
                    </Typography>
                    {expandedWeeks[week] && (
                        <TableContainer component={Paper} className='salirapsa'>
                            <Table sx={{ width: '100%', tableLayout: 'auto' }}>
                                <TableHead>
                                    <TableRow
                                        style={{
                                            backgroundColor: 'lightskyblue',
                                        }}
                                    >
                                        <TableCell>Päivämäärä</TableCell>
                                        <TableCell>Klo</TableCell>
                                        <TableCell>Liike</TableCell>
                                        <TableCell>Analyysi</TableCell>
                                        <TableCell>Painot/kilsat</TableCell>
                                        <TableCell>S&T</TableCell>
                                        <TableCell>Tulos</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {trainings.map((training) => (
                                        <React.Fragment key={training.id}>
                                            {/* Training Header Row with Toggle Button */}
                                            <TableRow>
                                                <TableCell>
                                                    {training.date}
                                                </TableCell>
                                                <TableCell>
                                                    {training.hour}
                                                </TableCell>
                                                <TableCell colSpan={4}>
                                                    <Button
                                                        sx={{
                                                            fontWeight: 'bold',
                                                            fontSize: '1.2rem',
                                                        }}
                                                        onClick={() =>
                                                            toggleTraining(
                                                                training.id
                                                            )
                                                        }
                                                    >
                                                        {expandedTrainings[
                                                            training.id
                                                        ]
                                                            ? '−'
                                                            : '+'}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>

                                            {/* Expandable Analysis Rows */}
                                            {expandedTrainings[training.id] &&
                                                Array.isArray(
                                                    training.exercises
                                                ) &&
                                                training.exercises.map(
                                                    (analysis, index) => (
                                                        <TableRow
                                                            key={`${training.id}-analysis-${index}`}
                                                        >
                                                            <TableCell></TableCell>
                                                            <TableCell></TableCell>
                                                            <TableCell>
                                                                {analysis.liike}
                                                            </TableCell>
                                                            <TableCell
                                                                sx={{
                                                                    minWidth:
                                                                        '20px',
                                                                    maxWidth:
                                                                        '150px',
                                                                    whiteSpace:
                                                                        'normal',
                                                                }}
                                                            >
                                                                {
                                                                    analysis.analyysi?.map(fiilis => fiilis)
                                                                }
                                                            </TableCell>
                                                            <TableCell
                                                                sx={{
                                                                    minWidth:
                                                                        '150px',
                                                                    maxWidth:
                                                                        '250px',
                                                                    whiteSpace:
                                                                        'normal',
                                                                    wordBreak:
                                                                        'break-word',
                                                                }}
                                                            >
                                                                {[
                                                                    analysis.painot.map(paino => paino)
                                                                ]
                                                                    .filter(
                                                                        Boolean
                                                                    )
                                                                    .join(', ')}
                                                            </TableCell>
                                                            <TableCell>
                                                                {analysis.sarja !==
                                                                undefined
                                                                    ? `${analysis.sarja} / ${analysis.toistot[index]}`
                                                                    : ''}
                                                            </TableCell>
                                                            <TableCell
                                                                style={{
                                                                    backgroundColor:
                                                                        analysis.tulos?.some(res => (res === 'Hyväksytty' || res === 'Ok'))
                                                                            ? 'green'
                                                                            : 'red',

                                                }}
                                                            >
                                                                {analysis.tulos?.some(
                                                                    (s) =>
                                                                        s ===
                                                                        'Vähennä painoa'
                                                                )
                                                                    ? `Vähennä painoa`
                                                                    : 'Ok'}
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )}
                                        </React.Fragment>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </div>
            ))}
        </div>
    );
};

export default TrainingsTable;
