import { useState, useEffect } from 'react'
import axios from 'axios'
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from './ErrorMessage';
import { isMobile, isTablet, isBrowser, isAndroid, isIOS, isWinPhone, browserName, mobileModel } from 'react-device-detect';

function MyLocation({ message }) {
  const apiKey = import.meta.env.VITE_MAPS_APIKEY
  const trimmedApi = apiKey.replace(/'/g, "");
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const [address, setAddress] = useState({ detail: '' })
  const [locations, setLocations] = useState([])
  const [places, setPlaces] = useState([])
  const [errorMes, setErrorMes] = useState(null)
  const [loading, setLoading] = useState(null)
  const [area, setArea] = useState(null)
  const reach = 300
  const navigate = useNavigate()
  let filteredLocations = []
  const { t } = useTranslation()
  
  const removeLocationDocs = async () => {
    const locationRef = collection(db, "locations")
    try {
      const querySnapshot = await getDocs(locationRef)
      const batch = db.batch()
      querySnapshot.docs.map((doc) => (
        batch.delete(doc.ref)
      ))

      /*const querySnapshot = await locationRef.get();
      const batch = db.batch()
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref)
      })
      await batch.commit();*/
      alert("Location quota cleared")
    } catch (err) {
      console.error("Removings docs failed, err: ", err)
    }
  }

  const getLocations = async () => {
    const locationRef = collection(db, "locations")
    try {

      const querySnapshot = await getDocs(locationRef)
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      const tempArray = [...data]
      filteredLocations = tempArray.filter((loc, index) => {
        return locations.indexOf(loc) === index;
      })
      console.log("filteredLocations: ", filteredLocations)
      const newLocations = filteredLocations.map(d => d.detail)
      console.log("newlocations", newLocations)
      setLocations(newLocations)
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

  useEffect(() => {
    getLocations()
  }, [locations])


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
  const getPlace = (lat, lon) => {
    const data = {
      "location": `${lat},${lon}`,
      //"location": "51.5287398,-0.266403",
      "radius": 1500,
    }

    setArea(data.radius)

    try {
      console.log("getPlaces")
      const url = `http://localhost:5000/api/places`
      console.log("Place request payload: ", data)
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then(response => response.json())
        .then(data2 => {
          console.log("Data: ", data2.results)
          if (Array.isArray(data2) && data2.length > 0) {
            return data2.forEach(place => setPlaces(prev => [...prev, place.name + '-' + place.vicinity]));
          }
        })
        .catch(error =>
          console.log('Error:', error));
    } finally {
      setLoading(false);
    }
  }

  const addAddress = (addr) => {
    if (!addr) {
      console.log("No address")
      return
    } else {
      console.log(`Checking if ${addr} is duplicate.`)
      console.log("Filtered location array: ", filteredLocations)
      const isAddressDuplicate = locations.includes(addr)

      if (isAddressDuplicate) {
        console.log(`${addr} address already stored`)
      }

      isMobile ? address.target = "mobile" : address.target = "PC";

      //blacklist
      if (addr.includes("Kattila" || addr.includes('Vuohennokantie 7'))) {
        console.error("Blacklist addresses")
        navigate('error', { state: { locationError: "The address is blacklisted." } })
        return
      }

      if (places.length > 0) {
        address.push(places)
      }

      const date = new Date()
      address.detail = addr;
      console.log("Place to be logged: ", places)
      address.pvm = date.toLocaleDateString()
      address.time = date.toLocaleTimeString('fi-FI')
      console.log("address: ", address)
      if (isAddressDuplicate === false) {
        console.log("Address is : ", address)
        //addDoc(collection(db, "locations"), address);
      } else if (isAddressDuplicate) {
        console.log(`Address ${address.detail} already registered.`)
        navigate('error', { state: { locationError: "The address already registered" } })
        return
      }

    }
  }

  return (<>
    <button onClick={removeLocationDocs}>Remove all locations (be sure before clicking)</button>
  </>)
}

export default MyLocation;
