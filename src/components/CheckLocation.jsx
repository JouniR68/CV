import { useState, useEffect } from 'react'
import axios from 'axios'
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from './ErrorMessage';
import { isMobile, isTablet, isBrowser, isAndroid, isIOS, isWinPhone, browserName, mobileModel } from 'react-device-detect';

function CheckLocation() {
  const apiKey = import.meta.env.VITE_MAPS_APIKEY
  const trimmedApi = apiKey.replace(/'/g, "");
  
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  //const [address, setAddress] = useState({ detail: '' })
  //const [location, setLocations] = useState([])
  const [homebase, setHomeBase] = useState('')

  const navigate = useNavigate()

  const { t } = useTranslation()

  useEffect(() => {
    getUserPosition()
  }, [])


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
    getAddress(position.coords.latitude, position.coords.longitude)
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
    //const fetchingLocation = sessionStorage.getItem('allowSessionStorageForLocation')
    
    if (lat != null || lon != null) {
      try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${trimmedApi}`
        console.log("url: ", url)

        const response = await axios.get(url);

        const addressComponents = response.data.results[0].address_components;

        // Extract city from address components
        const cityComponent = addressComponents.find(component =>
          component.types.includes('locality')
        );

        const result = response.data.results[0];

        if (result.formatted_address != "") {
          //setAddress((prevAddress) => ({ ...prevAddress, detail: result.formatted_address, }));
          setHomeBase(result.formatted_address)
        } else {
          //setAddress({ detail: cityComponent.long_name });
          setHomeBase(`Retrieving the address based on ${lat} + ${lon} from failed`)
          
        }
      } catch (error) {
        console.error(t('UnableToGetLocation'));
        //{isMobile ? info = "Request was made from " + mobileModel : info = "The request was made from PC"}
        navigate('error', { state: { locationError: t('UnableToGetLocation') } })
      }
    }
  };


  return (
    <div>
      <h2>Position details:</h2>

      <h3>Latitude: {position.latitude}</h3>
      <p></p>
      <h3>Longitude: {position.longitude}</h3>
      <h3>The address: {homebase}</h3>
    </div>
  )


}

export default CheckLocation;
