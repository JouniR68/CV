import React, { useEffect, useState } from 'react';
import { Container, Typography, Button } from '@mui/material';
import Tuntihinta from './Tuntihinta';
import Tarjoaja from './Tarjoaja';
import Asiakas from './Asiakas';
import Matkakulut from './Matkakulut';
import Tehtavat from './Tehtavat';
import { useAuth } from '../LoginContext';

export default function TarjousForm() {
    const { isLoggedIn, setIsLoggedIn } = useAuth();

    const [tuntihinta, setTuntihinta] = useState(0);
    const [tarjoaja, setTarjoaja] = useState({
        nimi: '',
        osoite: '',
        puhelin: '',
        sahkoposti: '',
        ytunnus: ''
    });
    const [saaja, setSaaja] = useState({
        nimi: '',
        osoite: '',
        puhelin: '',
        sahkoposti: '',
        ytunnus: ''
    });
    const [matkakulut, setMatkakulut] = useState({
        lahto: '',
        maaranpaa: '',
        km: 0,
        maara: 0
    });
    const [tehtavat, setTehtavat] = useState([]);

    useEffect(() => {
        const isAccessValid = sessionStorage.getItem('accessValid')
        if (isAccessValid) {
            setIsLoggedIn(true)
        }

    }, [])

    const generatePDF = () => {
        // PDF generation logic
    };

    return (
        <div className="tarjous">
            {isLoggedIn ? (
                <Container maxWidth="md">
                    <Typography variant="h4">Tarjouslomake</Typography>

                    {/* Tuntihinta Section */}
                    <Tuntihinta tuntihinta={tuntihinta} setTuntihinta={setTuntihinta} />

                    <hr />

                    {/* Tarjoaja Section */}
                    <Tarjoaja tarjoaja={tarjoaja} setTarjoaja={setTarjoaja} />

                    <hr />

                    {/* Asiakas Section */}
                    <Asiakas saaja={saaja} setSaaja={setSaaja} />

                    <hr />

                    {/* Matkakulut Section */}
                    <Matkakulut matkakulut={matkakulut} setMatkakulut={setMatkakulut} />

                    <hr />

                    {/* Tehtävät Section */}
                    <Tehtavat tehtavat={tehtavat} setTehtavat={setTehtavat} tuntihinta={tuntihinta} />

                    <Button onClick={generatePDF} variant="contained" color="primary" style={{ marginTop: '20px' }}>
                        Luo tarjous
                    </Button>
                </Container>
            ) : (
                <h1>Teillä ei ole pääsyä, kysy adminilta pääsyä.</h1>
            )}
        </div>
    );
}
