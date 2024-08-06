import express, { json } from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = 5000;



// Middleware to parse JSON bodies
app.use(json());

//cors handler
app.use(cors());


app.delete('/api/deleteDocs', async (req, res) => {
    console.log("Freeing firebase quota")
    
})

app.post('/api/places', async (req, res) => {
    console.log("/api/places endpoint")
    const { location, radius, type } = req.body;
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
            headers:{'Access-Control-Allow-Origin':'*','Content-Type':'application/json'}
        });
        console.log("server - response.data: ", response.data)
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching data from Google Places API:', error.response ? error.response.data : error.message);
    }
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});