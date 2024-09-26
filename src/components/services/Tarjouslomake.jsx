import React, { useState, useRef, useEffect } from 'react';
import { Container, Button, Typography, Box, Grid, TextField } from '@mui/material';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { addDoc, collection } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../firebase';
import { useAuth } from "../LoginContext";
import { useLocation } from "react-router-dom";
import TarjoajaForm from './Tarjoaja';
import AsiakasForm from './Asiakas';
import MatkakulutForm from './Matkakulut';
import TehtavatForm from './Tehtavat';
import ExtrasForm from './ExtrasForm';

// Main component for generating the offer
const TarjousLomake = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const { isLoggedIn } = useAuth();
    const [isAccess, setIsAccess] = useState(false);
    const accessValid = useRef(sessionStorage.getItem("adminLevel"));
    const [extras, setShowExtras] = useState(false)

    useEffect(() => {
        if (accessValid.current === "valid" && isLoggedIn) {
            setIsAccess(true);
        }
    }, [isLoggedIn]);

    // Laskentaparametrit
    const ALV_PERCENTAGE = 25.5; // Arvonlisävero
    const KOTITALOUSVAHENNYS_PERCENTAGE = 40; // Kotitalousvähennysprosentti
    const MAX_KOTITALOUSVAHENNYS = 3500 - 100; // Maksimivähennys
    const KILOMETRIKUSTANNUS = 0.57
    //const TARJOUS_VOIMASSA = twoweeksLaters.setDate(today.getDate() + 14).toString()

    const [valinekustannus, setValineKustannus] = useState(30)
    const [tuntihinta, setTuntihinta] = useState(49)
    const [tarjoaja, setTarjoaja] = useState({ nimi: 'Jouni Riimala', osoite: 'Vuohennokantie 7, 04330 Lahela', puhelin: '045-2385 888', sahkoposti: 'jr@softa-apu.fi', ytunnus: '' });
    const [saaja, setSaaja] = useState({ nimi: '', osoite: '', puhelin: '', sahkoposti: '', ytunnus: '' });
    const [tehtava, setTehtava] = useState('');
    const [kuvaus, setKuvaus] = useState('');
    const [tuntiarvio, setTuntiarvio] = useState('');
    const [tehtavat, setTehtavat] = useState([]);
    const [muutHuomiot, setMuutHuomiot] = useState('');
    const [matkakulut, setMatkakulut] = useState({ lahto: '', maaranpaa: '', kmhinta: KILOMETRIKUSTANNUS, km: 0, maara: 0, kmkustannus: 0 });

    const [sisaltyy, setSisaltyy] = useState('')
    const [suositukset, setSuositukset] = useState('');

    const uuid = uuidv4()
    const today = new Date()
    const twoweeksLaters = new Date(today);

    const tarjous = {
        tarjoaja, saaja, tehtavat, kuvaus: kuvaus, tuntiarvio, muutHuomiot, sisaltyy, suositukset, matkakulut
    }

    const tarjousRef = collection(db, 'tarjoukset')

    const save = async () => {
        try {
            await (addDoc(tarjousRef, tarjous))
            console.log("Tarjous talletettu")
        } catch (error) {
            console.error("Talletus firebaseen epäonnistui: ", error)
        }
    }

    // Laskee kokonaissummat ja vähennykset
    const laskeYhteenveto = () => {
        const yhteiskulut = tehtavat.reduce((summa, item) => summa + parseFloat(item.kuluarvio), 0);
        const alv = yhteiskulut * (ALV_PERCENTAGE / 100);
        const kokonaissumma = yhteiskulut + alv + valinekustannus;
        const kotitalousvahennys = Math.min(
            yhteiskulut * (KOTITALOUSVAHENNYS_PERCENTAGE / 100),
            MAX_KOTITALOUSVAHENNYS
        );

        return {
            yhteiskulut: yhteiskulut.toFixed(2),
            alv: alv.toFixed(2),
            kokonaissumma: kokonaissumma.toFixed(2),
            kotitalousvahennys: kotitalousvahennys.toFixed(2),
            maksettava: (kokonaissumma - kotitalousvahennys).toFixed(2),
        };
    };

    const yhteenveto = laskeYhteenveto();

    // Laskee tarjouksen voimassaoloajan (2 viikkoa eteenpäin)
    const tarjousVoimassa = () => {
        const today = new Date();
        const voimassa = new Date(today);
        voimassa.setDate(today.getDate() + 14);
        return voimassa.toLocaleDateString();
    };

    const lisaaTehtava = () => {
        if (tehtava && kuvaus && tuntiarvio) {
            setTehtavat([...tehtavat, { tehtava, kuvaus, tuntiarvio }]);
            setTehtava('');
            setKuvaus('');
            setTuntiarvio('');
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        // Otsikko
        doc.setFontSize(20);
        doc.text('Tarjous', 14, 22);

        // Yksityiskohdat
        doc.setFontSize(12);
        doc.text(`Tarjousnumero: ${uuid}`, 14, 30);
        doc.text(`Päiväys: ${new Date().toLocaleDateString()}`, 14, 36);
        doc.text(`Tarjous voimassa: ${new Date().toLocaleDateString()}`, 14, 42);

        // Tarjoajan tiedot
        doc.text('Tarjoaja:', 14, 60);
        doc.autoTable({
            startY: 70,
            head: [['Nimi', 'Osoite', 'Puhelin', 'Sähköposti', 'Y-tunnus']],
            body: [[tarjoaja.nimi, tarjoaja.osoite, tarjoaja.puhelin, tarjoaja.sahkoposti, tarjoaja.ytunnus]],
        });

        // Asiakkaan tiedot
        doc.text('Asiakas:', 14, doc.lastAutoTable.finalY + 10);
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 15,
            head: [['Nimi', 'Osoite', 'Puhelin', 'Sähköposti', 'Y-tunnus']],
            body: [[saaja.nimi, saaja.osoite, saaja.puhelin, saaja.sahkoposti, saaja.ytunnus]],
        });

        doc.text(`Työvälinekustannusarvio: ${valinekustannus} €`, 14, 123)

        // Tehtävät
        doc.text('Tehtävät:', 14, 133);
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 22,
            head: [['Tehtävä', 'Kuvaus', 'Tuntiarvio', 'Tuntiarvio * tuntihinta', 'Alv 25.5%', 'Alvillinen summa']],
            body: tehtavat.map(item => [item.tehtava, item.kuvaus, item.tuntiarvio, `${item.kuluarvio} €`, `${item.kuluarvio * 0.255} €`, `${(Number(item.kuluarvio) + Number(item.kuluarvio) * 0.255).toFixed(2)} €`]),
        });

        // Yhteenveto
        doc.text('Yhteenveto:', 14, 168);
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 14,
            head: [['Kokonaissumma', 'ALV (25.5%)', 'Kotitalousvähennys (40%)', 'Vähennyksen jälkeen']],
            body: [[`${yhteenveto.kokonaissumma} €`, `${yhteenveto.alv} €`, `${yhteenveto.kotitalousvahennys} €`, `${yhteenveto.maksettava} €`]],
        });

        doc.text('Lopullinen lasku perustuu käytettyihin tunteihin ja kuluihin +/- 25% välillä.', 14, 200)

        // PDF:n tallennus
        doc.save(`Tarjous_${uuid}.pdf`);
        save()
    };

    const saveToFirestore = async () => {
        try {
            await addDoc(collection(db, 'tarjoukset'), {
                tarjoaja,
                saaja,
                tehtavat,
                matkakulut,
                id: uuidv4(),
            });
        } catch (error) {
            console.error('Error saving document:', error);
        }
    };

    const naytaExtrat = () => {
        setShowExtras(!extras)
    }

    return isAccess ? (
        <div className ="tarjous">
        <Container maxWidth="md">
            <Typography variant="h4" align="center" gutterBottom>Tarjouslomake</Typography>

            <div className="tarjous-osapuolet">
                <TarjoajaForm tarjoaja={tarjoaja} setTarjoaja={setTarjoaja} />
                <AsiakasForm saaja={saaja} setSaaja={setSaaja} />
            </div>
            <TehtavatForm
                tehtava={tehtava}
                setTehtava={setTehtava}
                kuvaus={kuvaus}
                setKuvaus={setKuvaus}
                tuntiarvio={tuntiarvio}
                setTuntiarvio={setTuntiarvio}
                tuntihinta={tuntihinta}
                lisaaTehtava={lisaaTehtava}
            />

            <MatkakulutForm matkakulut={matkakulut} setMatkakulut={setMatkakulut} KILOMETRIKUSTANNUS={KILOMETRIKUSTANNUS} />


            <Button style={{marginTop:'1rem'}} variant = "contained" onClick={ () => {naytaExtrat()}}>
                {extras && <ExtrasForm valinekustannus={valinekustannus} setValineKustannus={setValineKustannus} sisaltyy={sisaltyy} setSisaltyy={setSisaltyy} muutHuomiot={muutHuomiot} setMuutHuomiot={setMuutHuomiot} suositukset={suositukset} setSuositukset={setSuositukset} />}
            LISÄÄ
            </Button>

            <Box mt={4}>
                <Button variant="contained" color="primary" onClick={generatePDF}>
                    Generoi PDF
                </Button>
                <Button variant="contained" color="secondary" onClick={saveToFirestore} style={{ marginLeft: '10px' }}>
                    Tallenna Firestoreen
                </Button>
            </Box>
        </Container>
        </div>
    ) : <h1>Lomakkeessa ongelmia..</h1>;
};

export default TarjousLomake;
