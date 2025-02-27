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
import { db } from "../../../firebase.js";
import { collection, addDoc } from "firebase/firestore";
import Contact from "../Contact.jsx";
import { v4 as uuidv4 } from 'uuid';

const TheBasket = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location
    let { data } = state;
    console.log("data: " + data);
    const [filteredData, setFilteredData] = useState(data.filter(row => Object.keys(row).length !== 0));
    const [contactDetails, setContactDetails] = useState({})
    const uuid = uuidv4()
    console.log("tilausnro: ", uuid)
    const SaveOrder = async () => {
        try {
            if (!contactDetails.Etunimi || !contactDetails.Sukunimi) {
                navigate('/errorNote', { state: { title: "Yhteystiedot", description: 'Yhteystiedot puuttuvat / puutteelliset' } })
                return;                
            }

            if (Array.isArray(filteredData) && filteredData.length > 0) {
                // Combine product data and contact details into one object
                const combinedOrder = {
                    tilausnro: uuid,
                    timestamp: new Date(),
                    items: filteredData.map(item => ({
                        id: item.id,
                        title: item.title,
                        kpl: item.kpl,
                        price: item.priceh
                    })),
                    tila: 'uusi',
                    ...contactDetails, // Spread contact details into the same object
                };

                // Save combinedOrder as the first array index
                const orderData = { orders: [combinedOrder] };

                // Save to Firebase
                const itemRef = await addDoc(collection(db, "orders"), orderData);
                console.log("Document written with ID: ", itemRef.id);
                navigate('/thanks');
            }
        } catch (e) {
            console.error("Error adding document: ", e.message);
        }
    };

    const removeFromTheBasket = (id) => {
        console.log("Row id to be removed: ", id)
        const afterRemoval = filteredData.filter(f => f.id != id)
        setFilteredData(afterRemoval)
    }

    const handleContactChange = (newContactDetails) => {
        setContactDetails(newContactDetails);
    };


    //Purchase sum
    const totalsum = filteredData.reduce((accumulator, item) => {
        return accumulator + (item.priceh * item.kpl)
    }, 0)


    return (
        <div className="theBasket">
            <h1>Ostoskori </h1>
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
                        <TableCell sx={{ mt: 1, backgroundColor: '#d13529', fontWeight: 'bold' }}>Yhteissumma</TableCell><TableCell sx={{ mt: 2, backgroundColor: '#d13529', fontWeight: 'bold' }}></TableCell><TableCell sx={{ mt: 2, backgroundColor: '#d13529', fontWeight: 'bold' }}></TableCell><TableCell sx={{ mt: 2, backgroundColor: '#d13529', fontWeight: 'bold' }}>{totalsum}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <Contact contactDetails={contactDetails} onContactChange={handleContactChange} />

            <div className="theBasket--buttons">
                <Button variant="contained" onClick={() => SaveOrder()}>Vahvista tilauksesi</Button>
                <Button variant="contained" onClick={() => navigate(-1)}>Jatka ostoksia</Button>
            </div>
        </div>
    );

}

export default TheBasket;