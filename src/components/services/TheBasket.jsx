import { useLocation } from "react-router-dom";

const TheBasket = () => {
    const location = useLocation();

    const {state} = location
    const {data} = state;
    const {title, description, kpl, priceh} = data

    console.log("TheBasket ", title)
        
    return ( 
    <>
    <h1>Tilauskorisi</h1> 
    <h4>Maksu työn valmistuttua, laskulla</h4>
        <span>
            {title} {kpl} tuntia. Kokonaislasku {kpl * priceh}
        </span>
        </>
    );

}
 
export default TheBasket;