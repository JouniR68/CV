import JsonData from "../../data/datapkg.json";
import { Outlet } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
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

      <hr></hr>
      <div>
        {profileData.map((profile) => (
          <div key={i++} className='profile--table'>
            <img key={i++} src={profile.Photo} style={{ width: '20rem', borderRadius: '5px', marginTop: '1rem', marginBottom: '1rem' }} alt='Jouni Riimala' />
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table" key={i++}>
              <TableBody>
                <TableRow><TableCell className='row'>Name: {profile.Name}</TableCell></TableRow>
                <TableRow><TableCell className='row'>{t('ProfileBirth')}: {profile.BirthPlace}</TableCell></TableRow>
                <TableRow><TableCell className='row'>{t('ProfileLocation')}: {profile.Location}</TableCell></TableRow>
                <TableRow><TableCell className='row'>{t('ProfileProfession')}: {profile.Profession}</TableCell></TableRow>
                <TableRow><TableCell className='row'>{t('ProfileFamilly')}: {profile.Familly}</TableCell></TableRow>
                <TableRow><TableCell className='row'>{t('ProfileMail')}: jriimala@gmail.com</TableCell></TableRow>
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
