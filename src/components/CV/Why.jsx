import { useTranslation } from "react-i18next";
import JsonData from "../../../data/datapkg.json";

export default function Education() {
  let i = 0;
  const issueData = JsonData.hire.map((j) => {
    return j; 
  });

  let rowCounter = 1;


  const {t} = useTranslation()

  return (
<>
    <hr></hr>    

    <table key={i++} className="taulu">
      
        <>
          <div className="hire--whys">

            <div key={i++} className="row">
              <div key={i++} className="cell">
                {rowCounter++}. {t('why1')}
              </div>
            </div>
            
            <div key={i++} className="row">
              <div key={i++} className="cell">
                {rowCounter++}. {t('why2')}
              </div>
            </div>
            
            <div key={i++} className="row">
              <div key={i++} className="cell">
                {rowCounter++}. {t('why3')}
              </div>
            </div>
            
            <div key={i++} className="row">
              <div key={i++} className="cell">
                {rowCounter++}. {t('why4')}
              </div>
            </div>
            
            <div key={i++} className="row">
              <div key={i++} className="cell">
                {rowCounter++}. {t('why5')}
              </div>
            </div>
          </div>
        </>
    </table>
    </>
  );
}
