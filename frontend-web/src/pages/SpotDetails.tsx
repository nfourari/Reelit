import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Heart, 
  Plus, 
  Fish, 
  Users, 
  Info, 
  Unlock, 
  Lock,
  ThumbsUp,
  MessageSquare,
  User
} from 'lucide-react';

const SpotDetails = () => {
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Mock data for spot details
  const spotDetails = {
    id: 1,
    name: 'Lake Tohopekaliga',
    description: 'Lake Tohopekaliga, often referred to as Lake Toho, is a 22,700-acre lake in Osceola County, Florida, known for trophy bass fishing. The lake features extensive vegetation, providing excellent habitat for largemouth bass, crappie, and bluegill.',
    allowedSpecies: ['Largemouth Bass', 'Bluegill', 'Crappie', 'Catfish'],
    access: 'public',
    coordinates: { lat: 28.2, lng: -81.4 },
    bestTimes: 'Early morning and late evening',
    regulations: 'Florida freshwater fishing license required',
    amenities: ['Boat ramps', 'Fishing pier', 'Parking', 'Restrooms'],
    catches: [
      {
        id: 1,
        user: 'Carlos M.',
        avatar: '/placeholder.svg',
        fish: 'Largemouth Bass',
        weight: '8.2 lbs',
        time: '2 days ago',
        likes: 24,
        comments: 5,
        image: 'https://images.unsplash.com/photo-1594804233323-5f7b3b3a1e29?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
      },
      {
        id: 2,
        user: 'Maria S.',
        avatar: '/placeholder.svg',
        fish: 'Crappie',
        weight: '2.5 lbs',
        time: '1 week ago',
        likes: 18,
        comments: 3,
        image: 'https://images.unsplash.com/photo-1595503240812-7286dafaddc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
      }
    ]
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-cyan-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800">{spotDetails.name}</h1>
          <div className="flex space-x-4">
            <Button 
              variant="outline" 
              className={isFavorite ? "bg-red-50 text-red-500 border-red-200" : ""}
              onClick={toggleFavorite}
            >
              <Heart className={`w-4 h-4 mr-2 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
              {isFavorite ? "Saved" : "Save as Favorite"}
            </Button>
            <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Catch Here
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Spot Info */}
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="w-5 h-5 mr-2" />
                  About this Spot
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-6">{spotDetails.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                      <Fish className="w-4 h-4 mr-2" />
                      Fish Species
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {spotDetails.allowedSpecies.map((species) => (
                        <Badge key={species} variant="secondary" className="bg-orange-100 text-orange-700">
                          {species}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Access Rules
                    </h3>
                    <div className="flex items-center">
                      {spotDetails.access === 'public' && (
                        <>
                          <Unlock className="w-4 h-4 text-green-600 mr-2" />
                          <span className="text-green-600 font-medium">Public Access</span>
                        </>
                      )}
                      {spotDetails.access === 'private' && (
                        <>
                          <Lock className="w-4 h-4 text-orange-600 mr-2" />
                          <span className="text-orange-600 font-medium">Private Access</span>
                        </>
                      )}
                      {spotDetails.access === 'trespassing' && (
                        <>
                          <Lock className="w-4 h-4 text-red-600 mr-2" />
                          <span className="text-red-600 font-medium">Trespassing Required</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">Best Fishing Times</h3>
                    <p className="text-slate-600">{spotDetails.bestTimes}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">Regulations</h3>
                    <p className="text-slate-600">{spotDetails.regulations}</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {spotDetails.amenities.map((amenity) => (
                      <Badge key={amenity} variant="outline" className="bg-white">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Map */}
          <div>
            <Card className="mb-8">
              <CardContent className="p-0">
                {/* This would be replaced with an actual Google Maps component */}
                <div className="w-full h-64 bg-slate-200 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-slate-500">Map location for {spotDetails.name}</p>
                    <p className="text-xs text-slate-400">
                      Lat: {spotDetails.coordinates.lat}, Lng: {spotDetails.coordinates.lng}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Catches at this spot */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Fish className="w-5 h-5 mr-2" />
              Recent Catches at this Spot
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {spotDetails.catches.map((catch_) => (
                <div key={catch_.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-semibold text-slate-800">{catch_.user}</span>
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                          {catch_.time}
                        </Badge>
                      </div>
                      
                      <p className="text-slate-600 mt-1">
                        Caught a <span className="font-semibold text-primary">{catch_.fish}</span> 
                        {' weighing '} 
                        <span className="font-semibold text-primary">{catch_.weight}</span>
                      </p>
                      
                      {catch_.image && (
                        <div className="mt-3 rounded-lg overflow-hidden">
                          <img 
                            src={catch_.image} 
                            alt={`${catch_.user}'s catch`} 
                            className="w-full h-64 object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center mt-4 space-x-4">
                        <Button variant="ghost" size="sm" className="text-slate-600 hover:text-primary">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          {catch_.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-slate-600 hover:text-primary">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          {catch_.comments}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SpotDetails; 