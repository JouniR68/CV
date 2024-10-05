import { useTranslation } from "react-i18next";
import JsonData from "../../data/datapkg.json";

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

export default function Education() {
  let i = 0;
  const issueData = JsonData.education.map((j) => {
    return j;
  });

  const {t} = useTranslation()
  let counter = 0;

  return (
    <div>
    <TableContainer component={Paper} sx={{ overflowX: { xs: 'auto', md: 'visible' } }}>
        <Table className="cv-table" aria-label="education table">
            <TableHead>
              <TableRow><TableCell sx={{fontWeight:900, backgroundColor:'gray'}}>{t('Output-education')}</TableCell></TableRow>
                <TableRow>
                    <TableCell align="left">{t('Education-course-header')}</TableCell>
                    <TableCell align="left">{t('Education-schedule-header')}</TableCell>
                    <TableCell align="left">{t('Education-topics-header')}</TableCell>
                    <TableCell align="left">{t('Education-degree-header')}</TableCell>
                </TableRow>
            </TableHead>

            <TableBody>
                {issueData?.map((item) => (
                    <TableRow key={counter++} sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        display: { xs: 'block', md: 'table-row' },  // Card style on mobile
                        borderBottom: { xs: '1px solid #ddd', md: 'none' },
                        marginBottom: { xs: '1rem', md: 0 },
                        padding: { xs: '1rem', md: 0 },
                    }}>
                        <TableCell align="left" className="cell" sx={{ display: { xs: 'block', md: 'table-cell' } }}>
                            <Typography variant="subtitle2" sx={{ display: { xs: 'block', md: 'none' } }}>
                                {t('Education-course-header')}
                            </Typography>
                            {item?.Item}
                        </TableCell>

                        <TableCell align="left" className="cell" sx={{ display: { xs: 'block', md: 'table-cell' } }}>
                            <Typography variant="subtitle2" sx={{ display: { xs: 'block', md: 'none' } }}>
                                {t('Education-schedule-header')}
                            </Typography>
                            {item?.When}
                        </TableCell>

                        <TableCell align="left" className="cell" sx={{ display: { xs: 'block', md: 'table-cell' } }}>
                            <Typography variant="subtitle2" sx={{ display: { xs: 'block', md: 'none' } }}>
                                {t('Education-topics-header')}
                            </Typography>
                            {item?.Topics}
                        </TableCell>

                        <TableCell align="left" className="cell" sx={{ display: { xs: 'block', md: 'table-cell' } }}>
                            <Typography variant="subtitle2" sx={{ display: { xs: 'block', md: 'none' } }}>
                                {t('Education-degree-header')}
                            </Typography>
                            {item?.Degree}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
</div>
  );
}
