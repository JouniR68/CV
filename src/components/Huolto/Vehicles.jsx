import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { db, storage } from '../../firebase';
import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';
import PreviewVehicles from './PreviewVehicles';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


function Vehicle() {
  const [data, setData] = useState([]);
  const [details, setDetails] = useState([]);
  const [url, setUrls] = useState([]);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileToUpload, setFileToUpload] = useState(null)  


  // Function to handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      setFileToUpload(file);
    }
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Extract vehicle details
      const details = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        range: 'A1:A4', // Define the range for vehicle details
      });

      // Extract headers and body
      const headers = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        range: 'A6:E6',  // Headers are on row 6
      })[0];

      let body = XLSX.utils.sheet_to_json(worksheet, {
        header: headers, // Explicitly assign headers        
        range: 'A7:E50', // Data range starts after header row
        defval: "", // Default value for missing cells
      });

      // Function to convert Excel date serial number to JavaScript Date
      const convertExcelDate = (excelSerial) => {
        const excelEpoch = new Date(Date.UTC(1900, 0, 1)); // Excel epoch date: January 1, 1900
        return new Date(excelEpoch.getTime() + (excelSerial - 1) * 86400 * 1000); // Subtract 1 and convert days to ms
      };

      // Convert numeric date values in column B
      body = body.map((row) => {
        if (typeof row['PÄIVÄ'] === 'number') {
          row['PÄIVÄ'] = convertExcelDate(row['PÄIVÄ']).toLocaleDateString();
        }
        return row;
      });

      console.log("Processed body with formatted dates:", body);
      setData(body);
      setDetails(details);
    };

    reader.readAsArrayBuffer(file);
  };

  console.log("data:", data)


  //<Button variant="contained" color="secondary" onClick={handlePushToFirebase}>
  return (
    <div>
      <input
        accept=".xlsx, .xls"
        id="upload-excel"
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
      <label htmlFor="upload-excel">
        <Button variant="contained" component="span" color="primary">
          Lataa excel file (renault-black for now..)
        </Button>
        <pre>          
        </pre>
        <Typography variant="contained">Tällä hetkellä pitää käyttää JR:n formaattiin perustuvaa fileä.<br></br>
          Scrollaa hiirellä jos Talleta nappi ei näy..</Typography>
      </label>

      <div>
        {data.length > 0 && <PreviewVehicles data={data} details={details} fileToUpload = {fileToUpload} />}
      </div>      
    </div>


  );
}

export default Vehicle;
