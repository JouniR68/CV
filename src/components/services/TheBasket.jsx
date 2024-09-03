import { useLocation, useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { nanoid } from 'nanoid'
import { useEffect, useState } from "react";
import { Save } from "@mui/icons-material";
import { db } from "../../firebase.js";
import { collection, addDoc } from "firebase/firestore";


const TheBasket = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location
    let { data } = state;
    const [filteredData, setFilteredData] = useState(data.filter(row => Object.keys(row).length !== 0));

    const SaveOrder = async () => {
        try {
            if (Array.isArray(filteredData) && filteredData.length > 0) {
                // Firestore expects a single document object, not an array
                const orderData = { items: filteredData };

                const itemRef = await addDoc(collection(db, "orders"), orderData);
                console.log("Document written with ID: ", itemRef.id);
                console.log("Data: ", orderData);
                navigate('/thanks');
            }

        } catch (e) {
            console.error("Error adding document ", e.message);
        }
    }

    const removeFromTheBasket = (id) => {
        console.log("Row id to be removed: ", id)
        const afterRemoval = filteredData.filter(f => f.id != id)
        setFilteredData(afterRemoval)
    }

    //Purchase sum
    const totalsum = filteredData.reduce((accumulator, item) => {
        return accumulator + (item.priceh * item.kpl)
    }, 0)


    return (
        <>
            <h1>Tilauskorisi</h1>
            <h4>Maksu työn valmistuttua, laskulla</h4>


            <Table sx={{ minWidTableCell: 650 }} size="small" aria-label="a dense table">
                <TableHead sx={{ fontSize: 'bold' }}>
                    <TableRow key={nanoid()}>
                        <TableCell align="right" sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Tuote</TableCell><TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Määrä</TableCell><TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Yksikköhinta</TableCell><TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Summa</TableCell><TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Veroton</TableCell><TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Vero 25.5%</TableCell><TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Yhteensä</TableCell><TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Poista</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody key={nanoid()}>
                    {filteredData.map(item =>
                        <TableRow key={item.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell>{item.title}</TableCell>
                            <TableCell>{item.kpl}</TableCell>
                            <TableCell>{item.priceh}</TableCell>
                            <TableCell>{item.priceh * item.kpl}</TableCell>
                            <TableCell>{(item.priceh * item.kpl) * 25.5 / 100}</TableCell>
                            <TableCell>{(item.priceh * item.kpl) - ((item.priceh * item.kpl) * 25.5 / 100)}</TableCell>
                            <TableCell>{item.priceh * item.kpl}</TableCell>
                            <TableCell><Button onClick={() => removeFromTheBasket(item.id)}>X</Button></TableCell>
                        </TableRow>
                    )}
                    <TableRow>
                        <TableCell sx={{ mt: 2, backgroundColor: '#d13529', fontWeight: 'bold' }}>Yhteissumma</TableCell><TableCell></TableCell><TableCell></TableCell><TableCell sx={{ mt: 2, fontWeight: 'bold' }}>{totalsum}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <Button variant="contained" onClick={() => SaveOrder()} sx={{ mt: 2, mb: 1 }}>Vahvista</Button>
            <Button variant="contained" onClick={() => navigate(-1)}>Ostoksille</Button>


        </>
    );

}

export default TheBasket;