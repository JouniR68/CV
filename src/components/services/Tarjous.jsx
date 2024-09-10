import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Komponentti tarjouksen tekemiseen
const TarjousLomake = () => {
    const [tarjoaja, setTarjoaja] = useState({ nimi: '', osoite: '', puhelin: '', sahkoposti: '', ytunnus: '' });
    const [saaja, setSaaja] = useState({ nimi: '', osoite: '', puhelin: '', sahkoposti: '' });
    const [tehtava, setTehtava] = useState('');
    const [kuvaus, setKuvaus] = useState('');
    const [tuntiarvio, setTuntiarvio] = useState('');
    const [tehtavat, setTehtavat] = useState([]);
    const [muutHuomiot, setMuutHuomiot] = useState('');
    const [sisaltyy, setSisaltyy] = useState('')
    const [suositukset, setSuositukset] = useState('');
    const [naytaYhteystiedot, setNaytaYhteystiedot] = useState(false);
    const [naytaYhteenveto, setNaytaYhteenveto] = useState(false);
    const uuid = uuidv4()
    const today = new Date()
    const twoweeksLaters = new Date(today);

    // Laskentaparametrit
    const TUNTIHINTA = 49; // Tuntihinta euroissa
    const ALV_PERCENTAGE = 25.5; // Arvonlisävero
    const KOTITALOUSVAHENNYS_PERCENTAGE = 40; // Kotitalousvähennysprosentti
    const MAX_KOTITALOUSVAHENNYS = 3500 - 100; // Maksimivähennys
    const TARJOUS_VOIMASSA = twoweeksLaters.setDate(today.getDate() + 14).toString()

    // Käsittelee tehtävän lisäämisen
    const lisaaTehtava = () => {
        const kuluarvio = (parseFloat(tuntiarvio) || 0) * TUNTIHINTA;
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

    // Käsittelee Valmis-napin painalluksen
    const naytaYhteenvetoNappiaPainettu = () => {
        setNaytaYhteenveto(true);
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

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            {!naytaYhteenveto ? (
                <div>
                    <h2>Tarjouslomake</h2>
                    <button onClick={() => setNaytaYhteystiedot(!naytaYhteystiedot)}>
                        {naytaYhteystiedot ? 'Piilota Yhteystiedot' : 'Näytä Yhteystiedot'}
                    </button>
                    {naytaYhteystiedot && (
                        <div>
                            <h3>Tarjoajan Tiedot</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
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
                            </div>

                            <h3>Tarjouksen Saajan Tiedot</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
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
                                    type="ytunus"
                                    placeholder="Y-tunnus"
                                    value={saaja.ytunnus}
                                    onChange={(e) => setSaaja({ ...saaja, ytunnus: e.target.value })}
                                />

                            </div>
                        </div>
                    )}





                    <h3>Tehtävät</h3>
                    <form>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                gap: '10px',
                                marginBottom: '10px',
                                alignItems: 'center',
                            }}
                        >
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
                            <input
                                type="text"
                                value={(tuntiarvio * TUNTIHINTA).toFixed(2)}
                                readOnly
                                placeholder="Kuluarvio (€)"
                                style={{ flex: 1, backgroundColor: '#f0f0f0' }}
                            />
                        </div>
                        <button type="button" onClick={lisaaTehtava} style={{ marginRight: '10px' }}>
                            +
                        </button>

                    </form>

                    <div style={{ marginTop: '20px' }}>
                        <h3>Tarjous sisältää</h3>
                        <textarea
                            placeholder="Asiakkaan kanssa sovitut tehtävät."
                            value={sisaltyy}
                            onChange={(e) => setSisaltyy(e.target.value)}
                            style={{ width: '100%', height: '60px', marginBottom: '10px' }}
                        />

                        <h3>Tarjoukseen Kuulumattomat Asiat</h3>
                        <textarea
                            placeholder="Esim. matkakulut eivät sisälly tarjoukseen"
                            value={muutHuomiot}
                            onChange={(e) => setMuutHuomiot(e.target.value)}
                            style={{ width: '100%', height: '60px', marginBottom: '10px' }}
                        />
                        <h3>Suositukset Asiakkaalle</h3>
                        <textarea
                            placeholder="Esim. suosittelemme lisäpalveluita..."
                            value={suositukset}
                            onChange={(e) => setSuositukset(e.target.value)}
                            style={{ width: '100%', height: '60px' }}
                        />
                    </div>
                    <button type="button" onClick={naytaYhteenvetoNappiaPainettu}>
                        Valmis
                    </button>

                </div>
            ) : (
                // Yhteenveto tarjouksesta
                <div style={{ padding: '20px', textAlign: 'left', border: '1px solid #ddd', borderRadius: '5px' }}>
                    <h2>Tarjous</h2>

                    <div className="tarjousDetails">
                        Numero: {uuid}<p />
                        Päiväys: {new Date().toLocaleDateString()}<p />
                        Tarjous voimassa: {tarjousVoimassa()}
                    </div>


                    <h3>Tarjoaja</h3>
                    <table className="tarjous--tarjoaja">
                        <thead>
                            <th>Nimi</th>
                            <th>Osoite</th>
                            <th>Puhelin</th>
                            <th>Sähköposti</th>
                            <th>Y-tunnus</th>
                        </thead>

                        <tbody>
                            <td>{tarjoaja.nimi}</td>
                            <td>{tarjoaja.osoite}</td>
                            <td>{tarjoaja.puhelin}</td>
                            <td>{tarjoaja.sahkoposti}</td>
                            <td>{tarjoaja.ytunnus}</td>
                        </tbody>

                    </table>


                    <h3>Asiakas</h3>

                    <table className="tarjous--asiakas">
                        <thead>
                            <tr>
                            <th>Nimi</th>
                            <th>Osoite</th>
                            <th>Puhelin</th>
                            <th>Sähköposti</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                            <td>{saaja.nimi}</td>
                            <td>{saaja.osoite}</td>
                            <td>{saaja.puhelin}</td>
                            <td>{saaja.sahkoposti}</td>
                            </tr>
                        </tbody>
                    </table>

                    <hr />
                    <h3>Tehtävät</h3>
                    <table className="tarjous--tehtavat">
                        <thead>
                            <th>Tehtävä</th>
                            <th>Kuvaus</th>
                            <th>Tuntiarvio</th>
                            <th>Kulukorvaus</th>
                        </thead>

                        <tbody>
                            {tehtavat.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.tehtava}</td>
                                    <td>{item.kuvaus}</td>
                                    <td>{item.tuntiarvio}</td>
                                    <td>{item.kuluarvio}</td>
                                </tr>
                            ))}
                        </tbody>


                    </table>

                    <h3>Yhteenveto</h3>


                    <hr />
                    <h4>Lisätiedot ja ehdot</h4>
                    <p>{muutHuomiot}</p>
                    {suositukset}

                    <hr />
                    <table className="tarjous--yhteenvetosummat">
                        <thead>
                            <th>Kokonaissumma</th>
                            <th>ALV (25.5%)</th>
                            <th>Kotitalousvähennys 40%</th>
                            <th>Maksettavaa kotitalousvähennyksen jälkeen</th>
                        </thead>

                        <tbody>
                            <tr>
                            <td>{yhteenveto.kokonaissumma} €</td>
                    <td> {yhteenveto.alv} €</td>
                    <td>{yhteenveto.kotitalousvahennys} €</td>
                    <td>{yhteenveto.maksettava} €</td>
                    </tr></tbody>
                    </table>
                </div>
                    



    )
}
        
        </div >
        
    );
};

export default TarjousLomake;
