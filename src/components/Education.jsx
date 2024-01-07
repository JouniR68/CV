import JsonData from "../../data/datapkg.json";
import remover from "../utils/common"

export default function Education() {

  let i = 0;
  const issueData = JsonData.education.map((j) => {
    return j;
  });

  

  return (
    <table key={i++} className="taulu">
      {issueData?.map((t) => (
        <div key={i++} className="row">
          <div key={i++} className="cell">
            {t?.Item}
          </div>
          <div key={i++} className="cell">
            {t?.When}
          </div>
          <div key={i++} className="cell">
            {t?.Topics}
          </div>
          <div key={i++} className="cell">
            {t?.Degree}
          </div>
          <div key={i++} className="cell">
            <button onClick={() => remover("work", t.id)}>x</button>
          </div>
        </div>
      ))}
    </table>
  );
}
