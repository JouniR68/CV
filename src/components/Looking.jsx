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
    <div key={i++} className="responsive-table-container">
    <TableContainer component={Paper} sx={{ padding: { xs: 1, md: 2 } }}>
      <Table aria-label="simple table" key={i++}>
        <TableBody>
          <TableRow>
            <TableCell
              className="row"
              sx={{
                fontSize: { xs: '1rem', md: '1.2rem' },
                fontWeight: 600,
                padding: { xs: '0.5rem', md: '1rem' },
              }}
            >
              Sw Development Manager / Project Manager
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              className="row"
              sx={{
                fontSize: { xs: '1rem', md: '1.2rem' },
                fontWeight: 600,
                padding: { xs: '0.5rem', md: '1rem' },
                maxWidth: '200px',                
              }}
            >
              Sw Developer (web)
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              className="row"
              sx={{
                fontSize: { xs: '1rem', md: '1.2rem' },
                fontWeight: 600,
                padding: { xs: '0.5rem', md: '1rem' },
              }}
            >
              System expert
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              className="row"
              sx={{
                fontSize: { xs: '1rem', md: '1.2rem' },
                fontWeight: 600,
                padding: { xs: '0.5rem', md: '1rem' },
              }}
            >
              {t('OpenFor')}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </div>
  );
}
