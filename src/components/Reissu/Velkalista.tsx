import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    Typography,
} from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase'; // Muokkaa polku oikeaksi
import { Timestamp } from 'firebase/firestore';

interface VelkaTiedot {
    id: string;
    nimi: string;
    summa: number;
    kohde: string;
    aika: Timestamp | null;
    hoidettu: boolean;
}

const Velkalista: React.FC = () => {
    const [velat, setVelat] = useState<VelkaTiedot[]>([]);

    useEffect(() => {
        const fetchVelat = async () => {
            const snapshot = await getDocs(collection(db, 'velat'));
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as VelkaTiedot[];

            // Järjestetään uusimmat ensin
            const sorted = data.sort(
                (a, b) => (b.aika?.seconds || 0) - (a.aika?.seconds || 0)
            );

            setVelat(sorted);
        };

        fetchVelat();
    }, []);

    return (
        <Paper sx={{ p: 3, maxWidth: '1000px', margin: 'auto', mt: 5 }}>
            <Typography variant='h5' gutterBottom>
                Velkalista
            </Typography>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                            <TableCell>Nimi</TableCell>
                            <TableCell>Summa (€)</TableCell>
                            <TableCell>Kohde</TableCell>
                            <TableCell>Päivämäärä</TableCell>
                            <TableCell>Hoidettu</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {velat.map((velka) => (
                            <TableRow key={velka.id}>
                                <TableCell>{velka.velkoja}</TableCell>
                                <TableCell>
                                    {typeof velka.summa === 'number'
                                        ? velka.summa.toFixed(2)
                                        : '—'}
                                </TableCell>
                                <TableCell>{velka.kohde}</TableCell>
                                <TableCell>
                                    {velka.aika
                                        ? new Date(
                                              velka.aika.seconds * 1000
                                          ).toLocaleDateString('fi-FI')
                                        : '—'}
                                </TableCell>
                                <TableCell>
                                    <Checkbox
                                        checked={velka.hoidettu}
                                        disabled
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default Velkalista;
