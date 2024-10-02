import { useTranslation } from "react-i18next";
import JsonData from "../../data/datapkg.json";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

import "../css/output.css"

export default function Education() {
  let i = 0;
  const issueData = JsonData.education.map((j) => {
    return j;
  });

  const {t} = useTranslation()

  return (
    <div>
      <TableContainer component={Paper}>
        <Table className="cv-table" aria-label="simple table" key={i++}>
          <TableHead>
            <TableRow>
              <TableCell align="left">{t('Education-course-header')}</TableCell>
              <TableCell align="left">{t('Education-schedule-header')}</TableCell>
              <TableCell align="left">{t('Education-topics-header')}</TableCell>
              <TableCell align="left">{t('Education-degree-header')}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {issueData?.map((t) => (
              <TableRow key={i++} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>

                <TableCell align="left" key={i++} className="cell">
                  {t?.Item}
                </TableCell>

                <TableCell align="left" key={i++} className="cell">
                  {t?.When}
                </TableCell>
                <TableCell align="left" key={i++} className="cell">
                  {t?.Topics}
                </TableCell>
                <TableCell align="left" key={i++} className="cell">
                  {t?.Degree}
                </TableCell>
              </TableRow>
            ))}

          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
