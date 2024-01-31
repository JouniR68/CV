import JsonData from "../../data/datapkg.json";
import remover from "../utils/common";

export default function Education() {
  let i = 0;
  const issueData = JsonData.education.map((j) => {
    return j;
  });

  return (
    <>
      <hr></hr>
      <table key={i++} className="work--table">
        <thead className="work--thead">
          <th>Course</th>
          <th>Schedule</th>
          <th>Topics</th>
          <th>Degree</th>
        </thead>
        {issueData?.map((t) => (
          <tr key={i++} className="row">
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
          </tr>
        ))}
      </table>
    </>
  );
}
