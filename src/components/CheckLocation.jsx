import { useState, useEffect } from 'react'
import  axios from 'axios'
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
  const [places, setPlaces] = useState([])
  const [errorMes, setErrorMes] = useState(null)
  const [loading, setLoading] = useState(null)

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
    getPlace(position.coords.latitude, position.coords.longitude)
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

  //const place = await axios.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=cruise&location=-lat%lon&radius=200&type=restaurant&key=trimmedApi")
  const getPlace = async (lat, lon) => {
      try {
        console.log("getPlaces")
        const response = await fetch(`http://localhost:5000/api/places?location=${lat},${lon}&radius=100&type=restaurant`);
        console.log("response: ", response)
        const data = await response.json();
        console.log("Response from the server ", data.results)
        setPlaces(data.results);
      } catch (error) {
        console.log('Axios error:', error);
      } finally {
        setLoading(false);
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


console.log(places)

let locatedPlaces = []
if (places.length > 0){
  locatedPlaces = places.map(f => f.name)
}

  return (
    <div>
      {loading && <h3>Loading...</h3>}
      <h2>Position details:</h2>

      <h3>Latitude: {position.latitude}</h3>
      <p></p>
      <h3>Longitude: {position.longitude}</h3>
      <h3>The address: {homebase}</h3>
      {locatedPlaces.length > 0 && <h3>Nearby place(s): {locatedPlaces}</h3>}
    </div>
  )


}

export default CheckLocation;
