import express, { json } from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = 5000;



// Middleware to parse JSON bodies
app.use(json());

//cors handler
app.use(cors());

app.get('/api/places', async (req, res) => {
    console.log("/api/places endpoint")
    const { location, radius, type } = req.query;
    console.log("location: ", location)
    console.log("radius: ", radius)
    console.log("type: ", type)

    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
            params: {
                'keyword': 'cruise',
                'location': location,
                'radius': radius,
                'type': type,
                'key': 'AIzaSyCkhlysVOEcD_Wfn4hQwDXgXc1LQde0ne0'
            },
            headers:{'Access-Control-Allow-Origin':'*'}
        });
        console.log("server - response.data: ", response.data)
        res.json(response.data.results);
    } catch (err) {
        console.error("Error to get places, ", err)
    }
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
