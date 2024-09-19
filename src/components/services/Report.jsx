// src/Report.js
import { useRef, useEffect, useState } from 'react';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db, storage } from '../../firebase';  // Your Firebase setup file
import { jsPDF } from 'jspdf';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import 'jspdf-autotable';  // Import autoTable plugin after jsPDF
import { Button } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../LoginContext';
import { useNavigate } from 'react-router-dom';
import { t } from 'i18next';

const Report = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [access, setAccess] = useState(false)

  const fNameRef = useRef(sessionStorage.getItem("firstName"))
  const lNameRef = useRef(sessionStorage.getItem("lastName"))
  let sessionUser = ""


  sessionUser = fNameRef.current + " " + lNameRef.current

  console.log("sessionUser: ", sessionUser)

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, 'tuntikirjanpito'));
    const fetchedData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(lasku => lasku.client === (sessionUser && lasku.isPaid === false));
    const found = fetchedData.some(item => item.client === "Timo Vuori");
    if (found) {
      setAccess(true)
      setData(fetchedData);
    }

  };

  useEffect(() => {
    fetchData()
  }, []);


  const generatePDF = () => {
    const doc = new jsPDF();

    const uuid = Math.floor(Math.random() * 1000000);  // Random invoice number for example purposes

    const values = data.map(payment => Number(payment.hours) || 0)
    const sum = values.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    console.log("sum: ", sum)
    // Add title
    doc.text('Lasku', 15, 10);
    doc.setFontSize(12);

    // Add Bill details
    // doc.text(`Laskun numero: ${uuid}`, 120, 40);
    doc.text(`Päivämäärä: ${new Date().toLocaleDateString()}`, 120, 30);
    doc.text(`Eräpäivä: Sovittavissa / joka perjantai.`, 120, 40);
    doc.text(`Asiakas: ${data[0]?.client || "Timo Vuori"}`, 15, 50)
    doc.text('Lisätiedot: Työtuntien ja ajokilometrien laskutusta', 15, 70);

    // To be deleted
    // entry.client || 'N/A',

    // Table Headers
    const headers = [['Päivä', 'Tunnit', 'Selite', 'Maksettu']];

    // Table Rows
    const rows = data
      .filter((_, index) => index !== 0)
      .map((entry) => [
        entry.day || 'N/A',
        entry.hours || 0,
        entry.description || 'N/A',
        entry.isPaid ? 'Kyllä' : 'Ei'
      ]).filter((row) => !row.includes('N/A'));

    // Add table with autoTable
    doc.autoTable({
      head: headers,
      body: rows,
      startY: 80,  // Adjust start position
      theme: 'grid',
    });

    // Summary Section
    doc.text(`Yhteenveto: Tunteja ${new Date().toLocaleDateString()} mennessä ${sum} ja sovitut ajokilometrikustannukset 110 euroa`, 15, doc.lastAutoTable.finalY + 20);
    doc.text(`Yhteensä: ${sum * 15 + 110} euroa`, 15, doc.lastAutoTable.finalY + 30);
    doc.text('Toivottu maksutapa: Mobile Pay (045 2385 888) / tilille FI71 1470 3500 2922 74', 15, doc.lastAutoTable.finalY + 40);
    doc.text('Maksu projektin loppuessa / erissä, mikäli maksatte erissä (minimi 100 euroa) niin ilmoittakaa ' + '\n' + 'maksettu päivä / päiväkohtainen summa.', 15, doc.lastAutoTable.finalY + 50);

    // Save the PDF
    doc.save('Aitaprojekti-Espoo.pdf');

    savePdfToStorage(doc, uuid)
  };

  const savePdfToStorage = async (doc, uuid) => {
    // Convert the PDF to Blob
    const pdfBlob = doc.output('blob');

    // Create a storage reference
    const storageRef = ref(storage, `laskut/lasku-${uuid}.pdf`);

    try {
      // Upload the PDF to Firebase Storage
      await uploadBytes(storageRef, pdfBlob);

      // Get the download URL
      //const downloadURL = await getDownloadURL(snapshot.ref);

      /* Save the download URL and metadata to Firestore (optional)
      await addDoc(collection(db, 'tuntikirjanpito'), {
        downloadURL,
        createdAt: new Date(),
        invoiceNumber: uuid,
        total: sum * 15 + 110,
      });

      alert('PDF uploaded successfully!');
      */
    } catch (error) {
      console.error('Error uploading PDF:', error);
      alert('Failed to upload PDF. Please try again.');
    }
  }

  return (
    <div style={{ padding: 20 }}>
      {isLoggedIn ?
        <div className="lasku">
          {data.length > 0 && <h1>Moi {fNameRef.current}!<p></p>Lataa avoimet laskusi alla olevasta napista.</h1>}

          {access === true ? <Button style={{ marginTop: 50 }} variant="contained" onClick={generatePDF}>
            Erääntyvät
          </Button>
            :
            <h1>{t('Nobills')}</h1>
          }
        </div>
        :
        <div>
          <h2><Button style={{ marginTop: 200, fontWeight: 700, fontSize: 16 }} onClick={() => navigate('/userLogin')}>Kirjautumien</Button>
            <br></br>
            <Button style={{ fontWeight: 700, fontSize: 16 }} onClick={() => navigate('/register')}>rekisteröinti</Button> vaaditaan</h2>

        </div>
      }
    </div>

  );
}

export default Report