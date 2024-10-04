import { useTranslation } from "react-i18next";
import JsonData from "../../data/datapkg.json";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
//import remover from "../utils/common";

export default function Tech() {
  let i = 0;
  const issueData = JsonData.tech.map((j) => {
    return j;
  });

  const { t } = useTranslation()
  let counter = 0;

  return (
    <div>
      <TableContainer component={Paper} sx={{ overflowX: { xs: 'auto', md: 'visible' }}}>
        <Table className="cv-table" stickyHeader aria-label="technology table">
          <TableHead>
            <TableRow>
              <TableCell sx={{fontWeight:900, backgroundColor:'red'}} align="left">{t('Techs-header')}</TableCell>
              <TableCell sx={{fontWeight:900, backgroundColor:'red'}}align="left"></TableCell>
              <TableCell sx={{fontWeight:900, backgroundColor:'red'}}align="left"></TableCell>
              <TableCell sx={{fontWeight:900, backgroundColor:'red'}} align="left">{t('Method')}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {issueData?.map((item) => (
              <TableRow key={counter++} sx={{
                display: { xs: 'block', md: 'table-row' },
                borderBottom: { xs: '1px solid #ddd', md: 'none' },
                padding: { xs: '1rem', md: 0 },
              }}>
                {/* Programming */}
                <TableCell align="left" sx={{ display: { xs: 'block', md: 'table-cell' } }}>
                  <Typography variant="subtitle2" sx={{ display: { xs: 'block', md: 'none' } }}>
                    {t('Techs-header')}
                  </Typography>
                  {item.Programming?.map((tech) => (
                    <Typography sx={{fontWeight:800}} key={counter++}>{tech}</Typography>
                  ))}
                </TableCell>

                {/* Database */}
                <TableCell align="left" sx={{ display: { xs: 'block', md: 'table-cell' } }}>
                  <Typography variant="subtitle2" sx={{ display: { xs: 'block', md: 'none' } }}>
                    {t('Database-header')}
                  </Typography>
                  {item.Database?.map((db) => (
                    <Typography sx={{fontWeight:800}} key={counter++}>{db}</Typography>
                  ))}
                </TableCell>

                {/* Tools */}
                <TableCell align="left" sx={{ display: { xs: 'block', md: 'table-cell' } }}>
                  <Typography variant="subtitle2" sx={{ display: { xs: 'block', md: 'none' } }}>
                    {t('Tools-header')}
                  </Typography>
                  {item.Tools?.map((tool) => (
                    <Typography sx={{fontWeight:800}} key={counter++}>{tool}</Typography>
                  ))}
                </TableCell>

                {/* Method */}
                <TableCell align="left" sx={{ display: { xs: 'block', md: 'table-cell' } }}>
                  <Typography variant="subtitle2" sx={{ display: { xs: 'block', md: 'none' } }}>
                    {t('Method')}
                  </Typography>
                  <Typography>{item.Methods.map((method) => (
                      <Typography sx={{fontWeight:800}} key={counter++}>{method}</Typography>
                  ))}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>);
}
