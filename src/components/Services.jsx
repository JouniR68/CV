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
import { NavigateNextOutlined } from "@mui/icons-material";


export default function Services() {

  const navigate = useNavigate()
  let i = 0;
  const issueData = JsonData.services.map((j) => {
    return j;
  });

  let rowCounter = 1;

  const getCustomerData = () => {
    navigate('/addCustomerData')
  }

  return (
    <>
      <hr></hr>

      <div style={{ textAlign: "left" }}>
        In case you are not looking for to fullfill permanent job, hire me for the temporary one. Below services and prizes alv 0% included (company rates).<br></br>Standard prizes added with 24% alv tax.
      </div>

      <TableContainer component={Paper}>

        <Table sx={{ minWidth: 650 }} aria-label="simple table" key={i++}>

          {issueData?.map((t) => (
            <TableBody key={nanoid()}>
              <TableRow>
                <TableCell align="left">{rowCounter++}. {t?.["serv1"]}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">{rowCounter++}. {t?.["serv2"]}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">{rowCounter++}. {t?.["serv3"]}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">{rowCounter++}. {t?.["serv4"]}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">{rowCounter++}. {t?.["serv5"]}</TableCell>
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
