import JsonData from "../../data/datapkg.json";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button
} from '@mui/material';

export default function Profile({hideButton}) {
  let i = 0;
  const profileData = JsonData.profile.map((j) => {
    return j;
  });

  const location = useLocation()
  const currentPath = location.currentPath
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>

      <div>
        {profileData.map((profile) => (
            <div key={i++} className="profile">
              <Link to="kohde"><img key={i++} src={profile.Photo} alt='Jouni Riimala' /></Link>
              {!hideButton && <Button className ="profile-button" onClick = {() => navigate('/profile/output')}>{t('cv')}</Button>}
              {console.log("hideButton: ", hideButton)}
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
