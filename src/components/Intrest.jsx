import JsonData from "../../data/datapkg.json";
import { Outlet } from "react-router-dom";

export default function Education() {
  let i = 0;
  const data = JsonData.intrests.map((j) => {
    return j;
  });

  console.log("intrests array:", data);
  return (
    <div>
      <div className="profile--container">
        {data.map((int) => (
          <div key={i++} className="profile--card">
            <img key={i++} src={int.photo} alt="Moto" />
            <table className="profile--table">
              <td className="row">{int.int1}</td>
              <td className="row">{int.int2}</td>
              <td className="row">{int.int3}</td>
              <td className="row">{int.int4}</td>
            </table>
          </div>
        ))}
      </div>
      <Outlet />
    </div>
  );
}
