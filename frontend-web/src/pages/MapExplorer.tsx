import React, { useState, useCallback, useEffect, useMemo } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  MapPin, Filter, Fish, Lock, Unlock, Users, 
  AlertTriangle, Skull, RefreshCw, Map 
} from 'lucide-react';
import { useJsApiLoader } from '@react-google-maps/api';
import MapWrapper from '@/components/MapWrapper';
import fishingSpotsData from '@/data/lakes.json';
import speciesData from '@/data/fish_species.json';

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

interface FishingSpot {
  id: number;
  name: string;
  lat: number;
  lng: number;
  species: string[];
}

// Define libraries array outside component to prevent re-renders
import type { Libraries } from '@react-google-maps/api';
const libraries: Libraries = ['places', 'geometry'];

const MapExplorer = () => {
  const [fishingSpots] = useState<FishingSpot[]>(fishingSpotsData.map((spot, index) => ({ ...spot, id: index + 1 })));

  // Filter state
  const [filters, setFilters] = useState({
    species: [],
    distance: 15
  });

  // User location state
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Define fish species categories
  const fishSpeciesCategories = useMemo(() => {
    const invasive = speciesData.filter(s => s.status === 'invasive').map(s => s.species);
    const native = speciesData.filter(s => s.status === 'native').map(s => s.species);

    return {
      invasive: invasive.sort(),
      native: native.sort(),
    };
  }, []);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          setLocationError("Location access denied. Using default location.");
          console.error("Geolocation error:", error);
        }
      );
    } else {
      setLocationError("Geolocation not supported. Using default location.");
    }
  }, []);

  // Handle species filter change
  const handleSpeciesChange = (species: string) => {
    setFilters(prev => {
      const newSpecies = prev.species.includes(species)
        ? prev.species.filter(s => s !== species)
        : [...prev.species, species];
      
      return { ...prev, species: newSpecies };
    });
  };

  // Handle distance filter change
  const handleDistanceChange = (value: number[]) => {
    setFilters(prev => ({ ...prev, distance: value[0] }));
  };

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3958.8; // Earth radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Filter spots based on criteria
  const filteredSpots = useMemo(() => {
    return fishingSpots.filter(spot => {
      // Species filter - only apply if species filters are selected
      if (filters.species.length > 0) {
        // Check if the spot has ALL of the selected species
        const hasAllSelectedSpecies = filters.species.every(selectedSpecies => 
          spot.species.includes(selectedSpecies)
        );
        
        // If the spot doesn't have ALL of the selected species, filter it out
        if (!hasAllSelectedSpecies) {
          return false;
        }
      }
      
      // Distance filter (if user location available)
      if (userLocation) {
        const distance = calculateDistance(
          userLocation.lat, 
          userLocation.lng,
          spot.lat,
          spot.lng
        );
        if (distance > filters.distance) {
          return false;
        }
      }
      
      return true;
    });
  }, [filters, userLocation, fishingSpots]);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: API_KEY,
    libraries: libraries
  });

  // Debug logging
  console.log("MapExplorer state:", { 
    isLoaded, 
    hasLoadError: !!loadError, 
    filteredSpotsCount: filteredSpots?.length || 0 
  });
  
  // Loading and error states
  if (loadError) return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-cyan-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="h-[600px] flex flex-col items-center justify-center bg-red-50 text-red-700 p-4 rounded-lg">
          <Map className="w-16 h-16 mb-4 text-red-500" />
          <h2 className="text-2xl font-bold mb-2">Map Load Error</h2>
          <p className="text-center">Failed to load Google Maps. Please check your internet connection.</p>
          <p className="mt-4 text-sm text-red-600">{loadError.message}</p>
        </div>
      </div>
    </div>
  );

  if (!isLoaded) return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-cyan-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="h-[600px] flex flex-col items-center justify-center">
          <RefreshCw className="animate-spin w-16 h-16 text-cyan-600 mb-4" />
          <h2 className="text-2xl font-bold text-slate-800">Loading Map...</h2>
          <p className="text-slate-600 mt-2">This may take a few moments</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-cyan-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Map Explorer</h1>
        
        {locationError && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  {locationError} Showing all spots within {filters.distance} miles of Orlando.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Status message showing filter results */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <Fish className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                {filteredSpots.length === 0 ? (
                  <span>No fishing spots match your current filters. Try adjusting your criteria.</span>
                ) : (
                  <span>
                    Showing {filteredSpots.length} fishing {filteredSpots.length === 1 ? 'spot' : 'spots'}
                    {filters.species.length > 0 ? (
                      <> containing these species: <strong>{filters.species.join(', ')}</strong></>
                    ) : (
                      <> within {filters.distance} miles</>
                    )}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
        
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
                
                {/* Distance Filter */}
                {userLocation && (
                  <div>
                    <h3 className="text-md font-semibold text-slate-800 mb-3 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Distance
                    </h3>
                    <div className="space-y-2">
                      <Slider
                        value={[filters.distance]}
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
                )}
                
                {/* Reset Filters Button */}
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => setFilters({
                    species: [],
                    distance: 15
                  })}
                >
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Map */}
          <div className="lg:col-span-3 h-[600px] rounded-lg overflow-hidden shadow-lg">
            {isLoaded ? (
              <MapWrapper
                center={userLocation || centerDefault}
                spots={filteredSpots}
                userLocation={userLocation}
                selectedSpecies={filters.species}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-slate-100">
                <RefreshCw className="animate-spin w-8 h-8 text-cyan-600" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapExplorer;