import { useState, useEffect } from 'react';
import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

function MyLocation() {
  const [location, setLocation] = useState([])
  const [position, setPosition] = useState({ latitude: null, longitude: null });




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


  useEffect(() => { getStoredLocations() }, [])

  useEffect(() => {

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });

      });
    } else {
      console.log('Geolocation is not available in your browser.');
    }
  }, [position]);

  if (position.latitude != null && position.latitude != "60.3848704" && !location.includes(position.latitude) && position.longitude != null && position.longitude != "25.001984" && !location.includes(position.longitude)) {
    addDoc(collection(db, "Locations"), position);
  }


}

export default MyLocation;
