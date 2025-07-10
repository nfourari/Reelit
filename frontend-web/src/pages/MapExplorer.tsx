import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { MapPin, Filter, Fish, Lock, Unlock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const MapExplorer = () => {
  // Mock data for fishing spots
  const fishingSpots = [
    {
      id: 1,
      name: 'Lake Tohopekaliga',
      lat: 28.2,
      lng: -81.4,
      species: ['Largemouth Bass', 'Bluegill', 'Crappie'],
      access: 'public',
      popularity: 4.5
    },
    {
      id: 2,
      name: 'Mosquito Lagoon',
      lat: 28.7,
      lng: -80.8,
      species: ['Redfish', 'Snook', 'Trout'],
      access: 'public',
      popularity: 4.8
    },
    {
      id: 3,
      name: 'Butler Chain of Lakes',
      lat: 28.4,
      lng: -81.5,
      species: ['Largemouth Bass', 'Bluegill', 'Catfish'],
      access: 'private',
      popularity: 4.2
    },
    {
      id: 4,
      name: 'Johns Lake',
      lat: 28.5,
      lng: -81.6,
      species: ['Largemouth Bass', 'Crappie', 'Bluegill'],
      access: 'public',
      popularity: 4.0
    },
    {
      id: 5,
      name: 'Secret Pond',
      lat: 28.3,
      lng: -81.3,
      species: ['Trophy Bass', 'Catfish'],
      access: 'trespassing',
      popularity: 4.9
    }
  ];

  // Filter state
  const [filters, setFilters] = useState({
    species: [],
    access: {
      public: true,
      private: true,
      trespassing: false
    },
    distance: 50
  });

  // Available fish species for filtering
  const availableSpecies = [
    'Largemouth Bass', 'Bluegill', 'Crappie', 'Redfish', 'Snook', 'Trout', 'Catfish', 'Trophy Bass'
  ];

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
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Species Filter */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                    <Fish className="w-4 h-4 mr-2" />
                    Fish Species
                  </h3>
                  <div className="space-y-2">
                    {availableSpecies.map((species) => (
                      <div key={species} className="flex items-center">
                        <Checkbox 
                          id={`species-${species}`} 
                          checked={filters.species.includes(species)}
                          onCheckedChange={() => handleSpeciesChange(species)}
                        />
                        <Label 
                          htmlFor={`species-${species}`}
                          className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {species}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Access Rules Filter */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
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
                        className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
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
                        className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                      >
                        <Lock className="w-3 h-3 mr-1 text-orange-600" />
                        Private
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox 
                        id="access-trespassing" 
                        checked={filters.access.trespassing}
                        onCheckedChange={() => handleAccessChange('trespassing')}
                      />
                      <Label 
                        htmlFor="access-trespassing"
                        className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                      >
                        <Lock className="w-3 h-3 mr-1 text-red-600" />
                        Trespassing
                      </Label>
                    </div>
                  </div>
                </div>
                
                {/* Distance Filter */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Distance
                  </h3>
                  <div className="space-y-4">
                    <Slider
                      defaultValue={[filters.distance]}
                      max={100}
                      step={5}
                      onValueChange={handleDistanceChange}
                    />
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
                {/* This would be replaced with an actual Google Maps component */}
                <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-slate-500 mb-4">Google Maps would be integrated here</p>
                    <div className="space-y-2">
                      {fishingSpots
                        .filter(spot => {
                          // Filter by species if any selected
                          if (filters.species.length > 0) {
                            const hasMatchingSpecies = spot.species.some(species => 
                              filters.species.includes(species)
                            );
                            if (!hasMatchingSpecies) return false;
                          }
                          
                          // Filter by access
                          if (!filters.access[spot.access]) return false;
                          
                          return true;
                        })
                        .map(spot => (
                          <div 
                            key={spot.id} 
                            className="bg-white p-3 rounded-md shadow-sm flex items-center space-x-3 cursor-pointer hover:shadow-md transition-shadow"
                          >
                            <Link to={`/spot/${spot.id}`} className="flex items-center space-x-3 w-full">
                              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                                <MapPin className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-slate-800">{spot.name}</h3>
                                <p className="text-xs text-slate-500">
                                  {spot.species.join(', ')}
                                  {spot.access === 'public' && <span className="ml-2 text-green-600">(Public)</span>}
                                  {spot.access === 'private' && <span className="ml-2 text-orange-600">(Private)</span>}
                                  {spot.access === 'trespassing' && <span className="ml-2 text-red-600">(Trespassing)</span>}
                                </p>
                              </div>
                            </Link>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapExplorer; 