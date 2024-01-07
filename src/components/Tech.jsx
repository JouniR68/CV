import JsonData from "../../data/datapkg.json";
import remover from "../utils/common";

export default function Tech() {
  let i = 0;
  const issueData = JsonData.tech.map((j) => {
    return j;
  });

  /*
              <div key={i++} className="cell">
              <button onClick={() => remover("work", t.id)}>x</button>
            </div>

  */
  return (
    <div>
      <hr></hr>
  
      <div className="work--general">{issueData?.map((d) => d.General)}</div>

      <table key={i++} className="work--table">
        <thead className="work--thead">
          <th>Programming</th>
          <th>Database</th>
          <th>Tools</th>
        </thead>

        {issueData?.map((t) => (
          <div key={i++} className="row">
            <div key={i++}>
              {t.Programming.map((p) => (
                <tr key={i++}>{p}</tr>
              ))}
            </div>
            <div key={i++} className="cell">
              {t?.Database.map((d) => (
                <tr key={i++}>{d}</tr>
              ))}
            </div>
            <div key={i++} className="cell">
              {t?.Tools.map((l) => (
                <tr key={i++}>{l}</tr>
              ))}
            </div>
          </div>
        ))}
      </table>
    </div>
  );
}
