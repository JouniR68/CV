import JsonData from "../../data/datapkg.json";
//import remover from "../utils/common";
//import { Outlet, NavLink } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

export default function Work() {
  let i = 0;
  const issueData = JsonData.workhistory.map((j) => {
    return j;
  });

  return (
    <>
      <hr></hr>

      <TableContainer component={Paper}>

        <Table sx={{ minWidth: 650 }} aria-label="simple table" key={i++}>

          <TableHead>
            <TableRow>
              <TableCell align="left">Company</TableCell>
              <TableCell align="right">Duration</TableCell>
              <TableCell align="left">Role(s)</TableCell>
              <TableCell align="left">Location(s)</TableCell>
              <TableCell align="left">Info</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {issueData?.map((t) => (
              <TableRow key={i++} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>{t?.Company}</TableCell>
                <TableCell align="right" key={i++} className="cell">
                  {t?.Duration}
                </TableCell>
                <TableCell align="right" key={i++}>
                  {t?.Roles.map((r) => (
                    <TableRow key={i++}>{r}</TableRow>
                  ))}
                </TableCell>
                <TableCell align="right" key={i++}>
                  {t?.Locations.map((l) => (
                    <TableRow key={i++}>{l}</TableRow>
                  ))}
                </TableCell>
                <TableCell align = "rigth" key={i++}>
                  {t?.Info}
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>

      </TableContainer>
    </>
  );
}
