import React, { useState, useCallback } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { MapPin, Filter, Fish, Lock, Unlock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow
} from '@react-google-maps/api';

const API_KEY = 'AIzaSyAv8iV6Q-KbJGHLl4dFno-Y4bHGczyQfks';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const centerDefault = {
  lat: 28.4,
  lng: -81.5
};

const MapExplorer = () => {
  const fishingSpots = [
    { id: 1, name: 'Lake Tohopekaliga', lat: 28.2, lng: -81.4, species: ['Largemouth Bass', 'Bluegill', 'Crappie'], access: 'public', popularity: 4.5 },
    { id: 2, name: 'Mosquito Lagoon', lat: 28.7, lng: -80.8, species: ['Redfish', 'Snook', 'Trout'], access: 'public', popularity: 4.8 },
    { id: 3, name: 'Butler Chain of Lakes', lat: 28.4, lng: -81.5, species: ['Largemouth Bass', 'Bluegill', 'Catfish'], access: 'private', popularity: 4.2 },
    { id: 4, name: 'Johns Lake', lat: 28.5, lng: -81.6, species: ['Largemouth Bass', 'Crappie', 'Bluegill'], access: 'public', popularity: 4.0 },
    { id: 5, name: 'Secret Pond', lat: 28.3, lng: -81.3, species: ['Trophy Bass', 'Catfish'], access: 'trespassing', popularity: 4.9 }
  ];

  const [filters, setFilters] = useState({
    species: [],
    access: { public: true, private: true, trespassing: false },
    distance: 50
  });

  const [selectedSpot, setSelectedSpot] = useState(null);

  const availableSpecies = [
    'Largemouth Bass', 'Bluegill', 'Crappie', 'Redfish', 'Snook', 'Trout', 'Catfish', 'Trophy Bass'
  ];

  const handleSpeciesChange = (species) => {
    setFilters(prev => {
      const newSpecies = prev.species.includes(species)
        ? prev.species.filter(s => s !== species)
        : [...prev.species, species];
      return { ...prev, species: newSpecies };
    });
  };

  // Handle access filter change
  const handleAccessChange = (access) => {
    setFilters(prev => ({
      ...prev,
      access: { ...prev.access, [access]: !prev.access[access] }
    }));
  };

  // Handle distance filter change
  const handleDistanceChange = (value) => {
    setFilters(prev => ({ ...prev, distance: value[0] }));
  };

  // Filtered spots based on filters
  const filteredSpots = fishingSpots.filter(spot => {
    if (filters.species.length > 0 && !spot.species.some(s => filters.species.includes(s))) return false;
    if (!filters.access[spot.access]) return false;
    return true;
  });

  // Auto-fit bounds on load or filter change
  const onLoad = useCallback(map => {
    const bounds = new window.google.maps.LatLngBounds();
    filteredSpots.forEach(({ lat, lng }) => bounds.extend({ lat, lng }));
    map.fitBounds(bounds);
  }, [filteredSpots]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-cyan-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-8">Map Explorer</h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Filters */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" /> Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Species Filter */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                    <Fish className="w-4 h-4 mr-2" /> Fish Species
                  </h3>
                  <div className="space-y-2">
                    {availableSpecies.map(species => (
                      <div key={species} className="flex items-center">
                        <Checkbox
                          id={`species-${species}`}
                          checked={filters.species.includes(species)}
                          onCheckedChange={() => handleSpeciesChange(species)}
                        />
                        <Label htmlFor={`species-${species}`} className="ml-2 text-sm font-medium">
                          {species}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Access Rules Filter */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                    <Users className="w-4 h-4 mr-2" /> Access Rules
                  </h3>
                  <div className="space-y-2">
                    {['public', 'private', 'trespassing'].map(access => (
                      <div key={access} className="flex items-center">
                        <Checkbox
                          id={`access-${access}`}
                          checked={filters.access[access]}
                          onCheckedChange={() => handleAccessChange(access)}
                        />
                        <Label htmlFor={`access-${access}`} className="ml-2 text-sm font-medium flex items-center">
                          {access === 'public' && <Unlock className="w-3 h-3 mr-1 text-green-600" />}
                          {access === 'private' && <Lock className="w-3 h-3 mr-1 text-orange-600" />}
                          {access === 'trespassing' && <Lock className="w-3 h-3 mr-1 text-red-600" />}
                          {access.charAt(0).toUpperCase() + access.slice(1)}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Distance Filter */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" /> Distance
                  </h3>
                  <div className="space-y-4">
                    <Slider defaultValue={[filters.distance]} max={100} step={5} onValueChange={handleDistanceChange} />
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">0 mi</span>
                      <span className="text-sm font-medium text-primary">{filters.distance} mi</span>
                      <span className="text-sm text-slate-600">100 mi</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] overflow-hidden">
              <CardContent className="p-0 h-full relative">
                <LoadScript googleMapsApiKey={API_KEY}>
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={centerDefault}
                    zoom={10}
                    onLoad={onLoad}
                  >
                    {filteredSpots.map(spot => (
                      <Marker
                        key={spot.id}
                        position={{ lat: spot.lat, lng: spot.lng }}
                        onClick={() => setSelectedSpot(spot)}
                        icon={{
                          path: window.google.maps.SymbolPath.CIRCLE,
                          scale: 8,
                          fillColor: spot.access === 'public' ? 'green' : spot.access === 'private' ? 'orange' : 'red',
                          fillOpacity: 0.8,
                          strokeWeight: 1
                        }}
                      />
                    ))}
                    {selectedSpot && (
                      <InfoWindow
                        position={{ lat: selectedSpot.lat, lng: selectedSpot.lng }}
                        onCloseClick={() => setSelectedSpot(null)}
                      >
                        <div>
                          <h3 className="font-bold">{selectedSpot.name}</h3>
                          <p>{selectedSpot.species.join(', ')}</p>
                          <Link to={`/spot/${selectedSpot.id}`}>
                            <Button size="sm" variant="outline">View Details</Button>
                          </Link>
                        </div>
                      </InfoWindow>
                    )}
                  </GoogleMap>
                </LoadScript>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MapExplorer;
