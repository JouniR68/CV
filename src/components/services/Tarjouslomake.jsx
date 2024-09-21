import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../firebase';

import { Container, Button, TextField, Typography, Box, Grid } from '@mui/material';

// Komponentti tarjouksen tekemiseen
const TarjousLomake = () => {
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

    // Käsittelee tehtävän lisäämisen
    const lisaaTehtava = () => {
        const kuluarvio = (parseFloat(tuntiarvio) || 0) * tuntihinta;
        const uusiTehtava = {
            tehtava,
            kuvaus,
            tuntiarvio: parseFloat(tuntiarvio) || 0,
            kuluarvio: kuluarvio.toFixed(2),
        };

        setTehtavat([...tehtavat, uusiTehtava]);

        // Tyhjennetään kentät
        setTehtava('');
        setKuvaus('');
        setTuntiarvio('');
    };

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
            body: tehtavat.map(item => [item.tehtava, item.kuvaus, item.tuntiarvio, `${item.kuluarvio} €`, `${item.kuluarvio * 0.255} €` , `${(Number(item.kuluarvio) + Number(item.kuluarvio) * 0.255).toFixed(2)} €`]),
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

    return (
        <div>
            <Container maxWidth="md" className = "tarjous">
                <Box>
                    <Typography variant="h4">Tarjouslomake</Typography>
                    <Box mt={2} mb={4}>
                        <Box mb={4}>
                            <Typography variant="h6">Tuntihinta</Typography>
                            <TextField
                                type="number"
                                value={tuntihinta}
                                onChange={(e) => setTuntihinta(e.target.value)}
                                style={{ width: '4rem' }}
                                variant="outlined"
                            />
                        </Box>
                        <hr />
                        <Box mb={4}>
                            <Typography variant="h6">Tarjoaja</Typography>
                            <TextField
                                type="text"
                                label="Nimi"
                                value={tarjoaja.nimi}
                                onChange={(e) => setTarjoaja({ ...tarjoaja, nimi: e.target.value })}
                                variant="outlined"
                                fullWidth
                            />
                            <TextField
                                type="text"
                                label="Osoite"
                                value={tarjoaja.osoite}
                                onChange={(e) => setTarjoaja({ ...tarjoaja, osoite: e.target.value })}
                                variant="outlined"
                                fullWidth
                            />
                            <TextField
                                type="text"
                                label="Puhelinnumero"
                                value={tarjoaja.puhelin}
                                onChange={(e) => setTarjoaja({ ...tarjoaja, puhelin: e.target.value })}
                                variant="outlined"
                                fullWidth
                            />
                            <TextField
                                type="email"
                                label="Sähköposti"
                                value={tarjoaja.sahkoposti}
                                onChange={(e) => setTarjoaja({ ...tarjoaja, sahkoposti: e.target.value })}
                                variant="outlined"
                                fullWidth
                            />
                            <TextField
                                type="text"
                                label="Y-tunnus"
                                value={tarjoaja.ytunnus}
                                onChange={(e) => setTarjoaja({ ...tarjoaja, ytunnus: e.target.value })}
                                variant="outlined"
                                fullWidth
                            />
                        </Box>
                        <hr />
                        <Box mb={4}>
                            <Typography variant="h6">Asiakas</Typography>
                            <TextField
                                type="text"
                                label="Nimi"
                                value={saaja.nimi}
                                onChange={(e) => setSaaja({ ...saaja, nimi: e.target.value })}
                                variant="outlined"
                                fullWidth
                            />
                            <TextField
                                type="text"
                                label="Osoite"
                                value={saaja.osoite}
                                onChange={(e) => setSaaja({ ...saaja, osoite: e.target.value })}
                                variant="outlined"
                                fullWidth
                            />
                            <TextField
                                type="text"
                                label="Puhelinnumero"
                                value={saaja.puhelin}
                                onChange={(e) => setSaaja({ ...saaja, puhelin: e.target.value })}
                                variant="outlined"
                                fullWidth
                            />
                            <TextField
                                type="email"
                                label="Sähköposti"
                                value={saaja.sahkoposti}
                                onChange={(e) => setSaaja({ ...saaja, sahkoposti: e.target.value })}
                                variant="outlined"
                                fullWidth
                            />
                            <TextField
                                type="text"
                                label="Y-tunnus"
                                value={saaja.ytunnus}
                                onChange={(e) => setSaaja({ ...saaja, ytunnus: e.target.value })}
                                variant="outlined"
                                fullWidth
                            />
                        </Box>
                    </Box>

                    <hr />
                    <Typography variant="h6">Matkakulut</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="text"
                                label="Lähtö"
                                value={matkakulut.lahto}
                                onChange={(e) => setMatkakulut({ lahto: e.target.value })}
                                variant="outlined"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="text"
                                label="Määränpää"
                                value={matkakulut.maaranpaa}
                                onChange={(e) => setMatkakulut({ maaranpaa: e.target.value })}
                                variant="outlined"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <TextField
                                type="number"
                                label="km"
                                value={matkakulut.km}
                                onChange={(e) => setMatkakulut({ ...matkakulut, km: e.target.value })}
                                variant="outlined"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <TextField
                                type="number"
                                label="Määrä"
                                value={matkakulut.maara}
                                onChange={(e) => setMatkakulut({ maara: e.target.value })}
                                variant="outlined"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>Kustannus: {Number(matkakulut.maara * (matkakulut.km * KILOMETRIKUSTANNUS)).toFixed(2)}</Typography>
                        </Grid>
                    </Grid>

                    <hr />
                    <Typography variant="h6">Tehtävät</Typography>
                    <form>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    type="text"
                                    label="Tehtävä"
                                    value={tehtava}
                                    onChange={(e) => setTehtava(e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    type="text"
                                    label="Kuvaus"
                                    value={kuvaus}
                                    onChange={(e) => setKuvaus(e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    type="number"
                                    label="Tuntiarvio"
                                    value={tuntiarvio}
                                    onChange={(e) => setTuntiarvio(e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography>Kustannus: {(tuntiarvio * tuntihinta).toFixed(2)}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Button onClick={lisaaTehtava} variant="contained">
                                    +
                                </Button>
                            </Grid>
                        </Grid>
                    </form>

                    <hr />
                    <Box mt={2}>
                        <Typography variant="h6">Työväline kustannukset</Typography>
                        <TextField
                            type="number"
                            value={valinekustannus}
                            onChange={(e) => setValineKustannus(e.target.value)}
                            variant="outlined"
                            fullWidth
                        />
                    </Box>
                    <hr />
                    <Box mt={4}>
                        <Typography variant="h6">Tarjous sisältää</Typography>
                        <TextField
                            placeholder="Asiakkaan kanssa sovitut tehtävät."
                            value={sisaltyy}
                            onChange={(e) => setSisaltyy(e.target.value)}
                            variant="outlined"
                            multiline
                            rows={3}
                            fullWidth
                            margin="normal"
                        />
                        <hr />
                        <Typography variant="h6">Tarjoukseen Kuulumattomat Asiat</Typography>
                        <TextField
                            placeholder="Esim. matkakulut eivät sisälly tarjoukseen"
                            value={muutHuomiot}
                            onChange={(e) => setMuutHuomiot(e.target.value)}
                            variant="outlined"
                            multiline
                            rows={3}
                            fullWidth
                            margin="normal"
                        />

                        <hr />
                        <Typography variant="h6">Suositukset Asiakkaalle</Typography>
                        <TextField
                            placeholder="Esim. suosittelemme lisäpalveluita..."
                            value={suositukset}
                            onChange={(e) => setSuositukset(e.target.value)}
                            variant="outlined"
                            multiline
                            rows={3}
                            fullWidth
                            margin="normal"
                        />
                    </Box>

                    <Button onClick={generatePDF} variant="contained" color="primary" style={{ marginTop: '20px' }}>
                        Luo tarjous
                    </Button>
                </Box>
            </Container>
        </div>
    );
};

export default TarjousLomake;