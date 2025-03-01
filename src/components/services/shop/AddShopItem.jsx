import { useState } from 'react';
import shop from '../../../../data/shop.json';
import TheBasket from './TheBasket';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Box, Badge, IconButton, Typography, Button } from '@mui/material';
import { AddShoppingCart, Height } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../LoginContext';
import "../../../css/catalog.css";

const AddShopItem = () => {
    const [itemCount, setItemCount] = useState(0);
    const [total, setTotal] = useState({});
    const [inputValues, setInputValues] = useState({}); // Track input values for each product
    const [order, setOrder] = useState([]);
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    const products = shop.catalog.map((j) => {
        return j;
    });

    const handleInput = (Event, itemId) => {
        const value = parseInt(Event.target.value);

        // Ensure value is not negative
        if (value < 0) {
            Event.target.value = 0;
        }

        // Update inputValues state with the new value for the specific product
        setInputValues((prevValues) => ({
            ...prevValues,
            [itemId]: value,
        }));
    };

    const addItemToCart = (item) => {
        const quantity = inputValues[item.id] || 0;

        if (quantity > 0) {
            console.log(
                "id: ",
                item.id +
                ', title: ' +
                item.title +
                ', description:' +
                item.description +
                ',price hour: ' +
                item['price-h'] +
                ', kpl: ' +
                quantity
            );

            setItemCount(itemCount + 1);
            setOrder((order) => [
                ...order,
                {
                    id: item.id,
                    title: item.title,
                    priceh: item['price-h'],
                    kpl: quantity,
                    tila: 'uusi',
                },
            ]);
        }
    };

    const showTheBasket = () => {
        console.log('order: ', order);
        if (order.length === 0) {
            console.log('Ei tuotteita');
            navigate('/errorNote', {
                state: {
                    title: 'Kori tyhjä',
                    description: 'Varmista tuotekohtainen määrä ja ostoskoriin napin painallus',
                },
            });
        } else {
            navigate('/basket', { state: { data: order } });
        }
    };

    return (
        <>
            <div>
                <IconButton sx={{ postion: 'absolute', left: '90%' }} aria-label="cart" onClick={showTheBasket}>
                    <Badge badgeContent={itemCount} color="secondary">
                        <AddShoppingCart sx={{ width: '80px', height: '60px', backgroundColor: 'white' }} />
                    </Badge>
                </IconButton>

                <div className="catalog">
                    {products.map((item) => {
                        const quantity = inputValues[item.id] || 0; // Get the quantity for the current product
                        const isDisabled = quantity === 0; // Disable button if quantity is 0

                        return (
                            <div key={item.id} className="catalog--card">
                                <h3>{item.title}</h3>
                                <strong>{item.description}</strong>
                                <p></p>
                                <span>Tuntihinta {item['price-h']} eur</span>
                                <input
                                    name="kpl"
                                    type="number"
                                    id="kpl"
                                    placeholder="0"
                                    onChange={(Event) => handleInput(Event, item.id)}
                                />
                                {isDisabled ? <Button
                                    sx={{ backgroundColor: 'black', color: 'white', margin: '1rem' }}
                                >
                                    Määrä?
                                </Button>
                                    : <Button
                                        sx={{ backgroundColor: 'red', color: 'white', margin: '1rem' }}
                                        onClick={() => addItemToCart(item)}
                                    >
                                        Tilaa
                                    </Button>}
                            </div>
                        );
                    })}
                </div>
            </div >
        </>
    );
};

export default AddShopItem;