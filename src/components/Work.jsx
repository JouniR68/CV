import JsonData from "../../data/datapkg.json";
import remover from "../utils/common"

export default function Work() {

  let i = 0;
  const issueData = JsonData.workhistory.map((j) => {
    return j;
  });

  

  return (
    <table key={i++} className="taulu">
      {issueData?.map((t) => (
        <div key={i++} className="row">
          <div key={i++} className="cell">
            {t?.Company}
          </div>
          <div key={i++} className="cell">
            {t?.Duration}
          </div>
          <div key={i++} className="cell">
            {t?.Roles.map(r => r
            )}
          </div>
          <div key={i++} className="cell">
            {t?.Locations.map(l => l)}
          </div>
          <div key={i++} className="cell">
            <button onClick={() => remover("work", t.id)}>x</button>
          </div>
        </div>
      ))}
    </table>
  );
}
