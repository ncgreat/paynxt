import { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, LoadScriptNext, Autocomplete, Marker, Polyline } from '@react-google-maps/api';
import { Button, Input, Card, CardContent, Progress, Dialog, DialogContent, DialogHeader, DialogFooter, Badge, Spinner } from '../ui';
import io from 'socket.io-client';
import { useHistory } from 'react-router-dom';
import { MdArrowBack } from "react-icons/md";
import { Subheader } from '../../containers';

const socket = io('http://localhost:3080');

const RideBooking = () => {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [routePath, setRoutePath] = useState([]);
  const [fare, setFare] = useState(null);
  const [distance, setDistance] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [rideStatus, setRideStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [driverName, setDriverName] = useState('');
  const [riderName, setRiderName] = useState('');

  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const pickupRef = useRef(null);
  const dropoffRef = useRef(null);

  const history = useHistory();
//   let isScriptLoaded = false; //

  const isAirport = (address) => address.toLowerCase().includes('airport');
  const roundToNearest50 = (amount) => Math.ceil(amount / 50) * 50;
  // Function to format the price as currency
  const formatPrice = price => {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0
    }).format(price);
  };

  const calculateRoute = async () => {
    if (pickupCoords && dropoffCoords) {
      const request = {
        origin: { location: { latLng: { latitude: pickupCoords.lat, longitude: pickupCoords.lng } } },
        destination: { location: { latLng: { latitude: dropoffCoords.lat, longitude: dropoffCoords.lng } } },
        travelMode: 'DRIVE',
        routingPreference: 'TRAFFIC_AWARE',
        departureTime: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        // departureTime: new Date().toISOString(),
        polylineQuality: 'OVERVIEW',
        computeAlternativeRoutes: false,
        routeModifiers: {
          avoidTolls: false,
          avoidHighways: false,
          avoidFerries: false
        }
      };

      try {
        const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': 'AIzaSyDkp5d4E_9QmKbpgYVWw_6l6ijD8faJ4nI',
            'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline'
          },
          body: JSON.stringify(request)
        });

        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          setDistance(route.distanceMeters / 1000 + ' km');
          setEstimatedTime(route.duration.replace('s', ' seconds'));
          setRoutePath(route.polyline.encodedPolyline);
          const calculatedFare = calculateFare(route.distanceMeters / 1000, pickup);
          setFare(calculatedFare);
          socket.emit('ride-request', { pickup, dropoff });
          socket.on('ride-update', (data) => {
            console.log('Message received:', data);
            // setMessages((prevMessages) => [...prevMessages, data]);
          });
      
          // Clean up the connection
          return () => {
            socket.off('ride-update');
          };
        //   alert('Ride confirmed! Driver is on the way. 🚗');
        } else {
          console.error('No route found');
        }
      } catch (error) {
        console.error('Error fetching route:', error);
      }
    }
  };

  const calculateFare = (distance, pickup) => {
    const baseFare = 300;
    const minuteRate = 60;
    const airportFee = isAirport(pickup) ? 1000 : 0;
    const estimatedTravelTime = (distance / 30) * 60;
    setEstimatedTime(Math.ceil(estimatedTravelTime));
    const totalFare = baseFare + (estimatedTravelTime * minuteRate) + airportFee;
    return roundToNearest50(totalFare);
  };

  const confirmBooking = () => {
    socket.emit('confirm-booking', { pickup, dropoff });
    alert('Ride confirmed! Driver is on the way. 🚗');
  };

  const cancelRide = () => {
    socket.emit('cancel-ride');
    setRideStatus('Ride Cancelled');
    setDriverLocation(null);
    setProgress(0);
  };

  const handlePayment = () => {
    alert('Payment successful! 🎉');
    setShowPayment(false);
  };

  useEffect(() => {
    socket.on('driver-list', (driverList) => {
      setDrivers(driverList);
    });

    socket.on('driver-location-update', (update) => {
      setDrivers((prev) =>
        prev.map((driver) => (driver.id === update.id ? { ...driver, location: update.location } : driver))
      );
    });

    socket.on('ride-update', (update) => {
      setRideStatus(update.status);
    });

    return () => {
      socket.off('driver-list');
      socket.off('driver-location-update');
      socket.off('ride-update');
    };
  }, []);

  const requestDriver = (driver) => {
    setSelectedDriver(driver);
    socket.emit('ride-request', {
      driverId: driver.id,
      pickup: 'Your location',
      dropoff: 'Destination',
    });
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPickupCoords({ lat: latitude, lng: longitude });
          getLocationName(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error.message);
        }
      );
    }
  
    const handleDriverLocation = (location) => setDriverLocation(location);
    const handleRideStatus = (status) => setRideStatus(status);
    const handleRideProgress = (progress) => setProgress(progress);
  
    socket.on('driver-location', handleDriverLocation);
    socket.on('ride-status', handleRideStatus);
    socket.on('ride-progress', handleRideProgress);
  
    return () => {
      socket.off('driver-location', handleDriverLocation);
      socket.off('ride-status', handleRideStatus);
      socket.off('ride-progress', handleRideProgress);
    };
  }, []); // Keep dependencies empty unless socket changes
  
  const getLocationName = (lat, lng) => {
    if (window?.google && window?.google?.maps && window?.google?.maps?.Geocoder) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
            // console.log(results);
          setPickup(results[0].formatted_address);
        } else {
          console.warn("Geocoding failed:", status);
        }
      });
    } else {
      console.error("Google Maps Geocoder is not available.");
    }
  };



