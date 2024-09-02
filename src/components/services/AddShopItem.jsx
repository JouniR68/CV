import { useState } from 'react'
import shop from '../../../data/shop.json'


const AddShopItem = () => {
    const [total, setTotal] = useState({})
    const products = shop.catalog.map((j) => {
        return j;
    });

    const addProduct = () => {
        console.log("Adding product")
        //Save it to the firebase
    }


    const calcSum = (e, hour, id) => {
        e.target.value < 0 ? e.target.value = 0 : e.target.value 
        if (!isNaN(e.target.value)) {
            let value = hour * e.target.value
            setTotal(total => ({...total,  [id]: value, }))
        }

    }

    return (
        <>
        <h1>Tervetuloa verkkokauppaan</h1>
        <span>Mikäli tarvitset enemmän kuin esim päivän niin soita niin katsotaan sopiva paketti.</span>
        <div className="catalog">            

            {products.map((item) => (

                <div key={item.id} className="catalog--card">
                    <h3>{item.title}</h3>
                    <strong>{item.description.map(d => d + '\n')}</strong>
                    <p></p>
                    <span>Tuntihinta {item['price-h']} eur</span>
                        <input name="kpl" type="number" id="kpl" placeholder="kpl" onChange={(e) => calcSum(e, item['price-h'], item.id)}></input>
        
                        <label>{total[item.id]}</label>
                    <br></br>

                    <button onClick={addProduct}>Tilaukseen</button>
                </div>
            ))}
        </div>
        </>
    );
}

export default AddShopItem;