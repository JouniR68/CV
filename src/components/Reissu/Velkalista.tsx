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
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
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

    const updateStatus = async (id: string, currentHoidettu: boolean) => {
        console.log(`${id} + ', ' + ${currentHoidettu}`);

        const newStatus = !currentHoidettu;

        try {
            const velkaRef = doc(db, 'velat', id);
            await updateDoc(velkaRef, { hoidettu: newStatus });
            setVelat((preVelat) =>
                preVelat.map((velka) =>
                    velka.id === id ? { ...velka, hoidettu: newStatus } : velka
                )
            );
            console.log(`Updated status is now ${newStatus}`);
        } catch (err) {
            console.log(`Updating status failed ${err}`);
        }
    };

    return (
        <Paper
            sx={{ p: 3, maxWidth: '1000px', margin: 'auto', mt: 5 }}
            className='reissu'
        >
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
                                <TableCell>{velka.nimi}</TableCell>
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
                                        onChange={(event) =>
                                            updateStatus(
                                                velka.id,
                                                velka.hoidettu
                                            )
                                        }
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