//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition((position) => {
//         const { latitude, longitude } = position.coords;
//         setPickupCoords({ lat: latitude, lng: longitude });
//         getLocationName(latitude, longitude);
//       });
//     }

//     socket.on('driver-location', (location) => setDriverLocation(location));
//     socket.on('ride-status', (status) => setRideStatus(status));
//     socket.on('ride-progress', (progress) => setProgress(progress));
//   }, []);

// useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition((position) => {
//         const { latitude, longitude } = position.coords;
//         // console.log(latitude, longitude);
//         setPickupCoords({ lat: latitude, lng: longitude });
//         console.log({ lat: latitude, lng: longitude });
//         getLocationName({ lat: latitude, lng: longitude });
//       });
//     }

//     socket.on('driver-location', (location) => {
//       setDriverLocation(location);
//     });

//     socket.on('ride-status', (status) => {
//       setRideStatus(status);
//       if (status === 'Ride Complete') {
//         setShowPayment(true);
//       }
//     });

//     socket.on('ride-progress', (progress) => {
//       setProgress(progress);
//     });

//     socket.on('ride-details', ({ driver, rider, fare, distance }) => {
//       setDriverName(driver);
//       setRiderName(rider);
//       setFare(fare);
//       setDistance(distance);
//     });

//     socket.on('driver-arrival-time', (time) => {
//       setEstimatedTime(time);
//     });
//   }, []);

  return (
    <div >
        <Subheader title='Book a Ride' />
        <Card>
        <CardContent>
          <div className="grid gap-4">
            <LoadScriptNext googleMapsApiKey="AIzaSyDkp5d4E_9QmKbpgYVWw_6l6ijD8faJ4nI" libraries={["places", "geometry"]}>
             <GoogleMap
            mapContainerStyle={{ height: '400px', width: '100%' }}
            center={pickupCoords || { lat: 37.7749, lng: -122.4194 }}
            zoom={12}
          >
            {pickupCoords && <Marker position={pickupCoords} label="Pickup" />}
            {dropoffCoords && <Marker position={dropoffCoords} label="Dropoff" />}
            {driverLocation && <Marker position={driverLocation} label="Driver" />}
            {routePath && window.google && window.google.maps && window.google.maps.geometry ? (
            (() => {
                try {
                const decodedPath = window.google?.maps?.geometry.encoding.decodePath(routePath);
                return (
                    <Polyline 
                    path={decodedPath} 
                    options={{ strokeColor: '#FF0000', strokeWeight: 4 }} 
                    />
                );
                } catch (error) {
                console.error("Error decoding polyline path:", error);
                return null;
                }
            })()
            ) : (
            <p className="text-red-500">Unable to load route. Please try again.</p>
            )}
          </GoogleMap>
          <div className='rounded-md bg-gray-300 p-4'>
              <Autocomplete onLoad={(autocomplete) => (pickupRef.current = autocomplete)} onPlaceChanged={() => {
                const place = pickupRef.current.getPlace();
                setPickup(place?.formatted_address || '');
                setPickupCoords(place?.geometry?.location?.toJSON() || null);
              }}>
                <Input placeholder="Pickup Location" value={pickup} onChange={(e) => setPickup(e.target.value)} />
              </Autocomplete>
              <Autocomplete onLoad={(autocomplete) => (dropoffRef.current = autocomplete)} onPlaceChanged={() => {
                const place = dropoffRef.current.getPlace();
                setDropoff(place?.formatted_address || '');
                setDropoffCoords(place?.geometry?.location?.toJSON() || null);
              }}>
                <div className='mt-2'>
                    <Input placeholder="Drop-off Location" value={dropoff} onChange={(e) => setDropoff(e.target.value)} />
                </div>
                
              </Autocomplete>
              <Button className="bg-gradient-to-t from-pink-700 to-pink-500" onClick={calculateRoute}>Calculate Fare & Find Driver</Button>
              </div>
            </LoadScriptNext>
          </div>
        </CardContent> 
      </Card>
      {fare && (
        <div className="mt-6 px-6 bg-gray-900 rounded-t-2xl py-4 text-[#ddd]">
          {/* <h2 className="text-xl font-semibold">Your NxtRide - ₦{formatPrice(fare)}</h2> */}
          {fare && <h2><span className='text-md'>Your NxtRide</span> - ₦<span className="text-xl font-bold">{formatPrice(fare)}</span></h2>}
          <div className='border border-t border-gray-600 my-2'/>
          <p><span className='font-semibold'>Rider</span>: {riderName || 'N/A'}</p>
          <p><span className='font-semibold'>Driver</span>: {driverName || 'Searching...'}</p>
          <p><span className='font-semibold'>Pickup</span>: {pickup}</p>
          <p><span className='font-semibold'>Drop-off</span>: {dropoff}</p>
          {distance && <p className="text-lg">Distance: {distance}</p>}
          {estimatedTime && <p className="text-lg">Estimated Time: {estimatedTime} min</p>}
          {rideStatus && <p className="text-md mt-2">Status: {rideStatus}</p>}
          {progress > 0 && (
            <Progress value={progress} className="mt-4" />
          )}

          {driverLocation && (
            <div className="flex gap-4 mt-4">
              <Button onClick={confirmBooking}>Confirm Booking</Button>
              <Button onClick={cancelRide} variant="destructive">Cancel Ride</Button>
            </div>
          )}
        </div>
      )}
      {/* </div> */}
    </div>
  );
};

export default RideBooking;
