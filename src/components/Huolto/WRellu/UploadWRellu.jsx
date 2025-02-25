import React, { useState } from "react";
import * as XLSX from "xlsx";
import { db } from "../../../firebase"; // Adjust the path to your Firebase config
import { collection, addDoc } from "firebase/firestore";
import { Button, TextField } from "@mui/material";

const FileUploader = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first");

    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = async (e) => {
      const binaryStr = e.target.result;
      let workbook;
      try {
        // Read the file using XLSX to handle both .xlsx and .ods formats
        workbook = XLSX.read(binaryStr, { type: "binary", cellDates: true });
      } catch (error) {
        return alert("Error reading file: " + error.message);
      }

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);

      if (data.length === 0) return alert("No data found in file");

      try {
        const wRelluCollection = collection(db, "wRellu");
        for (const row of data) {
          let formattedRow = {};

          // Process the row to convert date values correctly
          for (let key in row) {
            let value = row[key];

            // If the value is a date (number), handle it as a date
            if (value instanceof Date && !isNaN(value)) {
              // Handle date conversion for both Excel and ODS formats
              formattedRow[key] = value.toLocaleDateString("fi-FI");
            } else if (value instanceof Date && isNaN(value)) {
              // If the date is invalid, set it as '?'
              formattedRow[key] = "?";
            } else {
              // Keep other values as they are
              formattedRow[key] = value;
            }
          }

          // If there's no valid value in the row, set 'päivä' to '?'
          if (Object.values(formattedRow).every(value => value === "" || value === null)) {
            formattedRow.päivä = "?";
          }

          // Check if any key in the row is empty (null, undefined, or empty string) and skip the row if true
          const isEmpty = Object.values(formattedRow).some(value => value === null || value === undefined || value === "");
          if (isEmpty) {
            console.log("Skipping row with empty values:", formattedRow);
            continue; // Skip this row
          }

          await addDoc(wRelluCollection, formattedRow);
        }
        alert("File uploaded successfully");
      } catch (error) {
        console.error("Error uploading file: ", error);
        alert("Error uploading file");
      }
    };
  };

  return (
    <div style={{ padding: 20 }}>
      <TextField
        type="file"
        accept=".xls,.xlsx,.ods" // Allow .ods files
        onChange={handleFileChange}
        label="Select File"
        variant="outlined"
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        inputProps={{ accept: ".xls,.xlsx,.ods" }} // Updated accept for .ods
      />
      <Button
        onClick={handleUpload}
        variant="contained"
        color="primary"
        fullWidth
        style={{ marginTop: 20 }}
      >
        Upload
      </Button>
    </div>
  );
};

export default FileUploader;
