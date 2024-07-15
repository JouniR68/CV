import JsonData from "../../data/datapkg.json";
import { Outlet } from "react-router-dom";
import { useTranslation } from 'react-i18next';

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
            <img key={i++} src={profile.Photo} style={{ width: '100px', borderRadius: '5px', marginTop: '1rem', marginBottom: '1rem' }} alt='Jouni Riimala' />
            <table className="profile--card">
              <tbody>
                <td className='row'>
                  Name: {profile.Name}
                </td>
                <td className='row'>{t('ProfileBirth')}: {profile.BirthPlace}</td>
                <td className='row'>{t('ProfileLocation')}: {profile.Location}</td>
                <td className='row'>{t('ProfileProfession')}: {profile.Profession}</td>
                <td className='row'>{t('ProfileFamilly')}: {profile.Familly}</td>
                <td className='row'>{t('ProfileMail')}: jriimala@gmail.com</td>
                <td className='row'>{t('ProfileTel')}: +358 2385 888</td>
              </tbody>
            </table>
          </div>
        ))}

      </div>



      <Outlet />
    </>
  );
}
