import { useState, useEffect } from 'react'
import axios from 'axios'
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from './ErrorMessage';
import { isMobile, isTablet, isBrowser, isAndroid, isIOS, isWinPhone, browserName, mobileModel } from 'react-device-detect';

function MyLocation({ message }) {
  const apiKey = import.meta.env.VITE_MAPS_APIKEY
  const trimmedApi = apiKey.replace(/'/g, "");
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const [address, setAddress] = useState({ detail: '' })
  const [location, setLocations] = useState([])
  const [places, setPlaces] = useState("Place not found")
  const [errorMes, setErrorMes] = useState(null)
  const [loading, setLoading] = useState(null)
  const reach = 200
  const navigate = useNavigate()

  const { t } = useTranslation()

  useEffect(() => {
    getLocations()
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
      const isPreviousAddress = data.find((l) => l.detail != null)
      if (!isPreviousAddress) {
        console.log("No location data on the database")
      } else {
        console.log("Existing db data:")
        setLocations(isPreviousAddress.detail)
      }
      getUserPosition()
    } catch (error) {
      console.error("Error fetching data: ", error)
      throw {
        message: "Datan haku epäonnistui",
        statusText: "Failas",
        status: 403,
      }
    }
  }

  console.log("Locations: ", location)

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

    if (position.coords.latitude && position.coords.longitude) {
      getAddress(position.coords.latitude, position.coords.longitude) //Check home address / town.
      getPlace(position.coords.latitude, position.coords.longitude)
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
          setAddress((prevAddress) => ({ ...prevAddress, detail: result.formatted_address, }));

        } else {
          setAddress({ detail: cityComponent.long_name });
          console.log("City: ", cityComponent.long_name)
        }
        addAddress(result.formatted_address);
      } catch (error) {
        console.error(t('UnableToGetLocation'));
        //{isMobile ? info = "Request was made from " + mobileModel : info = "The request was made from PC"}
        navigate('error', { state: { locationError: t('UnableToGetLocation') } })
      }
    }
  };


  let placeChecked = false
  const getPlace = async (lat, lon) => {
    try {
      
      console.log("getPlaces")
      const response = await axios.get(`http://localhost:5000/api/places?location=${lat},${lon}&radius=${reach}`)
      const data = response.json()
      setPlaces(data.results[0].name)
      placeChecked = true
    } catch (error) {
      console.log('Axios error:', error);
      setErrorMes("Unable to get places")
    } finally {
      setLoading(false);
    }
  }

  const addAddress = (addr) => {
    if (!addr) {
      console.log("address not found")
      return
    } else {
      const isAddressDuplicate = location.includes(addr)

      if (isAddressDuplicate) {
        console.log(`${isAddressDuplicate} address already stored`)
        return
      }

      isMobile ? address.target = "mobile" : address.target = "PC";

      //blacklist
      if (addr.includes("Kattila" || addr.includes('Vuohennokantie 7'))) {
        console.error("Bot addresses and homebase is not saved to the firebase")
        return
      }

      /*
      if (!places){
        console.log("No places..")
        return
      }
      else if (places.length > 0) {
        const foundPlaces = places.map(place => (place.name - place.vicinity))
        console.log("Address place: ", foundPlaces)
        address.push(foundPlaces)
      }
      */
      const date = new Date()
      address.detail = addr;
      console.log("Place to be logged: ", places)
      address.place = places;
      address.pvm = date.toLocaleDateString()
      address.time = date.toLocaleTimeString('fi-FI')
      console.log("address: ", address)
      if (isAddressDuplicate === false && placeChecked === true) {
        console.log("Demo address: ", address)
        addDoc(collection(db, "locations"), address);
      } else {
        console.log(`Address ${address.detail} already registered.`)
        navigate('error', { state: { locationError: "address already registered" } })
        return
      }
      
    }
  }

}

export default MyLocation;
