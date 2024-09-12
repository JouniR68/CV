// src/Yhteenveto.js
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, TableSortLabel } from '@mui/material';
import { collection, updateDoc, doc, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../firebase';


function Yhteenveto() {
    const location = useLocation();
    const [entries, setEntries] = useState(location.state.entries);
    const [orderBy, setOrderBy] = useState('day');
    const [orderDirection, setOrderDirection] = useState('asc');

    const TUNTIHINTA = 15

    useEffect(() => {
        const q = query(collection(db, 'tuntikirjanpito'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const updatedEntries = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setEntries(updatedEntries);
        });

        return () => unsubscribe();
    }, []);

    const handleSortRequest = (property) => {
        const isAsc = orderBy === property && orderDirection === 'asc';
        setOrderDirection(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handlePaidChange = async (id, currentPaidStatus) => {
        try {
            const entryRef = doc(db, 'tuntikirjanpito', id);
            await updateDoc(entryRef, { isPaid: !currentPaidStatus });
        } catch (error) {
            console.error('Error updating payment status:', error);
        }
    };

    const sortedEntries = [...entries].sort((a, b) => {
        if (orderDirection === 'asc') {
            return a[orderBy] < b[orderBy] ? -1 : 1;
        } else {
            return a[orderBy] > b[orderBy] ? -1 : 1;
        }
    });


    const values = sortedEntries.map(payment => payment.hours)

    const sum = values.reduce((accumulator, currentValue) => accumulator + currentValue, 0)

    let counter = 0;

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow key = {counter++}>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'day'}
                                direction={orderBy === 'day' ? orderDirection : 'asc'}
                                onClick={() => handleSortRequest('day')}
                            >
                                Päivä
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'client'}
                                direction={orderBy === 'client' ? orderDirection : 'asc'}
                                onClick={() => handleSortRequest('client')}
                            >
                                Tilaaja
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'hours'}
                                direction={orderBy === 'hours' ? orderDirection : 'asc'}
                                onClick={() => handleSortRequest('hours')}
                            >
                                Tunnit
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>Kuvaus</TableCell>
                        <TableCell>Maksettu</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedEntries.map((entry) => (
                        <TableRow key={entry.id}>
                            <TableCell>{entry.day}</TableCell>
                            <TableCell>{entry.client}</TableCell>
                            <TableCell>{entry.hours}</TableCell>
                            <TableCell>{entry.description}</TableCell>
                            <TableCell>
                                <Checkbox
                                    checked={entry.isPaid}
                                    onChange={() => handlePaidChange(entry.id, entry.isPaid)}
                                    inputProps={{ 'aria-label': 'paid checkbox' }}
                                />
                                {entry.isPaid ? 'Maksettu' : 'Ei'}
                            </TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell style={{fontWeight: '700'}}>Tilanne</TableCell> 
                        <TableCell></TableCell>
                        <TableCell style={{fontWeight: '700'}}>{sum}</TableCell> 
                        <TableCell style={{fontWeight: '700'}}>Saamatta {sum * TUNTIHINTA + 108} euroa (108 euroa ajokilometreistä)</TableCell>                         
                        <TableCell></TableCell>
                    </TableRow>
                </TableBody>
            </Table>:


        </TableContainer>
    );
}

export default Yhteenveto;
