import JsonData from "../../data/datapkg.json";
import { Outlet } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material';

export default function Education() {
  let i = 0;
  const profileData = JsonData.profile.map((j) => {
    return j;
  });

  const { t } = useTranslation();
  
  return (
    <>
      
      <div>
        {profileData.map((profile) => (
          <div key={i++} className='profile--table'>
            <div className = ".photo-grid">
            <Link to = "kohde"><img key={i++}  src={profile.Photo} alt='Jouni Riimala' /></Link>
            </div>
            <TableContainer component={Paper}>
            <Table aria-label="simple table" key={i++}>
              <TableBody>
                <TableRow><TableCell className='row'>{profile.Name}</TableCell></TableRow>
                <TableRow><TableCell className='row'>{t('ProfileBirth')}: {t('birthPlace')}</TableCell></TableRow>
                <TableRow><TableCell className='row'>{t('ProfileLocation')}: {profile.Location}</TableCell></TableRow>
                <TableRow><TableCell className='row'>{t('ProfileProfession')}: {t('profession')}</TableCell></TableRow>
                <TableRow><TableCell className='row'>{t('ProfileMail')}: jr@softa-apu.fi</TableCell></TableRow>
                <TableRow><TableCell className='row'>{t('ProfileTel')}: +358 2385 888</TableCell></TableRow>
              </TableBody>
            </Table>
            </TableContainer>
          </div>
        ))}

      </div>



      <Outlet />
    </>
  );
}
