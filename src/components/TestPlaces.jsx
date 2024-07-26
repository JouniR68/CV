import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NearbyPlaces = () => {
    const apiKey = import.meta.env.VITE_MAPS_APIKEY
    const trimmedApi = apiKey.replace(/'/g, "");
    const [location, setLocation] = useState({ lat: null, lon: null });
    const [places, setPlaces] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ lat: latitude, lon: longitude });
                    fetchNearbyPlaces(latitude, longitude);
                },
                (error) => {
                    setError('Geolocation error: ' + error.message);
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
        }
    }, []);

    const fetchNearbyPlaces = async (lat, lon) => {        
        const radius = 1500; // 1500 meters is a common search radius
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=60.3848811,24.841420&radius=${radius}&key=${trimmedApi}`;

        try {
            const response = await axios.get(url);
            if (response.data.status === 'OK') {
                setPlaces(response.data.results);
            } else {
                setError('No places found or an error occurred: ' + response.data.status);
            }
        } catch (error) {
            setError('Unable to fetch places due to Cors policy');
        }
    };

    return (
        <div>
            <h2>Nearby Places</h2>
            {error ? (
                <p>Error: {error}</p>
            ) : (
                <ul>
                    {places.map(place => (
                        <li key={place.place_id}>
                            {place.name} - {place.vicinity}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NearbyPlaces;
