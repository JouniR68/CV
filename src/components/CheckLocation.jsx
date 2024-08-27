import { useState, useEffect } from 'react'
import axios from 'axios'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
//import ErrorMessage from './ErrorMessage';
//import { isMobile, isTablet, isBrowser, isAndroid, isIOS, isWinPhone, browserName, mobileModel } from 'react-device-detect';

function CheckLocation() {
  const apiKey = import.meta.env.VITE_MAPS_APIKEY
  const trimmedApi = apiKey.replace(/'/g, "");  
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const [homebase, setHomeBase] = useState('')
  const [places, setPlaces] = useState([])
  const [errorMes, setErrorMes] = useState(null)
  const [area, setArea] = useState(null)

  const navigate = useNavigate()

  const { t } = useTranslation()
  useEffect(() => {
    getUserPosition()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      //rankby: 'distance'
    }
    setArea(params.radius)
    const url = 'https://europe-west2-firma-ed35a.cloudfunctions.net/fetchPlaces'

    try {
      console.log(`Sending place ${url} to functions`)
      const response = await axios.get(url, { params });
      console.log("places resp: ", response)
      if (!response || response.data.status === 'ZERO_RESULTS') {
        console.log("No place reponses")
        return;
      }
      setPlaces(response.data.results);
    } catch (error) {
      console.log('Error sending request to Cloud function: ', error.message);
    }
  }

  const getAddress = async (lat, lon) => {
    if (lat != null || lon != null) {
      try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${trimmedApi}`
        console.log("url: ", url)
        const response = await axios.get(url);
        /*
        const addressComponents = response.data.results[0].address_components;
        Extract city from address components
        const cityComponent = addressComponents.find(component =>
          component.types.includes('locality')
        );
        */

        const result = response.data.results[0];

        if (result.formatted_address != "") {
          setHomeBase(result.formatted_address)
        } else {
          setHomeBase(`Retrieving the address based on ${lat} + ${lon} failed`)
        }
      } catch (error) {
        console.error(t('UnableToGetLocation'));
        setErrorMes("Fetching address failed")
        //{isMobile ? info = "Request was made from " + mobileModel : info = "The request was made from PC"}
        navigate('/error', { state: { locationError: t('UnableToGetLocation') } })
      }
    }
  };


  let k = 0;
  let locatedPlaces = []
  if (places?.length > 0) {
    console.log("locatedPlaces: ", places)
    // eslint-disable-next-line react/jsx-key
    locatedPlaces = places.map((f) => <div className="places"> <li key={k++}>{f.name}</li></div>)
  }

  return (
    <div>

      <h2>Position details:</h2>

      <h3>Latitude: {position.latitude}</h3>
      <p></p>
      <h3>Longitude: {position.longitude}</h3>
      <h3>The address: {homebase}</h3>
      {locatedPlaces.length > 0 && <h3 key={k++}>Place(s) within {area} meters: {locatedPlaces}</h3>}
      {!locatedPlaces && <h3>No places found</h3>}
      {errorMes && <h3>{errorMes}</h3>}
    </div>
  )


}

export default CheckLocation;