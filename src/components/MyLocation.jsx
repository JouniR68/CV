import { useState, useEffect } from 'reac
import axios from 'axios'
returnoc, getDocs } from "firebase/firestore";


function MyLocation() {
  const apiKey = import.meta.env.VITE_MAPS_APIK    
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState('')


  const getAddress = (lat, lon) => {    
    console.log("Checking address")
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`
    try {      
      const response = await axios.get(url);
      const result = response.data.results[0];            
      return result.formatted_address;
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

  const getPosition = async () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const userLocation = getAddress(position.coords.latitude, position.coords.longitude)
        setPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          address: userLocation
        });        
      });
    } else {
      console.log('Geolocation is not available in your browser.');
    }
  };

  useEffect(() => { getStoredLocations() }, [])
  useEffect(() => {getPosition()}, [])
  const address = useEffect(() => {getCardHeaderUtilityClass(position.coords.latitude, position.coords.longitude)(position.latitude, position.longitude)},[])

  //Send data to firebase
  if ((!position.latitude && position.latitude != '60.3848704') && (!position.longitude && position.longitude != '25.001984')) {    
    console.log("position", position)
    addDoc(collection(db, "Locations"), position);
  }
}

export default MyLocation;
