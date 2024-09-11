// src/Report.js
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';  // Your Firebase setup file
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';  // Import autoTable plugin after jsPDF
import { Button } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

const Report = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, 'tuntikirjanpito'));
    const fetchedData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setData(fetchedData);
  };

  useEffect(() => {
    fetchData()
}, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    const uuid = uuidv4()
    // Add title to the PDF
    doc.text('Lasku', 100, 10);

    // Add headers
    const headers = [['Päivä', 'Tilaaja', 'Tunnit', 'Selite', 'Maksettu']];

    const values = data.map(payment => payment.hours)
    const sum = values.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    
    let rows = []
    
    // Add table to the PDF
    const billDetails = ['Päivämäärä',`${new Date().toLocaleDateString()}`,'','']

    const billNro = [`Laskun numero`,`${uuid}`,'','']
    
    const billContains = [`Sisältää: `,'Työtuntien ja ajokilometrien laskutusta','','']
    
    const emptyRow = []
    
    rows.push(['Yhteenveto:', `Tunteja ${new Date().toLocaleDateString()} mennessä ${sum} ja sovitut ajokilometrikustannukset 110 euroa`, ` ${sum * 15 + 110} euroa`, 'Toivottu maksutapa: Mobile Pay (045 2385 888) / tilille FI71 1470 3500 2922 74']);    
    rows.push(['Maksu projektin loppuessa / erissä, mikäli maksatte erissä niin ilmoittakaa maksettu päivä / päiväkohtainen summa.','',''])
    
    const tasks = data.map(entry => [
      entry.day,
      entry.client,
      entry.hours,
      entry.description,
      entry.isPaid ? 'Kyllä' : 'Ei'
    ]);

    rows.push(billDetails)
    rows.push(billNro)
    rows.push(billContains)
    rows.push(emptyRow)
    rows.push(tasks)

    doc.autoTable({
      head: headers,
      body: rows,
      startY: 20,
    });

    // Save the PDF
    doc.save('Aitaprojekti-Espoo.pdf');
  };

  return (
    <div style={{ padding: 20 }}>
      <div><h1>Lasku</h1></div>      
      <Button variant="contained" onClick={generatePDF}>
        Lataa PDF
      </Button>
    </div>
  );
}

export default Report