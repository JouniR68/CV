import JsonData from "../../data/datapkg.json";
import { Outlet } from "react-router-dom";

export default function Education() {

  const data = JsonData.intrests.map((j) => {
    return j;
  });

  console.log("intrests array:", data);


  const formattedText = data.map(d => {
    return d.text.replace(".", "." + "\n\n")
  })

  return (
    <div>
      <hr></hr>
      <div className="output--text">
        {formattedText}
      </div>
      <div className="photo-grid">
        <img src="/Images/Scout.jpg" />
        <img src="/Images/Ktm.jpg" />
      </div>
      <Outlet />
    </div>
  );
}
