import { useState, useEffect } from 'react';
import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import axios from 'axios'


function MyLocation() {
  const apiKey = import.meta.env.VITE_MAPS_APIKEY
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

  const getPosition = async () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });        
      });
    } else {
      console.log('Geolocation is not available in your browser.');
    }
  };

  useEffect(() => { getStoredLocations() }, [])
  useEffect(() => {getPosition()}, [])
  useEffect(() => {getCityName(position.latitude, position.longitude)},[])

  const getCityName = async (lat, lon) => {    
    console.log("Checking city name")
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`
    console.log(url)
    try {      
      const response = await axios.get(url);
      const result = response.data.results[0];
      console.log("result: ", result)
      console.log("location: ", result.formatted_address)
      setCity(result.formatted_address);
    } catch (error) {
      setError('Unable to fetch city name.');
    }
  };

  

  //Send data to firebase
  if ((position.latitude != null && position.latitude != '60.3848704') && (position.longitude != null && position.longitude != '25.001984')) {
    position.city = city;
    console.log("position", position)

    addDoc(collection(db, "Locations"), position);
  }

}

export default MyLocation;
