import { useLocation } from "react-router-dom";
import Button from '@mui/material/Button';

const TheBasket = () => {
    const location = useLocation();

    const { state } = location
    const { data } = state;
    const { title, description, kpl, priceh } = data

    console.log("TheBasket ", title)

    let totalPrice = kpl * priceh
    let withoutTax = totalPrice * 25.5 / 100
    let taxed = totalPrice - withoutTax;

    return (
        <>
            <h1>Tilauskorisi</h1>
            <h4>Maksu työn valmistuttua, laskulla</h4>


            <table className="">
                <tr><th>Tuote</th><th>Määrä</th><th>Summa</th></tr>
                <tr><td>{title}</td><td>{kpl}</td><td>{totalPrice}</td></tr>
                <tr><td></td><td>Veroton hinta</td><td>{withoutTax}</td></tr>
                <tr><td></td><td>Vero 25.5%</td><td>{taxed}</td></tr>
                <tr><td></td><td>Yhteensä</td><td>{taxed + withoutTax}</td></tr>
            </table>
            <Button variant="contained">Vahvista</Button>


        </>
    );

}

export default TheBasket;