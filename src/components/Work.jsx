import { useTranslation } from "react-i18next";
import JsonData from "../../data/datapkg.json";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
export default function Work() {
  let i = 0;
  const issueData = JsonData.workhistory.map((j) => {
    return j;
  });

  const { t } = useTranslation()
  let counter = 0;

  return (
    <div>
      <TableContainer component={Paper} sx={{ overflowX: { xs: 'auto', md: 'visible' } }}>
        <Table className="cv-table" stickyHeader aria-label="work experience table">
          <TableHead>
          <TableRow><TableCell sx={{fontWeight:900, backgroundColor:'gray'}}>{t('Output-work')}</TableCell></TableRow>
            <TableRow>
              <TableCell align="left">{t('Work-company-header')}</TableCell>
              <TableCell align="left">{t('Work-schedule-header')}</TableCell>
              <TableCell align="left">{t('Work-role-header')}</TableCell>
              <TableCell align="left">{t('Work-location-header')}</TableCell>
              <TableCell align="left">{t('Work-info-header')}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {issueData?.map((entry) => (
              <TableRow key={counter++} sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                display: { xs: 'block', md: 'table-row' },
                borderBottom: { xs: '1px solid #ddd', md: 'none' },
                marginBottom: { xs: '1rem', md: 0 },
                padding: { xs: '1rem', md: 0 },
              }}>
                {/* Company */}
                <TableCell align="left" sx={{ display: { xs: 'block', md: 'table-cell' } }}>
                  <Typography variant="subtitle2" sx={{ display: { xs: 'block', md: 'none' } }}>
                    {t('Work-company-header')}
                  </Typography>
                  {entry?.Company}
                </TableCell>

                {/* Schedule */}
                <TableCell align="left" sx={{ display: { xs: 'block', md: 'table-cell' } }}>
                  <Typography variant="subtitle2" sx={{ display: { xs: 'block', md: 'none' } }}>
                    {t('Work-schedule-header')}
                  </Typography>
                  {entry?.Duration}
                </TableCell>

                {/* Roles */}
                <TableCell align="left" sx={{ display: { xs: 'block', md: 'table-cell' } }}>
                  <Typography variant="subtitle2" sx={{ display: { xs: 'block', md: 'none' } }}>
                    {t('Work-role-header')}
                  </Typography>
                  {entry?.Roles.map((role) => (
                    <Typography key={counter++}>{role}</Typography>
                  ))}
                </TableCell>

                {/* Locations */}
                <TableCell align="left" sx={{ display: { xs: 'block', md: 'table-cell' } }}>
                  <Typography variant="subtitle2" sx={{ display: { xs: 'block', md: 'none' } }}>
                    {t('Work-location-header')}
                  </Typography>
                  {entry?.Locations.map((location) => (
                    <Typography key={counter++}>{location}</Typography>
                  ))}
                </TableCell>

                {/* Info */}
                <TableCell align="left" sx={{ display: { xs: 'block', md: 'table-cell' } }}>
                  <Typography variant="subtitle2" sx={{ display: { xs: 'block', md: 'none' } }}>
                    {t('Work-info-header')}
                  </Typography>
                  {entry?.Info}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
