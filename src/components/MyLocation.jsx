import { useState, useEffect } from 'react'
import axios from 'axios'
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function MyLocation() {
  const apiKey = import.meta.env.VITE_MAPS_APIKEY
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')


  const getAddress = async (lat, lon) => {
    console.log("Checking address")
    if (lat != null || lon != null){
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`
    console.log(url)
    try {
      const response = await axios.get(url);
      const result = response.data.results[0];
      if (result.formatted_address != "") {
        setAddress(result.formatted_address);
      } 
    } catch (error) {
      setError('Unable to get location.');
    }
  }
  };


  const getPosition = () => {
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

  useEffect(() => {
    getPosition();
    getAddress(position.latitude, position.longitude)
  }, [])


  //Send data to firebase
  if (position.address != "" || position.address != null || (position.latitude != '60.3848704' && position.longitude != '25.001984')) {
    position.address = address
    addDoc(collection(db, "Locations"), position);
    console.log("Location stored, data: ", position)
  }
}

export default MyLocation;
