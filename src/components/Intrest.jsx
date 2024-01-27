import JsonData from "../../data/datapkg.json";
import { Outlet } from "react-router-dom";

export default function Education() {
  let i = 0;
  const data = JsonData.intrests.map((j) => {
    return j;
  });

  console.log("intrests array:", data);


const formattedText = data.map(d => {
 return d.text.replace(".", "."+"\n\n")
})

  return (
    <div>
      <div className="profile--container">
          <>
            <table className="profile--intrest">
              <td className="row">{formattedText}</td>
            </table>
          </>
      </div>
      <Outlet />
    </div>
  );
}
