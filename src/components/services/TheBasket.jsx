import { useLocation } from "react-router-dom";
import Button from '@mui/material/Button';

const TheBasket = () => {
    const location = useLocation();

    const { state } = location
    let { data } = state;
    const { title, description, kpl, priceh } = data

    console.log("TheBasket ", title)

    let totalPrice = kpl * priceh
    let withoutTax = totalPrice * 25.5 / 100
    let taxed = totalPrice - withoutTax;

    const removeFromTheBasket = () => {

        data = null;
        console.log(data)
    }

    return (
        <>
            <h1>Tilauskorisi</h1>
            <h4>Maksu työn valmistuttua, laskulla</h4>


            <table className="">
                <tr><th>Tuote</th><th>Määrä</th><th>Summa</th><th>Veroton</th><th>Vero 25.5%</th><th>Yhteensä</th><th>Poista</th></tr>
                <td>{data.title}</td><td>{kpl}</td><td>{totalPrice}</td>
                <td>{taxed}</td><td>{withoutTax}</td><td>{taxed + withoutTax}</td>
                <td><Button onClick={() => removeFromTheBasket()}>X</Button></td><td></td><td></td>
            </table>
            <Button variant="contained">Vahvista</Button>


        </>
    );

}

export default TheBasket;