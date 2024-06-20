import JsonData from "../../data/datapkg.json";
import remover from "../utils/common";

export default function Education() {
  let i = 0;
  const issueData = JsonData.hire.map((j) => {
    return j; 
  });

  let rowCounter = 1;

  return (
<>
    <hr></hr>    

    <table key={i++} className="taulu">
      {issueData?.map((t) => (
        <>
          <div className="hire--whys">
          <div key={i++} className="row">
              <div key={i++} className="cell">
                {rowCounter++}. {t?.["why"]}
              </div>
            </div>

            <div key={i++} className="row">
              <div key={i++} className="cell">
                {rowCounter++}. {t?.["why 1"]}
              </div>
            </div>
            
            <div key={i++} className="row">
              <div key={i++} className="cell">
                {rowCounter++}. {t?.["why 2"]}
              </div>
            </div>
            
            <div key={i++} className="row">
              <div key={i++} className="cell">
                {rowCounter++}. {t?.["why 3"]}
              </div>
            </div>
            
            <div key={i++} className="row">
              <div key={i++} className="cell">
                {rowCounter++}. {t?.["why 4"]}
              </div>
            </div>
            
            <div key={i++} className="row">
              <div key={i++} className="cell">
                {rowCounter++}. {t?.["why 5"]}
              </div>
            </div>
          </div>
        </>
      ))}
    </table>
    </>
  );
}
