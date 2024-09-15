import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../firebase';
import Button from '@mui/material/Button';
import './css/tarjouslomake.css'

// Komponentti tarjouksen tekemiseen
const TarjousLomake = () => {
    // Laskentaparametrit
    //const OlDTUwTIHINTA = 49; // Tuntihinta euroissa
    const ALV_PERCENTAGE = 25.5; // Arvonlisävero
    const KOTITALOUSVAHENNYS_PERCENTAGE = 40; // Kotitalousvähennysprosentti
    const MAX_KOTITALOUSVAHENNYS = 3500 - 100; // Maksimivähennys
    const KILOMETRIKUSTANNUS = 0.57
    //const TARJOUS_VOIMASSA = twoweeksLaters.setDate(today.getDate() + 14).toString()

    const [tuntihinta, setTuntihinta] = useState(49)
    const [tarjoaja, setTarjoaja] = useState({ nimi: '', osoite: '', puhelin: '', sahkoposti: '', ytunnus: '' });
    const [saaja, setSaaja] = useState({ nimi: '', osoite: '', puhelin: '', sahkoposti: '', ytunnus: '' });
    const [tehtava, setTehtava] = useState('');
    const [kuvaus, setKuvaus] = useState('');
    const [tuntiarvio, setTuntiarvio] = useState('');
    const [tehtavat, setTehtavat] = useState([]);
    const [muutHuomiot, setMuutHuomiot] = useState('');
    const [matkakulut, setMatkakulut] = useState({ lahto: '', maaranpaa: '', kmhinta: KILOMETRIKUSTANNUS, km: 0, maara: 0, kmkustannus: 0 });

    const [sisaltyy, setSisaltyy] = useState('')
    const [suositukset, setSuositukset] = useState('');
    const [naytaYhteystiedot, setNaytaYhteystiedot] = useState(false);
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

    // Laskee tarjouksen voimassaoloajan (2 viikkoa eteenpäin)
    const tarjousVoimassa = () => {
        const today = new Date();
        const voimassa = new Date(today);
        voimassa.setDate(today.getDate() + 14);
        return voimassa.toLocaleDateString();
    };


    const laskeMatka = () => {
        console.log("maara: ", matkakulut.maara + ", km: ", matkakulut.km + ", km korvaus: ", KILOMETRIKUSTANNUS)
        setMatkakulut({ maara: matkakulut.maara, kmkustannus: Number(matkakulut.maara * (matkakulut.km * KILOMETRIKUSTANNUS)).toFixed(2) })
    }

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
        doc.text('Tarjoaja:', 14, 50);
        doc.autoTable({
            startY: 55,
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
        doc.text('Tehtävät:', 14, doc.lastAutoTable.finalY + 10);
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 15,
            head: [['Tehtävä', 'Kuvaus', 'Tuntiarvio', 'Kulukorvaus']],
            body: tehtavat.map(item => [item.tehtava, item.kuvaus, item.tuntiarvio, `${item.kuluarvio} €`]),
        });

        // Yhteenveto
        doc.text('Yhteenveto:', 14, doc.lastAutoTable.finalY + 10);
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 15,
            head: [['Kokonaissumma', 'ALV (25.5%)', 'Kotitalousvähennys (40%)', 'Maksettavaa']],
            body: [[`${yhteenveto.kokonaissumma} €`, `${yhteenveto.alv} €`, `${yhteenveto.kotitalousvahennys} €`, `${yhteenveto.maksettava} €`]],
        });

        // PDF:n tallennus
        doc.save(`Tarjous_${uuid}.pdf`);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>

            <div>
                <h2>Tarjouslomake</h2>
                <Button onClick={() => setNaytaYhteystiedot(!naytaYhteystiedot)}>
                    {naytaYhteystiedot ? 'Piilota Yhteystiedot' : 'Näytä Yhteystiedot'}
                </Button>
                {naytaYhteystiedot && (

                    <div className="tarjous">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>

                            <h3>Tuntihinta</h3>
                            <input
                                style={{ width: '3rem' }}
                                type="number"
                                value={tuntihinta}
                                onChange={(e) => setTuntihinta(e.target.value)}
                            />

                            <h3>Tarjoaja</h3>
                            <input
                                type="text"
                                placeholder="Nimi"
                                value={tarjoaja.nimi}
                                onChange={(e) => setTarjoaja({ ...tarjoaja, nimi: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Osoite"
                                value={tarjoaja.osoite}
                                onChange={(e) => setTarjoaja({ ...tarjoaja, osoite: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Puhelinnumero"
                                value={tarjoaja.puhelin}
                                onChange={(e) => setTarjoaja({ ...tarjoaja, puhelin: e.target.value })}
                            />
                            <input
                                type="email"
                                placeholder="Sähköposti"
                                value={tarjoaja.sahkoposti}
                                onChange={(e) => setTarjoaja({ ...tarjoaja, sahkoposti: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Y-tunnus"
                                value={tarjoaja.ytunnus}
                                onChange={(e) => setTarjoaja({ ...tarjoaja, ytunnus: e.target.value })}
                            />

                        </div>


                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                            <h3>Asiakas</h3>
                            <input
                                type="text"
                                placeholder="Nimi"
                                value={saaja.nimi}
                                onChange={(e) => setSaaja({ ...saaja, nimi: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Osoite"
                                value={saaja.osoite}
                                onChange={(e) => setSaaja({ ...saaja, osoite: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Puhelinnumero"
                                value={saaja.puhelin}
                                onChange={(e) => setSaaja({ ...saaja, puhelin: e.target.value })}
                            />
                            <input
                                type="email"
                                placeholder="Sähköposti"
                                value={saaja.sahkoposti}
                                onChange={(e) => setSaaja({ ...saaja, sahkoposti: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Y-tunnus"
                                value={saaja.ytunnus}
                                onChange={(e) => setSaaja({ ...saaja, ytunnus: e.target.value })}
                            />
                        </div>
                    </div>
                )}

                <h3>Matkakulut</h3>
                <div className="tarjous--matkakulut">

                    <input
                        type="text"
                        placeholder="Lähtö"
                        value={matkakulut.lahto}
                        onChange={(e) => setMatkakulut({ lahto: e.target.value })}
                    />


                    <input
                        type="text"
                        placeholder="Määränpää"
                        value={matkakulut.maaranpaa}
                        onChange={(e) => setMatkakulut({ maaranpaa: e.target.value })}
                    />

                    <label>
                        <input
                            type="number"
                            placeholder="km"
                            value={matkakulut.km}
                            onChange={(e) => setMatkakulut({...matkakulut, km: e.target.value })}
                        />
                        km</label>

                    <label>
                        <input
                            type="number"
                            placeholder="Määrä"
                            value={matkakulut.maara}
                            onChange={(e) => setMatkakulut({maara: e.target.value })}
                        />
                        Määrä</label>
                    <label
                        placeholder="ajo kustannukset"
                    >Kustannus:<br></br>{Number(matkakulut.maara * (matkakulut.km * KILOMETRIKUSTANNUS)).toFixed(2)}</label>

                </div>

                <h3>Tehtävät</h3>
                <form>
                    <div className="tarjous--tehtavat">
                        <input
                            type="text"
                            placeholder="Tehtävä"
                            value={tehtava}
                            onChange={(e) => setTehtava(e.target.value)}
                            style={{ flex: 1 }}
                        />
                        <input
                            type="text"
                            placeholder="Kuvaus"
                            value={kuvaus}
                            onChange={(e) => setKuvaus(e.target.value)}
                            style={{ flex: 2 }}
                        />
                        <input
                            type="number"
                            placeholder="Tuntiarvio"
                            value={tuntiarvio}
                            onChange={(e) => setTuntiarvio(e.target.value)}
                            style={{ flex: 1 }}
                        />
                        <label>Kustannus: <br></br>{(tuntiarvio * tuntihinta).toFixed(2)}</label>
                    </div>
                    <Button type="Button" onClick={lisaaTehtava} style={{ marginRight: '10px' }}>
                        +
                    </Button>

                </form>

                <div style={{ marginTop: '20px' }}>
                    <h3>Tarjous sisältää</h3>
                    <textarea
                        placeholder="Asiakkaan kanssa sovitut tehtävät."
                        value={sisaltyy}
                        onChange={(e) => setSisaltyy(e.target.value)}
                        style={{ width: '100%', height: '60px', marginBottom: '10px', padding: '1rem' }}
                    />

                    <h3>Tarjoukseen Kuulumattomat Asiat</h3>
                    <textarea
                        placeholder="Esim. matkakulut eivät sisälly tarjoukseen"
                        value={muutHuomiot}
                        onChange={(e) => setMuutHuomiot(e.target.value)}
                        style={{ width: '100%', height: '60px', marginBottom: '10px', padding: '1rem' }}
                    />
                    <h3>Suositukset Asiakkaalle</h3>
                    <textarea
                        placeholder="Esim. suosittelemme lisäpalveluita..."
                        value={suositukset}
                        onChange={(e) => setSuositukset(e.target.value)}
                        style={{ width: '100%', height: '60px', padding: '1rem' }}
                    />
                </div>
                <Button type="Button" onClick={generatePDF}>
                    Luo tarjous
                </Button>

            </div>
        </div >
    );
};

export default TarjousLomake;