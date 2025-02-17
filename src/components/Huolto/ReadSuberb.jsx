import React, { useEffect, useState } from "react";
import { db } from "../../firebase"; // Adjust the path to your Firebase config
import { collection, getDocs } from "firebase/firestore";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const DataTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const superbCollection = collection(db, "suberb");
        const snapshot = await getDocs(superbCollection);
        const fetchedData = snapshot.docs.map(doc => {
          const rowData = doc.data();
          // Format date if it's stored as a numeric timestamp
          if (rowData.päivä && !isNaN(rowData.päivä)) {
            rowData.päivä = new Date(rowData.päivä).toLocaleDateString("fi-FI");
          }
          return rowData;
        });
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 700, overflowY: 'auto' }}>
      <Table >
        <TableHead>
          <TableRow>
            <TableCell sx = {{backgroundColor:'gray', fontWeight:'bold'}}>Selitys</TableCell>
            <TableCell sx = {{backgroundColor:'gray', fontWeight:'bold'}}>Päivä</TableCell>
            <TableCell sx = {{backgroundColor:'gray', fontWeight:'bold'}}>Km</TableCell>
            <TableCell sx = {{backgroundColor:'gray', fontWeight:'bold'}}>€</TableCell>
            <TableCell sx = {{backgroundColor:'gray', fontWeight:'bold'}}>Ostopaikka</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.selitys}</TableCell>
              <TableCell>{row.päivä}</TableCell>
              <TableCell>{row.km}</TableCell>
              <TableCell>{row["€"]}</TableCell>
              <TableCell>{row.ostopaikka}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
