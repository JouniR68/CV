import JsonData from "../../data/datapkg.json";
import { nanoid } from 'nanoid'
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button
} from "@mui/material";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
export default function Services() {

  const navigate = useNavigate()
  const { t } = useTranslation();

  let i = 0;

  const getCustomerData = () => {
    navigate('/addCustomerData')
  }


  return (
    <>
      <hr></hr>

      <div className="output--text">
        {t('Services-main')}<br></br>.
      </div>
      <p></p>
      <TableContainer component={Paper}>



        <Table sx={{ minWidth: 650 }} aria-label="simple table" key={i++}>

          <TableHead>
            <TableRow>
              <TableCell align="left">{t('Services-main')}</TableCell>
              <TableCell align="left">{t('Service-company-header')}</TableCell>
              <TableCell align="left">{t('Service-individual-header')}</TableCell>
            </TableRow>
          </TableHead>



          <TableBody key={nanoid()}>
            <TableRow>
              <TableCell align="left">{t('Services-coding')}</TableCell>
              <TableCell>60 euro/h</TableCell>
              <TableCell>{t('Service-Custom')}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">{t('Services-testing')}</TableCell>
              <TableCell>50 euro/h</TableCell>
              <TableCell>{t('Service-Custom')}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">{t('Services-admin')}</TableCell>
              <TableCell>50 euro/h</TableCell>
              <TableCell>{t('Service-Custom')}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">{t('Services-pm')}</TableCell>
              <TableCell>60 euro/h</TableCell>
              <TableCell>{t('Service-Custom')}</TableCell>
            </TableRow>

          </TableBody>


        </Table>
      </TableContainer>
  <p></p>
      <Button onClick={getCustomerData}>{t('Service-forward')}</Button>


    </>
  )
}
