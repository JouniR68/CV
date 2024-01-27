import JsonData from "../../data/datapkg.json";
import remover from "../utils/common";

export default function Education() {
  let i = 0;
  const issueData = JsonData.hire.map((j) => {
    return j;
  });

  let rowCounter = 1;

  return (
    <table key={i++} className="taulu">
      {issueData?.map((t) => (
        <>
          <div className="hire--container">
            <div key={i++} className="row">
              <div key={i++} className="cell">
                {t?.["why"]}
              </div>
            </div>
          </div>

          <div className="hire--whys">
            <div key={i++} className="row">
              <div key={i++} className="cell">
                {rowCounter++}. {t?.["why 1"]}
              </div>
            </div>
            <p></p>
            <div key={i++} className="row">
              <div key={i++} className="cell">
                {rowCounter++}. {t?.["why 2"]}
              </div>
            </div>
            <p></p>
            <div key={i++} className="row">
              <div key={i++} className="cell">
                {rowCounter++}. {t?.["why 3"]}
              </div>
            </div>
            <p></p>
            <div key={i++} className="row">
              <div key={i++} className="cell">
                {rowCounter++}. {t?.["why 4"]}
              </div>
            </div>
            <p></p>
            <div key={i++} className="row">
              <div key={i++} className="cell">
                {rowCounter++}. {t?.["why 5"]}
              </div>
            </div>

            <div key={i++} className="row">
              <div key={i++} className="hire--motto">
                Motto: {t?.["motto"] + "\n\n"}
              </div>
            </div>
          </div>
        </>
      ))}
    </table>
  );
}
