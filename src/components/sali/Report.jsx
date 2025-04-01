import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase'; // Varmista, että Firebase on konfiguroitu oikein
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
} from '@mui/material';

const TrainingsTable = () => {
    const [trainings, setTrainings] = useState([]);

    useEffect(() => {
        const fetchTrainings = async () => {
            const querySnapshot = await getDocs(collection(db, 'trainings'));
            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTrainings(data);
        };

        fetchTrainings();
    }, []);

    // Järjestetään harjoitukset viikoittain
    const groupedByWeek = trainings.reduce((acc, training) => {
        const week = training.week;
        if (!acc[week]) {
            acc[week] = [];
        }
        acc[week].push(training);
        return acc;
    }, {});

    console.log('Trainings state:', trainings);
    if (trainings.length === 0) {
        return <p>Ladataan treenejä...</p>;
    }
    /*
                                            training.sarjat.map(
                                                (sarja, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{sarja}</TableCell>
                                                    </TableRow>
                                                )
                                            )
    */

    return (
        <div>
            {Object.entries(groupedByWeek).map(([week, trainingList]) => (
                <div
                    key={week}
                    style={{
                        marginTop: '1rem',
                        marginBottom: '20px',
                        display: 'flex',
                        overflowY: 'auto',
                    }}
                >
                    <Typography variant='h6' gutterBottom>
                        Viikko {week}
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow
                                    style={{ backgroundColor: 'lightskyblue' }}
                                >
                                    <TableCell>Päivämäärä</TableCell>
                                    <TableCell>Klo</TableCell>
                                    <TableCell>Liike</TableCell>
                                    <TableCell>Analyysi</TableCell>
                                    <TableCell>S&T</TableCell>
                                    <TableCell>Paino (kg)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {trainingList.map((training) => (
                                    <React.Fragment key={training.id}>
                                        {/* Ensimmäinen rivi näyttää vain päivämäärän ja kellonajan */}
                                        <TableRow>
                                            <TableCell>
                                                {training.date}
                                            </TableCell>
                                            <TableCell>
                                                {training.hour}
                                            </TableCell>
                                            <TableCell colSpan={3}></TableCell>{' '}
                                            {/* Tyhjät solut */}
                                        </TableRow>

                                        {/* Jos analyysit ovat taulukossa, luodaan uusi rivi jokaiselle analyysille */}
                                        {Array.isArray(
                                            training.details_analyysi
                                        ) ? (
                                            training.details_analyysi.map(
                                                (analysis, index) => (
                                                    <TableRow
                                                        key={`${training.id}-analysis-${index}`}
                                                    >
                                                        <TableCell></TableCell>{' '}
                                                        {/* Empty cell */}
                                                        <TableCell></TableCell>{' '}
                                                        {/* Empty cell */}
                                                        <TableCell>
                                                            {analysis.liike}
                                                        </TableCell>
                                                        <TableCell>
                                                            {analysis.analyysi}
                                                        </TableCell>
                                                        <TableCell>
                                                            {Array.isArray(
                                                                training.sarjat
                                                            ) &&
                                                            Array.isArray(
                                                                training.toistot
                                                            ) &&
                                                            training.sarjat[
                                                                index
                                                            ] !== undefined
                                                                ? `${training.sarjat[index]} / ${training.toistot[index]}`
                                                                : ''}
                                                        </TableCell>{' '}
                                                        <TableCell>
                                                            {analysis.paino}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )
                                        ) : (
                                            <>
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                                <TableCell>
                                                    {training.details}
                                                </TableCell>
                                                <TableCell>
                                                    {training.details_analyysi}
                                                </TableCell>
                                            </>
                                        )}
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            ))}
        </div>
    );
};

export default TrainingsTable;
