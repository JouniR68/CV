import { useState } from 'react'
import shop from '../../../data/shop.json'
import TheBasket from './TheBasket'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Box, Badge, IconButton, Typography, Button } from '@mui/material';
import { AddShoppingCart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';


const AddShopItem = () => {
    const [itemCount, setItemCount] = useState(0);
    const [total, setTotal] = useState({})
    const [basket, setTheBasket] = useState(false)
    const [inputValues, setInputValues] = useState({})
    const [order, setOrder] = useState({})
    const navigate = useNavigate();

    const products = shop.catalog.map((j) => {
        return j;
    });

    /*
    const calcSum = (item, Event) => {
        Event.target.value < 0 ? Event.target.value = 0 : Event.target.value

        const value = Event.target.value;
        console.log("calcSum value: ", value)
        setInputValues((inputValues) => ({ ...inputValues, kpl: value }))

        if (!isNaN(event)) {
            let value = item['price-h'] * event
            setTotal(total => ({ ...total, [item.id]: value, }))
        }
    }
    */

    const handleInput = (Event) => {
        console.log("handleInput: ", Event.target.value)
        if (Event.target.value != null) {
            setInputValues({ key: Event.target.value })
        }
    }

    const addItemToCart = (item) => {
        console.log("id: ", item.id + ', title: ' + item.title + ',price hour: ' + item['price-h'] + ', kpl: ' + inputValues.key)
        setItemCount(itemCount + 1);
        setOrder(order => ({
            ...order,
            title: item.title,
            description: item.description,
            priceh: item['price-h'],
            kpl: inputValues.key
        }))

    };

    //, total[item.id]

    const showTheBasket = () => {
        navigate('/basket', {state: {data: order}})    
    }


    return (
        <>
            <IconButton aria-label="cart" onClick={showTheBasket}>
                <Badge badgeContent={itemCount} color="secondary">
                    <AddShoppingCartIcon sx={{ fontSize: 30 }} />
                </Badge>
            </IconButton>
            <h1>Tervetuloa verkkokauppaan</h1>
            <span>Mikäli tarvitset enemmän kuin esim päivän niin soita niin katsotaan sopiva paketti.</span>
            <div className="catalog">

                {products.map((item) => (

                    <div key={item.id} className="catalog--card">
                        <h3>{item.title}</h3>
                        <strong>{item.description.map(d => d + '\n')}</strong>
                        <p></p>
                        <span>Tuntihinta {item['price-h']} eur</span>
                        <input name="kpl" type="number" id="kpl" placeholder="kpl" onChange={(Event) => handleInput(Event)}></input>
                        <AddShoppingCart onClick={() => addItemToCart(item)}>Tilaukseen</AddShoppingCart>
                    </div>


                ))}
                
            </div>
        </>
    );
}

export default AddShopItem;