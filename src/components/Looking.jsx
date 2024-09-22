import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material';


export default function Looking() {

  const {t} = useTranslation();

  let i = 0;
  return (
      <div key={i++} className=''>        
        <TableContainer component={Paper}>
        <Table aria-label="simple table" key={i++}>
          <TableBody>
            <TableRow><TableCell className='row'>Sw Development Manager / Project Manager</TableCell></TableRow>
            <TableRow><TableCell className='row'>Sw Developer (web)</TableCell></TableRow>
            <TableRow><TableCell className='row'>System expert</TableCell></TableRow>
            <TableRow><TableCell className='row'>{t('OpenFor')}</TableCell></TableRow>            
          </TableBody>
        </Table>
        </TableContainer>  
  </div>
  );
}
