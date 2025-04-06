import React, { useEffect, useRef, useState } from 'react';
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

const TrainingsTable = () => {
    const [trainings, setTrainings] = useState([]);
    const [expandedWeeks, setExpandedWeeks] = useState({}); // Tracks which weeks are expanded
    const [unitsExist, setUnitExist] = useState(false);

    useEffect(() => {
        const fetchTrainings = async () => {
            const querySnapshot = await getDocs(collection(db, 'trainings'));
            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTrainings(data);
            console.log('data: ', data);
        };

        fetchTrainings();
    }, []);

    const groupedByWeek = Object.entries(
        trainings.reduce((acc, training) => {
            const week = training.week;

            // Check if the training for the current week has 'unit1' in its details_analyysi
            if (!acc[week]) acc[week] = { trainings: [], hasUnit1: false };

            // Check if any detail in details_analyysi contains 'unit1'
            if (
                Array.isArray(training.details_analyysi) &&
                training.details_analyysi.some((detail) =>
                    Object.hasOwn(detail, 'unit1')
                )
            ) {
                console.log(`Found unit1 in week ${week}`); // Debugging log
                acc[week].hasUnit1 = true;
            }

            acc[week].trainings.push(training);
            return acc;
        }, {})
    ).sort(([weekA], [weekB]) => weekB - weekA); // Sort by latest week first

    console.log(groupedByWeek); // Final debug log to check the result
    // Example of using `setUnitExist` based on the result:

    useEffect(() => {
        let exists = false;
        groupedByWeek.forEach(([week, { hasUnit1 }]) => {
            if (hasUnit1) {
                console.log(`${week} unitExist = true`);
                exists = true;
            }
        });
        setUnitExist(exists); // Ensure re-render
    }, [trainings]); // Re-run when trainings change

    const toggleWeek = (week) => {
        setExpandedWeeks((prev) => ({
            ...prev,
            [week]: !prev[week], // Toggle visibility
        }));
    };

    if (trainings.length === 0) {
        return <p>Ladataan treenejä...</p>;
    }

    return (
        <div>
            {groupedByWeek.map(
                (
                    [week, { trainings }] // Destructure 'trainings' from the grouped data
                ) => (
                    <div
                        key={week}
                        style={{ overflowX: 'auto', width: '100%' }}
                    >
                        <Typography variant='h6' gutterBottom>
                            Viikko {week}{' '}
                            <Button
                                sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}
                                onClick={() => toggleWeek(week)}
                            >
                                {expandedWeeks[week] ? '−' : '+'}
                            </Button>
                        </Typography>
                        {expandedWeeks[week] && ( // Show table only if expanded
                            <TableContainer
                                component={Paper}
                                sx={{ width: '100%', overflowX: 'auto' }}
                            >
                                <Table
                                    sx={{ width: '100%', tableLayout: 'auto' }}
                                >
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
                                            {trainings.some(
                                                (t) =>
                                                    Array.isArray(
                                                        t.details_analyysi
                                                    ) &&
                                                    t.details_analyysi.some(
                                                        (detail) =>
                                                            Object.hasOwn(
                                                                detail,
                                                                'unit1'
                                                            )
                                                    )
                                            ) && (
                                                <TableCell>Painot</TableCell>
                                            )}{' '}
                                            <TableCell>S&T</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {trainings.map(
                                            (
                                                training // Use the correct 'trainings' array here
                                            ) => (
                                                <React.Fragment
                                                    key={training.id}
                                                >
                                                    <TableRow>
                                                        <TableCell>
                                                            {training.date}
                                                        </TableCell>
                                                        <TableCell>
                                                            {training.hour}
                                                        </TableCell>
                                                        <TableCell
                                                            colSpan={3}
                                                        ></TableCell>
                                                    </TableRow>

                                                    {Array.isArray(
                                                        training.details_analyysi
                                                    ) ? (
                                                        training.details_analyysi.map(
                                                            (
                                                                analysis,
                                                                index
                                                            ) => (
                                                                <TableRow
                                                                    key={`${training.id}-analysis-${index}`}
                                                                >
                                                                    <TableCell></TableCell>
                                                                    <TableCell></TableCell>
                                                                    <TableCell>
                                                                        {
                                                                            analysis.liike
                                                                        }
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
                                                                            analysis.analyysi
                                                                        }
                                                                    </TableCell>
                                                                    {trainings.some(
                                                                        (t) =>
                                                                            Array.isArray(
                                                                                t.details_analyysi
                                                                            ) &&
                                                                            t.details_analyysi.some(
                                                                                (
                                                                                    detail
                                                                                ) =>
                                                                                    Object.hasOwn(
                                                                                        detail,
                                                                                        'unit1'
                                                                                    )
                                                                            )
                                                                    ) && (
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
                                                                            {
                                                                                analysis.unit1
                                                                            }
                                                                            ,{' '}
                                                                            {
                                                                                analysis.unit2
                                                                            }
                                                                            ,{' '}
                                                                            {
                                                                                analysis.unit3
                                                                            }
                                                                            ,{' '}
                                                                            {
                                                                                analysis.unit4
                                                                            }
                                                                        </TableCell>
                                                                    )}
                                                                    <TableCell>
                                                                        {Array.isArray(
                                                                            training.sarjat
                                                                        ) &&
                                                                        Array.isArray(
                                                                            training.toistot
                                                                        ) &&
                                                                        training
                                                                            .sarjat[
                                                                            index
                                                                        ] !==
                                                                            undefined
                                                                            ? `${training.sarjat[index]} / ${training.toistot[index]}`
                                                                            : ''}
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        )
                                                    ) : (
                                                        <>
                                                            <TableCell></TableCell>
                                                            <TableCell></TableCell>
                                                            <TableCell>
                                                                {
                                                                    training.details
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    training.details_analyysi
                                                                }
                                                            </TableCell>
                                                        </>
                                                    )}
                                                </React.Fragment>
                                            )
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </div>
                )
            )}
        </div>
    );
};

export default TrainingsTable;
