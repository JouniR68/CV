import { useTranslation } from "react-i18next";
import JsonData from "../../data/datapkg.json";
//import remover from "../utils/common";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

export default function Tech() {
  let i = 0;
  const issueData = JsonData.tech.map((j) => {
    return j;
  });

  const {t} = useTranslation()

  return (
    <>      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table" key={i++}>
          <TableHead>
            <TableRow>
              <TableCell align="left">{t('Techs-header')}</TableCell>
              <TableCell align="left"></TableCell>
              <TableCell align="left"></TableCell>
              <TableCell align="left">{t('Method')}</TableCell>
              
            </TableRow>
          </TableHead>

          <TableBody>
            {issueData?.map((d) => d.General)}


            {issueData?.map((t) => (
              <TableRow key={i++} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell align="left" key={i++} className="row">
                  {t.Programming.map((p) => (
                    <TableRow key={i++}>{p}</TableRow>
                  ))}
                </TableCell>
                <TableCell key={i++} className='cell'>
                  {t?.Database.map((d) => (
                    <TableRow key={i++}>{d}</TableRow>
                  ))}
                </TableCell>
                <TableCell key={i++} className='cell'>
                  {t?.Tools.map((l) => (
                    <TableRow key={i++}>{l}</TableRow>
                  ))}
                </TableCell>
                <TableCell key={i++} className='cell'>
                  {t?.ProjectMethods.map((m) => (
                    <TableRow key={i++}>{m}</TableRow>
                  ))}
                </TableCell>



              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
