import { useState, useEffect } from 'react'
import axios from 'axios'
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function MyLocation() {
  const apiKey = import.meta.env.VITE_MAPS_APIKEY
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const [address, setAddress] = useState('')
  const [location, setLocations] = useState(null)

  useEffect(() => {
    getUserPosition();
    getAddress(position.latitude, position.longitude)
    getLocations()
  }, [])


  //Retrieve existing location data from the firebase db.
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
      updateDatabase() //Update location to the database
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
      } catch (error) {
        console.error('Unable to get location.');
      }
    }
  };




  console.log("Locations: ", location)

  const updateDatabase = () => {
    if (position.latitude != null && position.longitude != null) {
      position.address = address
      position.pvm = new Date()

      //In case address (formatted.address) is known then update Location collection
      if (position.address != '' && position.address) {
        const isAddressDuplicate = location.find(e => e?.address === address)
        console.log("isAddressDuplicate: " + isAddressDuplicate + ", position.address: " + position.address)
        if (!isAddressDuplicate) {
          console.log(`Address ${position.address} new address.`)
          addDoc(collection(db, "Locations"), position);
        } else {
          console.log(`Address ${position.address} already registered.`)
        }
      }

    }
  }

}

export default MyLocation;
