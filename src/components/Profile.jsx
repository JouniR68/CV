import JsonData from "../../data/datapkg.json";

export default function Education() {
  let i = 0;
  const profileData = JsonData.Profile.map((j) => {
    return j;
  });

  return (
    <div className="profile--container">
      {profileData.map((profile) => (
        <div key={i++} className="profile--card">          
          <img key={i++} src={profile.Photo} alt="Jouni Riimala" />
          <table className = "profile--table">
          <td className="row">{profile.Name}</td>
            <td className="row">{profile.BirthPlace}</td>
            <td className="row">{profile.Profession}</td>
            <td className="row">{profile.Familly}</td>
          </table>
        </div>
      ))}
    </div>
  );
}
