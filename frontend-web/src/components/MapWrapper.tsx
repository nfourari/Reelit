import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
};

// Map options to disable satellite view and other controls
const mapOptions = {
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  clickableIcons: false,
  zoomControl: true
};

const MapWrapper = ({ center, spots, userLocation }) => {
  const [map, setMap] = useState(null);
  const [selectedSpot, setSelectedSpot] = useState(null);

  // Debug logging
  console.log("MapWrapper rendering with:", { 
    center, 
    spotsCount: spots?.length || 0,
    userLocation: userLocation ? "present" : "absent" 
  });

  const onLoad = useCallback((mapInstance) => {
    console.log("Map loaded successfully");
    setMap(mapInstance);
  }, []);

  const onError = useCallback((error) => {
    console.error("Error loading Google Maps:", error);
  }, []);
  
  useEffect(() => {
    if (map && spots && spots.length > 0) {
      try {
        console.log("Setting map bounds for", spots.length, "spots");
        const bounds = new window.google.maps.LatLngBounds();
        spots.forEach(({ lat, lng }) => bounds.extend({ lat, lng }));
        if(userLocation) {
          bounds.extend(userLocation);
        }
        map.fitBounds(bounds);
      } catch (error) {
        console.error("Error setting map bounds:", error);
      }
    }
  }, [map, spots, userLocation]);

  return (
    <div className="h-full w-full relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onError={onError}
        options={mapOptions}
      >
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 6,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: "white",
            }}
          />
        )}
        
        {spots && spots.map(spot => (
          <Marker
            key={`spot-${spot.id}`}
            position={{ lat: spot.lat, lng: spot.lng }}
            onClick={() => setSelectedSpot(spot)}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 5,
              fillColor: "#0F9D58",
              fillOpacity: 0.9,
              strokeWeight: 1,
              strokeColor: "white"
            }}
          />
        ))}

        {selectedSpot && (
          <InfoWindow
            position={{ lat: selectedSpot.lat, lng: selectedSpot.lng }}
            onCloseClick={() => setSelectedSpot(null)}
          >
            <div className="p-2">
              <h4 className="font-bold text-lg text-slate-800">{selectedSpot.name}</h4>
              <div className="text-slate-600 mt-2">
                <p className="font-semibold">Available Species:</p>
                <ul className="list-disc list-inside">
                  {selectedSpot.species.map(s => <li key={s}>{s}</li>)}
                </ul>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapWrapper; 