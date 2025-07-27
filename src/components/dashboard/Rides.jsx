import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const HERE_API_KEY = 'vw6zAJtDTO0khU0BsU8Rt1o1uymtNkXOyC6HvHMmn7U'; // Replace with your HERE key

const RideBookingFreeMap = () => {
  const [pickupQuery, setPickupQuery] = useState('');
  const [dropoffQuery, setDropoffQuery] = useState('');
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [route, setRoute] = useState([]);

  const fetchSuggestions = async (query, setSuggestions, userCoords) => {
    if (!query) return;
    try {
      const res = await axios.get('https://geocode.search.hereapi.com/v1/geocode', {
        params: {
          q: query,
          apiKey: HERE_API_KEY,
          in: 'countryCode:NGA', // Limit results to Nigeria
          at: `${userCoords.lat},${userCoords.lng}`, // Bias toward user
        },
      });
      setSuggestions(res.data.items);
    } catch (err) {
      console.error('Suggestion error:', err);
    }
  };

  const handleSelect = (item, setCoords, setQuery, isPickup) => {
    const { lat, lng } = item.position;
    setCoords({ lat, lng });
    setQuery(item.title);
    if (isPickup) setPickupSuggestions([]);
    else setDropoffSuggestions([]);
  };

  useEffect(() => {
  const delayDebounce = setTimeout(() => {
    if (dropoffQuery.trim()) {
      fetchSuggestions(dropoffQuery, setDropoffSuggestions);
    }
  }, 1000);

  return () => clearTimeout(delayDebounce);
}, [dropoffQuery]);

useEffect(() => {
  const delayDebounce = setTimeout(() => {
    if (pickupQuery.trim()) {
      fetchSuggestions(pickupQuery, setPickupSuggestions);
    }
  }, 1000); // Adjust delay as needed

  return () => clearTimeout(delayDebounce);
}, [pickupQuery]);

  const fetchRoute = async () => {
    if (!pickupCoords || !dropoffCoords) return;
    try {
      const res = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${pickupCoords.lng},${pickupCoords.lat};${dropoffCoords.lng},${dropoffCoords.lat}`,
        {
          params: {
            overview: 'full',
            geometries: 'geojson',
          },
        }
      );
      const coords = res.data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
      setRoute(coords);
    } catch (err) {
      console.error('Route error:', err);
    }
  };

  useEffect(() => {
    if (pickupCoords && dropoffCoords) fetchRoute();
  }, [pickupCoords, dropoffCoords]);

  return (
    <div className="p-4">
      <div className="mb-3">
       <input
  type="text"
  value={pickupQuery}
  // onChange={(e) => setPickupQuery(e.target.value)}
  onChange={(e) => {
  const newValue = e.target.value;
  setPickupQuery(newValue);
  fetchSuggestions(newValue, setPickupSuggestions, userCoords);
}}
  placeholder="Enter pickup location"
  className="w-full border px-2 py-1"
/>
        {pickupSuggestions.length > 0 && (
          <ul className="bg-white border">
            {pickupSuggestions.map((item, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleSelect(item, setPickupCoords, setPickupQuery, true)}
              >
                {item.title}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mb-3">
<input
  type="text"
  value={dropoffQuery}
  onChange={(e) => setDropoffQuery(e.target.value)}
  placeholder="Enter dropoff location"
  className="w-full border px-2 py-1"
/>
        {dropoffSuggestions.length > 0 && (
          <ul className="bg-white border">
            {dropoffSuggestions.map((item, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleSelect(item, setDropoffCoords, setDropoffQuery, false)}
              >
                {item.title}
              </li>
            ))}
          </ul>
        )}
      </div>

      <MapContainer
        center={[6.5244, 3.3792]} // Lagos default
        zoom={12}
        scrollWheelZoom
        style={{ height: '400px', width: '100%' }}
      >
        {/* Optional: Replace with HERE tiles if desired */}
        {/* <TileLayer
          attribution='© HERE'
          url={`https://{s}.tile.hereapi.com/v3/base/mc/{z}/{x}/{y}/png8?apikey=${HERE_API_KEY}`}
        /> */}
       
        <TileLayer
          attribution='© OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pickupCoords && <Marker position={[pickupCoords.lat, pickupCoords.lng]} icon={defaultIcon} />}
        {dropoffCoords && <Marker position={[dropoffCoords.lat, dropoffCoords.lng]} icon={defaultIcon} />}
        {route.length > 0 && <Polyline positions={route} color="blue" />}
      </MapContainer>
    </div>
  );
};

export default RideBookingFreeMap;
