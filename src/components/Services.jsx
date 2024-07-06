import JsonData from "../../data/datapkg.json";
import { nanoid } from 'nanoid'
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button
} from "@mui/material";
export default function Services() {

  const navigate = useNavigate()

  let i = 0;
  const issueData = JsonData.services.map((j) => {
    return j;
  });

  const getCustomerData = () => {
    navigate('/addCustomerData')
  }

  return (
    <>
      <hr></hr>

      <div className="output--text">
        In case you are not looking for to fullfill permanent job, hire me for the temporary one.<br></br>
        Below services and prizes alv 0% included (company rates).<br></br>Standard prizes added with alv tax.
      </div>
      <p></p>
      <TableContainer component={Paper}>



        <Table sx={{ minWidth: 650 }} aria-label="simple table" key={i++}>

          <TableHead>
            <TableRow>
              <TableCell align="left">Service</TableCell>
              <TableCell align="left">Company Prize</TableCell>
              <TableCell align="left">Individual Prize</TableCell>
            </TableRow>
          </TableHead>


          {issueData?.map((t) => (
            <TableBody key={nanoid()}>
              <TableRow>
                <TableCell align="left">{t?.["serv1"]}</TableCell>
                <TableCell>{t?.["serv1-prize"]}</TableCell>
                <TableCell>Custom</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">{t?.["serv2"]}</TableCell>
                <TableCell>{t?.["serv2-prize"]}</TableCell>
                <TableCell>Custom</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">{t?.["serv3"]}</TableCell>
                <TableCell>{t?.["serv3-prize"]}</TableCell>
                <TableCell>Custom</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">{t?.["serv4"]}</TableCell>
                <TableCell>{t?.["serv4-prize"]}</TableCell>
                <TableCell>Custom</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">{t?.["serv5"]}</TableCell>
                <TableCell>{t?.["serv3-prize"]}</TableCell>
                <TableCell>Custom</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">{t?.["serv6"]}</TableCell>
                <TableCell>{t?.["serv6-prize"]}</TableCell>
                <TableCell>Custom</TableCell>
              </TableRow>

              <TableRow>
                <TableCell align="left">travelling one euros / km, remote work preferred.</TableCell>
              </TableRow>
            </TableBody>
          ))}

        </Table>
      </TableContainer>

      <Button onClick={getCustomerData}>Work offer / message ?</Button>
    </>
  )
}
