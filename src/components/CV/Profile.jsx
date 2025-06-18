import JsonData from "../../../data/datapkg.json";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import { generatePDF } from "./CVPdf"


import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button
} from '@mui/material';

export default function Profile({ hideButton }) {
  let i = 0;
  const profileData = JsonData.profile.map((j) => {
    return j;
  });

  const location = useLocation()
  const currentPath = location.currentPath
  const { t } = useTranslation();
  const navigate = useNavigate();

//<TableRow><TableCell className='row'>{t('ProfileBirth')}: {t('birthPlace')}</TableCell></TableRow>
//{!hideButton && <Button variant="contained" id="profile-button" onClick={() => navigate('/profile/output')} size="large">{t('cv')}</Button>}

  return (
    <>
      {profileData.map((profile) => (
        <div key={i++} className="profile">
          <Link to="kohde"><img style={{marginTop:'1rem'}} key={i++} src={profile.Photo} alt='Jouni Riimala' /></Link>

          {console.log("hideButton: ", hideButton)}
          <TableContainer component={Paper}>
            <Table aria-label="simple table" key={i++}>
              <TableBody>
                <TableRow><TableCell className='row'>{profile.Name}</TableCell></TableRow>
                <TableRow><TableCell className='row'>{t('ProfileLocation')}: {profile.Location}</TableCell></TableRow>
                <TableRow><TableCell className='row'>{t('ProfileProfession')}: {t('profession')}</TableCell></TableRow>
                <TableRow><TableCell className='row'>{t('ProfileMail')}: jriimala@gmail.com</TableCell></TableRow>
                <TableRow><TableCell className='row'>{t('ProfileTel')}: +358 2385 888</TableCell></TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <div className="profilerNapit">
            <Button style={{marginLeft:'1rem'}}variant="contained" onClick={generatePDF}>{t('LoadCV')}</Button>
          </div>
        </div>
      ))}







      <Outlet />

    </>
  );
}
