import { useState, useEffect } from 'react'
import axios from 'axios'
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from './ErrorMessage';
import { isMobile, isTablet, isBrowser, isAndroid, isIOS, isWinPhone, browserName, mobileModel } from 'react-device-detect';
import qs from 'qs'

function CheckLocation() {
  const apiKey = import.meta.env.VITE_MAPS_APIKEY
  const trimmedApi = apiKey.replace(/'/g, "");
  let reach = 0;
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  //const [address, setAddress] = useState({ detail: '' })
  //const [location, setLocations] = useState([])
  const [homebase, setHomeBase] = useState('')
  const [places, setPlaces] = useState([])
  const [errorMes, setErrorMes] = useState(null)
  const [loading, setLoading] = useState(null)
  const [area, setArea] = useState(null)

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

  const getPlace = async (lat, lon) => {
    const params = {
      location: `${lat},${lon}`,
      //location:"51.5287398,-0.266403",
      radius: 300,
      rankby: 'distance'
    }
    setArea(params.radius)

    const url = 'https://firma-ed35a.web.app/fetchPlaces'
    //const url = "http://localhost:5001/firma-ed35a/europe-west2/fetchPlaces"
    try {
      const response = await axios.get(url, { params });
      setPlaces(response.data);
    } catch (error) {
      console.log('Error sending request to Cloud function: ', error.message);
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
        navigate('/error', { state: { locationError: t('UnableToGetLocation') } })
      }
    }
  };


  console.log("places: ", places)
  let k = 0;
  let locatedPlaces = []
  if (places?.length > 0) {
    // eslint-disable-next-line react/jsx-key
    locatedPlaces = places.map((f) => <div style={{ marginLeft: 100, marginRight: 0, textAlign: 'left' }}> <li key={k++}>{f.name}</li></div>)
  }

  return (
    <div>

      <h2>Position details:</h2>

      <h3>Latitude: {position.latitude}</h3>
      <p></p>
      <h3>Longitude: {position.longitude}</h3>
      <h3>The address: {homebase}</h3>
      {locatedPlaces.length > 0 && <h3 key = {k++}>Place(s) within {area} meters: {locatedPlaces}</h3>}
      {errorMes && <h3>{errorMes}</h3>}
    </div>
  )


}

export default CheckLocation;