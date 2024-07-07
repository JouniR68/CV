import { useState, useEffect } from 'react'
import axios from 'axios'
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function MyLocation() {
  const apiKey = import.meta.env.VITE_MAPS_APIKEY    
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const [location, setLocation] = useState([]);
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')


  const getAddress = async (lat, lon) => {    
    console.log("Checking address")
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`
    console.log(url)
    try {      
      const response = await axios.get(url);
      const result = response.data.results[1];            
      setAddress(result.formatted_address);
    } catch (error) {
      setError('Unable to fetch city name.');
    }
  };

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

  useEffect(() => { getStoredLocations() }, [])
  useEffect(() => {getPosition(); getAddress(position.latitude, position.longitude)}, [])
  

  //Send data to firebase
  //if ((position.latitude != null && position.latitude != '60.3848704') && (position.longitude != null && position.longitude != '25.001984')) {                
  if (position.address != "" || position.address != null){
    position.address = address  
    addDoc(collection(db, "Locations"), position);
    console.log("Location stored, data: ", position)    
  }
}

export default MyLocation;
