import React, { useState, useCallback } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { MapPin, Filter, Fish, Lock, Unlock, Users, AlertTriangle, Skull } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader
} from '@react-google-maps/api'

const API_KEY = 'AIzaSyAv8iV6Q-KbJGHLl4dFno-Y4bHGczyQfks';

// Maps integration
const containerStyle = {
  width: '100%',
  height: '100%'
};

// Center on Orlando
const centerDefault = {
  lat: 28.4,
  lng: -81.5
};

const MapExplorer = () => {
  // Mock data for fishing spots
  const fishingSpots = [
    {
      id: 1,
      name: 'Lake Tohopekaliga',
      lat: 28.2,
      lng: -81.4,
      species: ['Largemouth Bass', 'Bluegill', 'Black Crappie (Speckled Perch)'],
      access: 'public',
      popularity: 4.5
    },
    {
      id: 2,
      name: 'Mosquito Lagoon',
      lat: 28.7,
      lng: -80.8,
      species: ['Atlantic Sturgeon', 'Smalltooth Sawfish', 'Florida Gar'],
      access: 'public',
      popularity: 4.8
    },
    {
      id: 3,
      name: 'Butler Chain of Lakes',
      lat: 28.4,
      lng: -81.5,
      species: ['Largemouth Bass', 'Bluegill', 'Channel Catfish'],
      access: 'private',
      popularity: 4.2
    },
    {
      id: 4,
      name: 'Johns Lake',
      lat: 28.5,
      lng: -81.6,
      species: ['Largemouth Bass', 'Black Crappie (Speckled Perch)', 'Bluegill'],
      access: 'public',
      popularity: 4.0
    },
    {
      id: 5,
      name: 'Secret Pond',
      lat: 28.3,
      lng: -81.3,
      species: ['Blue Tilapia', 'Walking Catfish', 'Armored Catfish (Suckermouth)'],
      access: 'private',
      popularity: 4.9
    }
  ];

  // Filter state
  const [filters, setFilters] = useState({
    species: [],
    access: {
      public: true,
      private: true
    },
    distance: 15
  });

  // Fish species organized by categories
  const fishSpeciesCategories = {
    endangered: [
      'Atlantic Sturgeon',
      'Smalltooth Sawfish'
    ],
    invasive: [
      'Blue Tilapia',
      'Armored Catfish (Suckermouth)',
      'Walking Catfish'
    ],
    native: [
      'Largemouth Bass',
      'Bluegill',
      'Redear Sunfish (Shellcracker)',
      'Black Crappie (Speckled Perch)',
      'Channel Catfish',
      'Florida Gar',
      'Bowfin (Mudfish)',
      'Chain Pickerel'
    ]
  };

  // Handle species filter change
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
      access: {
        ...prev.access,
        [access]: !prev.access[access]
      }
    }));
  };

  // Handle distance filter change
  const handleDistanceChange = (value) => {
    setFilters(prev => ({ ...prev, distance: value[0] }));
  };

  // Maps functions

  const [selectedSpot, setSelectedSpot] = useState(null);

  const filteredSpots = fishingSpots.filter(spot => {
    if (filters.species.length > 0 && !spot.species.some(s => filters.species.includes(s))) return false;
    if (!filters.access[spot.access]) return false;
    return true;
  });

  const onLoad = useCallback(map => {
    const bounds = new window.google.maps.LatLngBounds();
    filteredSpots.forEach(({ lat, lng }) => bounds.extend({ lat, lng }));
    map.fitBounds(bounds);
  }, [filteredSpots]);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: API_KEY
  })

  if (loadError) return <div>Map load error</div>
  if (!isLoaded)  return <div>Loading map…</div>

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-cyan-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Map Explorer</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters */}
          <div className="lg:overflow-auto lg:max-h-[calc(100vh-140px)] lg:sticky lg:top-20">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Species Filter */}
                <div>
                  <h3 className="text-md font-semibold text-slate-800 mb-3 flex items-center">
                    <Fish className="w-4 h-4 mr-2" />
                    Fish Species
                  </h3>
                  
                  {/* Endangered Species */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-red-600 mb-2 flex items-center">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Endangered Species
                    </h4>
                    <div className="space-y-2">
                      {fishSpeciesCategories.endangered.map((species) => (
                        <div key={species} className="flex items-center">
                          <Checkbox 
                            id={`species-${species}`} 
                            checked={filters.species.includes(species)}
                            onCheckedChange={() => handleSpeciesChange(species)}
                          />
                          <Label 
                            htmlFor={`species-${species}`}
                            className="ml-2 text-sm font-medium leading-none cursor-pointer"
                          >
                            {species}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Invasive Species */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-amber-600 mb-2 flex items-center">
                      <Skull className="w-3 h-3 mr-1" />
                      Invasive Species
                    </h4>
                    <div className="space-y-2">
                      {fishSpeciesCategories.invasive.map((species) => (
                        <div key={species} className="flex items-center">
                          <Checkbox 
                            id={`species-${species}`} 
                            checked={filters.species.includes(species)}
                            onCheckedChange={() => handleSpeciesChange(species)}
                          />
                          <Label 
                            htmlFor={`species-${species}`}
                            className="ml-2 text-sm font-medium leading-none cursor-pointer"
                          >
                            {species}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Native Species */}
                  <div>
                    <h4 className="text-sm font-semibold text-green-600 mb-2 flex items-center">
                      <Fish className="w-3 h-3 mr-1" />
                      Native Species
                    </h4>
                    <div className="space-y-2">
                      {fishSpeciesCategories.native.map((species) => (
                        <div key={species} className="flex items-center">
                          <Checkbox 
                            id={`species-${species}`} 
                            checked={filters.species.includes(species)}
                            onCheckedChange={() => handleSpeciesChange(species)}
                          />
                          <Label 
                            htmlFor={`species-${species}`}
                            className="ml-2 text-sm font-medium leading-none cursor-pointer"
                          >
                            {species}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Access Rules Filter */}
                <div>
                  <h3 className="text-md font-semibold text-slate-800 mb-3 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Access Rules
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Checkbox 
                        id="access-public" 
                        checked={filters.access.public}
                        onCheckedChange={() => handleAccessChange('public')}
                      />
                      <Label 
                        htmlFor="access-public"
                        className="ml-2 text-sm font-medium leading-none cursor-pointer flex items-center"
                      >
                        <Unlock className="w-3 h-3 mr-1 text-green-600" />
                        Public
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox 
                        id="access-private" 
                        checked={filters.access.private}
                        onCheckedChange={() => handleAccessChange('private')}
                      />
                      <Label 
                        htmlFor="access-private"
                        className="ml-2 text-sm font-medium leading-none cursor-pointer flex items-center"
                      >
                        <Lock className="w-3 h-3 mr-1 text-orange-600" />
                        Private
                      </Label>
                    </div>
                  </div>
                </div>
                
                {/* Distance Filter */}
                <div>
                  <h3 className="text-md font-semibold text-slate-800 mb-3 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Distance
                  </h3>
                  <div className="space-y-4 px-1">
                    <Slider
                      defaultValue={[filters.distance]}
                      max={25}
                      step={1}
                      onValueChange={handleDistanceChange}
                    />
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">0 mi</span>
                      <span className="text-sm font-medium text-primary">{filters.distance} mi</span>
                      <span className="text-sm text-slate-600">25 mi</span>
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
                        fillColor:
                          spot.access === 'public'
                            ? 'green'
                            : spot.access === 'private'
                            ? 'orange'
                            : 'red',
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
                        <h3>{selectedSpot.name}</h3>
                        {/* … */}
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapExplorer; 
