import { useState, useEffect } from 'react';
import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import axios from 'axios'
import { CoPresentOutlined } from '@mui/icons-material';


function MyLocation() {
  const apiKey = import.meta.env.VITE_MAPS_APIKEY
  const [location, setLocation] = useState([])
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const [city, setCity] = useState('')
  const [error, setError] = useState('')


  console.log("api key = ", apiKey)

  const getStoredLocations = async () => {
    try {
      const locationRef = collection(db, "Locations")
      const querySnapshot = await getDocs(locationRef)
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setLocation(data)
    } catch (error) {
      console.error("Error fetching data: ", error)
      throw {
        message: "Datan haku epäonnistui",
        statusText: "Failas",
        status: 403,
      }
    }
  }


  useEffect(() => { getStoredLocations() }, [])

  useEffect(() => {

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        getCityName(position.coords.latitude, position.coords.longitude)
      });
    } else {
      console.log('Geolocation is not available in your browser.');
    }
  }, []);


  const getCityName = async (lat, lon) => {
    console.log("latitude: " + lat + ", longitude: ", lon)
    //const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}`;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`
    console.log(url)
    let locs = []
    try {
      console.log("try..")
      const response = await axios.get(url);
      const result = response.data.results[0];
      console.log("result: ", result)

      //Assign found home bases to the addr and copy array to the state array.
      const addr = result.address_components.map((a) => (a.formatted_address.map(f => f)))
      console.log("address:", addr.at(-1))
      setCity(addr.at(-1));
    } catch (error) {
      setError('Unable to fetch city name.');
    }
  };

  if ((position.latitude != null && position.latitude != '60.3848704' && !location.includes(position.latitude)) && (position.longitude != null && position.longitude != '25.001984' && !location.includes(position.longitude))) {
    position.city = city;
    addDoc(collection(db, "Locations"), position);
  }

}

export default MyLocation;
