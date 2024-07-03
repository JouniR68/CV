import { useState, useEffect } from 'react';
import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import axios from 'axios'
const apiKey = import.meta.env.VITE_MAPS_APIKEY

function MyLocation() {
  const [location, setLocation] = useState([])
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const [city, setCity] = useState('')
  const [error, setError] = useState('')


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
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      const result = response.data.results[0];
      const city = result.components.city || result.components.town || result.components.village;
      setCity(city);
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
