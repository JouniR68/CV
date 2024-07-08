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
    if (lat != null || lon != null) {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`
      console.log(url)
      try {
        const response = await axios.get(url);
        const result = response.data.results[0];
        if (result.formatted_address != "") {
          setAddress(result.formatted_address);
          console.log("formatted address: ", result.formatted_address)
        } else{
          setAddress(result.address_components);
          console.log("address_components: ", result.address_components)
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


  //Send data to firebase if latitude and longitude are not null and those are not from your home address.
  if ((position.latitude != '60.3887088' && position.latitude != null) && (position.longitude != '24.984038' && position.longitude != null)) {
    position.address = address
    position.pvm = new Date().getTime()
    console.log("Location data: ", position)
    //In case address (formatted.address) is known then update Location collection
    if (position.address != '') {
      addDoc(collection(db, "Locations"), position);
    }

  }
}

export default MyLocation;
