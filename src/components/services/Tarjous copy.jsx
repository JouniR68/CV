import { addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../firebase';
import Button from '@mui/material/Button';
import "./css/tarjouslomake.css"

// Komponentti tarjouksen tekemiseen
const TarjousLomake = () => {
    // Laskentaparametrit
    const TUNTIHINTA = 49; // Tuntihinta euroissa
    const ALV_PERCENTAGE = 25.5; // Arvonlisävero
    const KOTITALOUSVAHENNYS_PERCENTAGE = 40; // Kotitalousvähennysprosentti
    const MAX_KOTITALOUSVAHENNYS = 3500 - 100; // Maksimivähennys
    const KILOMETRIKUSTANNUS = 0.57
    //const TARJOUS_VOIMASSA = twoweeksLaters.setDate(today.getDate() + 14).toString()


    const [tarjoaja, setTarjoaja] = useState({ nimi: '', osoite: '', puhelin: '', sahkoposti: '', ytunnus: '' });
    const [saaja, setSaaja] = useState({ nimi: '', osoite: '', puhelin: '', sahkoposti: '' });
    const [tehtava, setTehtava] = useState('');
    const [kuvaus, setKuvaus] = useState('');
    const [tuntiarvio, setTuntiarvio] = useState(0);
    const [tehtavat, setTehtavat] = useState([]);
    const [muutHuomiot, setMuutHuomiot] = useState('');
    const [matkakulut, setMatkakulut] = useState({ lahto: '', maaranpaa: '', kmhinta: KILOMETRIKUSTANNUS, km: 0, maara: 0, kmkustannus: 0 });

    const [sisaltyy, setSisaltyy] = useState('')
    const [suositukset, setSuositukset] = useState('');
    const [naytaYhteystiedot, setNaytaYhteystiedot] = useState(false);
    const [naytaYhteenveto, setNaytaYhteenveto] = useState(false);
    const uuid = uuidv4()
    const today = new Date()
    const twoweeksLaters = new Date(today);

    const tarjous = {
        tarjoaja, saaja, tehtavat, kuvaus: kuvaus, tuntiarvio, muutHuomiot, sisaltyy, suositukset, matkakulut
    }

    const tarjousRef = collection(db, 'tarjoukset')

    const save = async () => {
        //Talleta firebaseeen
        try {
            await (addDoc(tarjousRef, tarjous))
            console.log("Tarjous talletettu")
            Navigate('/thanks')
        } catch (error) {
            console.error("Talletus firebaseen epäonnistui: ", error)
        }
    }

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


    const laskeMatka = (maara, km) => {
        console.log("maara: ", maara + ", km: ", km + ", km korvaus: ", KILOMETRIKUSTANNUS)
        setMatkakulut({ maara: maara, kmkustannus: maara * (km * KILOMETRIKUSTANNUS).toFixed(2) })
    }

    return (
        <div className="tarjous-form">
        {!naytaYhteenveto ? (
          <div>
            <h2>Tarjouslomake</h2>
            <Button onClick={() => setNaytaYhteystiedot(!naytaYhteystiedot)}>
              {naytaYhteystiedot ? 'Piilota' : 'Yhteystiedot'}
            </Button>
            {naytaYhteystiedot && (
              <div className="tarjous-section">
                <div className="tarjous-section">
                  <h3>Tarjoaja</h3>
                  <input
                    type="text"
                    placeholder="Nimi"
                    value={tarjoaja.nimi}
                    onChange={(e) => setTarjoaja({ ...tarjoaja, nimi: e.target.value })}
                  />
                  {/* Other input fields for Tarjoaja */}
                </div>
    
                <div className="tarjous-section">
                  <h3>Asiakas</h3>
                  <input
                    type="text"
                    placeholder="Nimi"
                    value={saaja.nimi}
                    onChange={(e) => setSaaja({ ...saaja, nimi: e.target.value })}
                  />
                  {/* Other input fields for Asiakas */}
                </div>
              </div>
            )}
    
            <div className="tarjous-section">
              <h3>Matkakulut</h3>
              <div className="tarjous--matkakulut">
                <input type="text" placeholder="Lähtö" value={matkakulut.lahto} onChange={(e) => setMatkakulut({ lahto: e.target.value })} />
                <input type="text" placeholder="Määränpää" value={matkakulut.maaranpaa} onChange={(e) => setMatkakulut({ maaranpaa: e.target.value })} />
                <label>km</label><input type="number" placeholder="km" value={matkakulut.km} onChange={(e) => setMatkakulut({ km: e.target.value })} />
                <label>Määrä</label><input type="number" placeholder="Määrä" value={matkakulut.maara} onChange={(e) => laskeMatka(e.target.value, matkakulut.km)} />
                <label>Kustannus:<br />{(matkakulut.kmkustannus)}</label>
              </div>
            </div>
    
            <div className="tarjous-section">
              <h3>Tehtävät</h3>
              <form className="tarjous--tehtavat">
                <input
                  type="text"
                  placeholder="Tehtävä"
                  value={tehtava}
                  onChange={(e) => setTehtava(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Kuvaus"
                  value={kuvaus}
                  onChange={(e) => setKuvaus(e.target.value)}
                />
                <label>Tuntiarvio</label>
                <input
                  type="number"
                  placeholder="Tuntiarvio"
                  value={tuntiarvio}
                  onChange={(e) => setTuntiarvio(e.target.value)}
                />
                <label>Kustannus: <br />{(tuntiarvio * TUNTIHINTA).toFixed(2)}</label>
              </form>
              <Button type="Button" onClick={lisaaTehtava} style={{ marginRight: '10px' }}>
                +
              </Button>
            </div>
    
            <Button type="Button" onClick={save}>
              Yhteenvetoon
            </Button>
          </div>
        ) : (
          <h1>Voihan räkä, virhe tapahtui.</h1>
        )}
      </div>
    )
}

export default TarjousLomake;
