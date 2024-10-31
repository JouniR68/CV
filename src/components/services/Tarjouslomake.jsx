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
import TarjousLomake2 from './TarjousLomake2';
import TarjousLomake3 from './TarjousLomake3';
import TarjousLomake4 from './TarjousLomake4';


// Main component for generating the offer
const Tarjouslomake = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const { isLoggedIn } = useAuth();
    const [isAccess, setIsAccess] = useState(false);
    const accessValid = useRef(sessionStorage.getItem("adminLevel"));
    const fname = useRef(sessionStorage.getItem("firstName"));
    const [currentStep, setCurrentStep] = useState(1);

    // Function to go to the next step
    const handleNextStep = () => {
        setCurrentStep((prevStep) => prevStep + 1);
    };

    // Function to go to the previous step (optional)
    const handlePreviousStep = () => {
        setCurrentStep((prevStep) => prevStep - 1);
    };

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
    //const tarjouslomake_VOIMASSA = twoweeksLaters.setDate(today.getDate() + 14).toString()

    const [tuntihinta, setTuntihinta] = useState(49)
    const [tarjoaja, setTarjoaja] = useState({ nimi: 'Jouni Riimala', osoite: 'Vuohennokantie 7, 04330 Lahela', puhelin: '045-2385 888', sahkoposti: 'jr@softa-apu.fi', ytunnus: '3210413-8' });
    const [saaja, setSaaja] = useState({ nimi: '', osoite: '', puhelin: '', sahkoposti: '', ytunnus: '' });
    const [tehtava, setTehtava] = useState('');
    const [kuvaus, setKuvaus] = useState('');
    const [tuntiarvio, setTuntiarvio] = useState('');
    const [tehtavat, setTehtavat] = useState([]);
    const [eiKuulu, setEiKuulu] = useState('');
    const [matkakulut, setMatkakulut] = useState({ lahto: '', maaranpaa: '', kmhinta: KILOMETRIKUSTANNUS, km: 0, maara: 0, kmkustannus: 0 });

    const [sisaltyy, setSisaltyy] = useState('')
    const [suositukset, setSuositukset] = useState('');

    const uuid = uuidv4()
    const today = new Date()
    const twoweeksLaters = new Date(today);

    const tarjouslomake = {
        tarjoaja, saaja, tehtavat, kuvaus: kuvaus, tuntiarvio, eiKuulu, sisaltyy, suositukset, matkakulut
    }

    const tarjouslomakeRef = collection(db, 'tarjoukset')

    const save = async () => {
        try {
            await (addDoc(tarjouslomakeRef, tarjouslomake))
            console.log("tarjouslomake talletettu")
        } catch (error) {
            console.error("Talletus firebaseen epäonnistui: ", error)
        }
    }

    // Laskee kokonaissummat ja vähennykset
    const laskeYhteenveto = () => {
        const yhteiskulut = tehtavat.reduce((summa, item) => summa + parseFloat(item.kuluarvio), 0);
        console.log("yhteiskulut: ", yhteiskulut)
        const alv = yhteiskulut * (ALV_PERCENTAGE / 100);
        const kokonaissumma = yhteiskulut + alv;
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
    console.log("yhteenveto: ", yhteenveto)

    // Laskee tarjouksen voimassaoloajan (2 viikkoa eteenpäin)
    const tarjouslomakeVoimassa = () => {
        const today = new Date();
        const voimassa = new Date(today);
        voimassa.setDate(today.getDate() + 14);
        return voimassa.toLocaleDateString();
    };

    const lisaaTehtava = () => {
        console.log("lisaaTehtava funkkari Tarjouslomakkeella")
        if (tehtava && kuvaus && tuntiarvio) {
            const kuluarvio = parseFloat(tuntiarvio) * tuntihinta; // Calculate kuluarvio
            setTehtavat([...tehtavat, { tehtava, kuvaus, tuntiarvio, kuluarvio }]);
            setTehtava('');
            setKuvaus('');
            setTuntiarvio(0);
        }
    };


    const generatePDF = () => {
        const doc = new jsPDF();

        // Otsikko
        doc.setFontSize(20);
        doc.text('TARJOUSLOMAKE', 14, 22);

        // Yksityiskohdat
        doc.setFontSize(12);
        doc.text(`Tarjouksen numero: ${uuid}`, 14, 30);
        doc.text(`Päiväys: ${new Date().toLocaleDateString()}`, 14, 36);
        doc.text(`Voimassa: ${tarjouslomakeVoimassa()}`, 14, 42);

        // Tarjoajan tiedot
        doc.text('Tarjoaja:', 14, 60);
        doc.autoTable({
            startY: 65,
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
        
        // Tehtävät
        doc.text('Tehtävät:', 14, 130);
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 25,
            head: [['Tehtävä', 'Kuvaus', 'Tuntiarvio', 'Tuntiarvio * tuntihinta', 'Alv 25.5%', 'Alvillinen summa']],
            body: tehtavat.map(item => [item.tehtava, item.kuvaus, item.tuntiarvio, `${item.kuluarvio.toFixed(2)} €`, `${(item.kuluarvio * 0.255).toFixed(2)} €`, `${(Number(item.kuluarvio) + Number(item.kuluarvio) * 0.255).toFixed(2)} €`]),
        });

        // Yhteenveto
        doc.text('Yhteenveto:', 14, 187);
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 25,
            head: [['Kokonaissumma', 'ALV (25.5%)', 'Kotitalousvähennys (40%)', 'Vähennyksen jälkeen']],
            body: [[`${Number(yhteenveto.kokonaissumma)} €`, `${Number(yhteenveto.alv)} €`, `${yhteenveto.kotitalousvahennys} €`, `${yhteenveto.maksettava} €`]],
        });
        
        doc.text('Tarjouksen kokonaisummasta maksettava ennen työnaloitusta 15%\njoka tulkitaan tarjouksen hyväksynnäksi.', 14, 220)        
        doc.text('Mikäli asiakas peruuttaa tilauksen maksettua 15% ei palauteta.', 14, 230)        
        doc.text('Ennakkomaksu tiedot: Mobile Pay (045 2385 888) / tilille FI71 1470 3500 2922 74,', 14, 240)
        doc.text('lisätkää viestiosuuteen yrityksenne tai Teidän nimi.', 14, 245)
        doc.text('Asiakkaan tulee myös ilmoittaa tarjouksen hyväksynnästä osoitteeseen jr@softa-apu.fi', 14, 260)

        // PDF:n tallennus
        doc.save(`tarjouslomake_${uuid}.pdf`);
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


    return isAccess ? (
        <div className="tarjouslomake">
            <Container maxWidth="md">
                <Typography variant="h4" align="center" gutterBottom>Tarjouslomake - sivu {currentStep}</Typography>
                {currentStep === 1 && (
                    <>
                        <div className="tarjouslomake-osapuolet">
                            <TarjoajaForm tarjoaja={tarjoaja} setTarjoaja={setTarjoaja} />
                            <AsiakasForm saaja={saaja} setSaaja={setSaaja} />
                        </div>                        
                        <Button className="tarjouslomake-nappi" variant="contained" onClick={handleNextStep}>
                            SEURAAVA
                        </Button>

                    </>
                )}

                {/* Step 2 of the form */}
                {currentStep === 2 && (
                    <div>
                        <TarjousLomake2 matkakulut={matkakulut} setMatkakulut={setMatkakulut} />
                        <div className="tarjouslomake-nappi">
                            <Button variant="contained" onClick={handlePreviousStep}>Takaisin</Button>
                            <Button variant="contained" onClick={() => handleNextStep()}>
                                SEURAAVA
                            </Button>
                        </div>
                    </div>
                )}

                {currentStep === 3 && (
                    <div>
                        <TarjousLomake3 tehtava={tehtava} setTehtava={setTehtava} kuvaus={kuvaus} setKuvaus={setKuvaus} tuntiarvio={tuntiarvio} setTuntiarvio = {setTuntiarvio} tuntihinta = {tuntihinta} setTuntihinta={setTuntihinta} lisaaTehtava={lisaaTehtava} />
                        <div className="tarjouslomake-nappi">
                            <Button variant="contained" onClick={handlePreviousStep}>Takaisin</Button>
                            <Button variant="contained" onClick={() => handleNextStep()}>
                                SEURAAVA
                            </Button>

                        </div>
                    </div>
                )}

                {currentStep === 4 && (
                    <div>
                        <TarjousLomake4 sisaltyy={sisaltyy} setSisaltyy={setSisaltyy} eiKuulu={eiKuulu} setEiKuulu={setEiKuulu} suositukset={suositukset} setSuositukset={setSuositukset} />
                        <div className="tarjouslomake-nappi">
                            <Button variant="contained" onClick={handlePreviousStep}>Takaisin</Button>
                        </div>
                    </div>
                )}


                {currentStep === 4 && <Box mt={2}>
                    <div className="tarjouslomake-nappi">
                    <Button variant="contained" color="primary" onClick={generatePDF}>
                        PDF
                    </Button>
                    <Button variant="contained" color="secondary" onClick={saveToFirestore} style={{ marginLeft: '10px' }}>
                        Talleta
                    </Button>
                    </div>
                </Box>}
            </Container>
        </div>
    ) : <h1 style={{ marginTop: '7rem', backgroundColor: '#FFFFFF' }}>Voihan räkä, asiaa tutkitaan..</h1>;
};

export default Tarjouslomake;
