import JsonData from "../../data/datapkg.json";
import remover from "../utils/common"

export default function Tech() {

  let i = 0;
  const issueData = JsonData.tech.map((j) => {
    return j;
  });

  

  return (
    <table key={i++} className="taulu">
      {issueData?.map((t) => (
        <div key={i++} className="row">
          <div key={i++} className="cell">
            {t?.General}
          </div>          
          <div key={i++} className="cell">
            {t.Programming.map(p => p)}
          </div>
          <div key={i++} className="cell">
            {t?.Database.map(d => d
            )}
          </div>
          <div key={i++} className="cell">
            {t?.Tools.map(l => l)}
          </div>
          <div key={i++} className="cell">
            <button onClick={() => remover("work", t.id)}>x</button>
          </div>
        </div>
      ))}
    </table>
  );
}
