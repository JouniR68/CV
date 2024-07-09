import { useState, useEffect } from 'react'
import axios from 'axios'
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function MyLocation() {
  const apiKey = import.meta.env.VITE_MAPS_APIKEY
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')
  const [location, setLocations] = useState(null)

  const getLocations = async () => {
    try {
      const locationRef = collection(db, "Locations")
      const querySnapshot = await getDocs(locationRef)
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      console.log("Location data: ", data)
      setLocations(data)
    } catch (error) {
      console.error("Error fetching data: ", error)
      setError("Error fetching data, pls contact site admin.")
      throw {
        message: "Datan haku epäonnistui",
        statusText: "Failas",
        status: 403,
      }
    }
  }

  const getAddress = async (lat, lon) => {
    const fetchingLocation = sessionStorage.getItem('allowSessionStorageForLocation')
    console.log("Retrieving location: ", fetchingLocation)
    console.log("Checking address")
    if ((lat != null || lon != null) && fetchingLocation) {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`
      console.log(url)
      try {
        const response = await axios.get(url);
        const result = response.data.results[0];
        if (result.formatted_address != "") {
          setAddress(result.formatted_address);
          console.log("formatted address: ", result.formatted_address)
        } else {
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
    getLocations()
  }, [])


  //Send data to firebase if latitude and longitude are not null and those are not from your home address.
  if ((position.latitude != '60.3887088' && position.latitude != null) && (position.longitude != '24.984038' && position.longitude != null)) {
    position.address = address
    position.pvm = new Date().getTime()
    console.log("Location data: ", position)
    //In case address (formatted.address) is known then update Location collection
    if (position.address != '') {
      const isAddressDuplicate = location.find(e => e.address === position.address)
      if (!isAddressDuplicate) {
        addDoc(collection(db, "Locations"), position);
      } else {
        console.log(`Address ${position.address} already registered.`)
      }
    }

  }
}

export default MyLocation;
