import JsonData from "../../data/datapkg.json";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Typography
} from "@mui/material";

export default function Services() {

  //<Button onClick={longer}>+ week</Button><Button onClick={quick}> Shorter period </Button>

  const navigate = useNavigate()
  let i = 0;
  const issueData = JsonData.services.map((j) => {
    return j;
  });

  let rowCounter = 1;


  const longer = () => {
    navigate('/contract')
  }


const getCustomerData = () => {
  navigate('/addCustomerData')
}

  return (
    <>
      <hr></hr>

      <div style={{textAlign:"left"}}>
        In case you are not looking for to fullfill permanent job, hire me for the temporary one. Below services and prizes alv 0% included (company rates).<br></br>Standard prizes added with 24% alv tax.
      </div>
      <table key={i++} className="taulu">
        {issueData?.map((t) => (
          <>
            <div className="hire--whys">
              <div key={i++} className="row">
                <div key={i++} className="cell">
                  {rowCounter++}. {t?.["serv1"]}
                </div>
              </div>

              <div key={i++} className="row">
                <div key={i++} className="cell">
                  {rowCounter++}. {t?.["serv2"]}
                </div>
              </div>

              <div key={i++} className="row">
                <div key={i++} className="cell">
                  {rowCounter++}. {t?.["serv3"]}
                </div>
              </div>

              <div key={i++} className="row">
                <div key={i++} className="cell">
                  {rowCounter++}. {t?.["serv4"]}
                </div>
              </div>

              <div key={i++} className="row">
                <div key={i++} className="cell">
                  {rowCounter++}. {t?.["serv5"]}
                </div>
              </div>

              +
              travelling one euros / km, remote work preferred.

            </div>
          </>
        ))}
      </table>

      <Button onClick={getCustomerData}>Interested</Button>

    </>

  )
}
