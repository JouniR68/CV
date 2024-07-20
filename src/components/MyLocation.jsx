import { useState, useEffect } from 'react'
import axios from 'axios'
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

function MyLocation({message}) {
  const apiKey = import.meta.env.VITE_MAPS_APIKEY
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const [address, setAddress] = useState('')
  const [location, setLocations] = useState(null)

  const navigate = useNavigate()
  const {t} = useTranslation()

  useEffect(() => {
    getLocations()
  }, [])

  useEffect(() => {
    getUserPosition();
  }, [])

  useEffect(() => {
    if (position.latitude != null && position.longitude != null){
    getAddress(position.latitude, position.longitude)
  } else {
    console.error("Latitude and longitude missing")    
    navigate('error', {state: {location_error: "locationError"}})
  }
  }, [])

  //Retrieve existing location data from the firebase db.
  const getLocations = async () => {
    try {
      const locationRef = collection(db, "locations")
      const querySnapshot = await getDocs(locationRef)
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      console.log("Location data: ", data)
      setLocations(data)
    } catch (error) {
      console.error("Error fetching data: ", error)
      throw {
        message: "Datan haku epäonnistui",
        statusText: "Failas",
        status: 403,
      }
    }
  }

  const getUserPosition = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(success, error)
    }
    else {
      console.log('Geolocation is not available in your browser.');
    }
  };

  const success = (position) => {
    setPosition({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });

    if (position.latitude && position.longitude) {
      getAddress(position.latitude, position.longitude) //Check home address / town.
      addAddress() //Update location to the database
    }

  }

  const error = (err) => {
    switch (err.code) {
      case err.PERMISSION_DENIED:
        alert("User denied the request for Geolocation.");
        break;
      case err.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.");
        break;
      case err.TIMEOUT:
        alert("The request to get user location timed out.");
        break;
      case err.UNKNOWN_ERROR:
        alert("An unknown error occurred.");
        break;
    }
  }


  const getAddress = async (lat, lon) => {
    const fetchingLocation = sessionStorage.getItem('allowSessionStorageForLocation')
    console.log("Retrieving location: ", fetchingLocation)
    if ((lat != null || lon != null) && fetchingLocation) {
      try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`
        console.log("url: ", url)

        const response = await axios.get(url);

        const addressComponents = response.data.results[0].address_components;

        // Extract city from address components
        const cityComponent = addressComponents.find(component =>
          component.types.includes('locality')
        );

        const result = response.data.results[0];
        if (result.formatted_address != "") {
          setAddress(result.formatted_address);
          console.log("formatted address: ", result.formatted_address)
        } else {
          setAddress("No details address, city (if found) = ", cityComponent.long_name);
          console.log("City: ", cityComponent.long_name)
        }
        addAddress()
      } catch (error) {
        console.error('Unable to get location.');
      }
    }
  };


  console.log("Locations: ", location)

  const addAddress = () => {
    const isAddressDuplicate = location.find(e => e?.address === address)
    console.log("isAddressDuplicate: " + isAddressDuplicate + ", address: " + address)
    if (!isAddressDuplicate) {
      console.log(`Address ${address} new address.`)
      //addDoc(collection(db, "locations"), address);
    } else {
      console.log(`Address ${address} already registered.`)
    }
  }

}

export default MyLocation;
