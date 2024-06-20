import JsonData from "../../data/datapkg.json";
import { Outlet } from "react-router-dom";
//import MyLocation from "./MyLocation";

export default function Education() {
  let i = 0;
  const profileData = JsonData.profile.map((j) => {
    return j;
  });

  return (
    <>
      <div>
        <hr></hr>
        <div className='profile--container'>
          {profileData.map((profile) => (
            <div key={i++} className='profile--card'>
              <img key={i++} src={profile.Photo} alt='Jouni Riimala' />
              <table className='profile--table'>
                <td className='row'>
                  Name: {profile.Name}
                </td>
                <td className='row'>Place of birth: {profile.BirthPlace}</td>
                <td className='row'>Current location: {profile.Location}</td>
                <td className='row'>Work: {profile.Profession}</td>
                <td className='row'>Familly: {profile.Familly}</td>
                <td className='row'>Mail: jriimala@gmail.com</td>
                <td className='row'>Tel: +358 2385 888</td>
              </table>
            </div>
          ))}
          
        </div>
  
      </div>

      <Outlet />
    </>
  );
}
