// pages/components/GeolocationMap.tsx
'use client';

import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import React, { useState } from 'react';

const libraries: ['places'] = ['places'];

const GeolocationMap = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onMapLoad = React.useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          map?.panTo({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        error => {
          console.error('Error getting location:', error);
          // Handle error cases like permission denied or location unavailable [1]
          if (error.code === error.PERMISSION_DENIED) {
            alert(
              'Location access has been denied. Please enable it in your browser settings.'
            );
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            alert(
              'Unable to determine your current location. Please try again.'
            );
          } else if (error.code === error.TIMEOUT) {
            alert('The request to get your location timed out.');
          }
        }
      );
    } else {
    }
  };

  if (loadError) return <div>Error loading Maps</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <GoogleMap
        mapContainerStyle={{ height: '100%', width: '100%' }}
        zoom={currentLocation ? 15 : 2}
        center={currentLocation || { lat: 0, lng: 0 }}
        onLoad={onMapLoad}
      >
        {currentLocation && <Marker position={currentLocation} />}
      </GoogleMap>
      <button onClick={handleGetLocation} style={{ marginTop: '10px' }}>
        Get Current Location
      </button>
    </div>
  );
};

export default GeolocationMap;
