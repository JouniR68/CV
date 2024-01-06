import JsonData from "../../data/datapkg.json";
import remover from "../utils/common"

export default function Education() {
  let i = 0;
  const issueData = JsonData.education.map((j) => {
    return j;
  });

  

  return (
    <table key={i++} className="taulu">
      {issuesData?.map((t) => (
        <div key={i++} className="row">
          <div key={i++} className="cell">
            {t?.name}: {t?.kuvaus}
          </div>
          <div key={i++} className="cell">
            <button onClick={() => remover("work", t.id)}>x</button>
          </div>
        </div>
      ))}
    </table>
  );
}
