import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { db, storage } from '../../firebase'; // Make sure this path is correct
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore methods
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from 'react-router-dom';
import "../../css/huolot.css"

//https://firebasestorage.googleapis.com/v0/b/firma-ed35a.appspot.com/o/huoltoexcelit%2FRenault-Black.xls?alt=media&token=6d1381ef-ec22-4030-9abc-08ca23c2b6c7
const PreviewVehicles = ({ data, details, fileToUpload }) => {
  const [url, setUrls] = useState([]);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);

  const navigate = useNavigate()

  const pushToFirebase = async () => {
    if (!fileToUpload) {
      console.log("No file selected");
      return;
    }

    const storageRef = ref(storage, `huoltoexcelit/${fileToUpload.name}`);
    const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
        setProgress(progress);
        if (progress === 100) {
          setSuccess(true);
          navigate('/thanks')
        }
      },
      (error) => {
        console.error("Upload failed:", error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setUrls((prevUrls) => [...prevUrls, downloadURL]);
        console.log("File available at", downloadURL);
      }
    );
  };


  if (!data || data.length === 0) return null;

  const headers = Object.keys(data[0]); // Extract headers from the first row of data
  console.log(headers);

  return (
    <div className="huoltorekisteri-preview">
      <h4>{details.map((detail, index) => (
        <p key={index}>{detail}</p>
      ))}
      </h4>
      <table>
        <thead>
          <tr>
            {Object.keys(data[0]).map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.values(row).map((value, cellIndex) => (
                <>
                  <td key={cellIndex} style={{ width: cellIndex === 0 ? '30rem' : cellIndex === 3 ? '4rem' : 'auto' }}>{value}</td>
                </>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length > 0 && <Button variant="contained" color="secondary" onClick={(event) => pushToFirebase(event)}>File pilveen ({progress} % )</Button>}
    </div>

  );
};

PreviewVehicles.propTypes = {
  data: PropTypes.array.isRequired, // Ensures data is an array and required
  details: PropTypes.array.isRequired,
   // Ensures details is an array and required
  fileToUpload: PropTypes.array.isRequired // Ensures details is an array and required
};

export default PreviewVehicles;
