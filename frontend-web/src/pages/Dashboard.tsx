import React from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  User, 
  Award, 
  Fish, 
  MapPin, 
  Cloud, 
  Droplets, 
  Wind, 
  Sun, 
  CloudRain,
  Trophy
} from 'lucide-react';

const Dashboard = () => {
  // Mock data for activity feed
  const activityFeed = [
    {
      id: 1,
      user: 'Carlos M.',
      avatar: '/placeholder.svg',
      action: 'caught a',
      fish: 'Largemouth Bass',
      weight: '8.2 lbs',
      location: 'Lake Tohopekaliga',
      time: '2 hours ago',
      likes: 24,
      comments: 5,
      image: 'https://images.unsplash.com/photo-1594804233323-5f7b3b3a1e29?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 2,
      user: 'Maria S.',
      avatar: '/placeholder.svg',
      action: 'caught a',
      fish: 'Snook',
      weight: '12.5 lbs',
      location: 'Mosquito Lagoon',
      time: '4 hours ago',
      likes: 32,
      comments: 8,
      image: 'https://images.unsplash.com/photo-1595503240812-7286dafaddc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 3,
      user: 'Tommy J.',
      avatar: '/placeholder.svg',
      action: 'earned the badge',
      achievement: 'Master Angler',
      time: '1 day ago',
      likes: 18,
      comments: 3
    }
  ];

  // Mock data for quick stats
  const quickStats = {
    totalCatches: 47,
    achievements: 8,
    favoriteSpots: 12,
    personalBest: '14.5 lbs Largemouth Bass'
  };

  // Mock data for weather
  const weatherData = {
    location: 'Orlando, FL',
    temperature: 84,
    condition: 'Partly Cloudy',
    precipitation: '20%',
    wind: '8 mph',
    humidity: '65%',
    forecast: [
      { day: 'Today', high: 84, low: 72, condition: 'Partly Cloudy' },
      { day: 'Tomorrow', high: 86, low: 74, condition: 'Sunny' },
      { day: 'Wed', high: 82, low: 71, condition: 'Rain' }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-cyan-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activity Feed */}
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-slate-800">Activity Feed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {activityFeed.map((activity) => (
                    <div key={activity.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="font-semibold text-slate-800">{activity.user}</span>
                            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                              {activity.time}
                            </Badge>
                          </div>
                          
                          <p className="text-slate-600 mt-1">
                            {activity.action} {activity.fish ? (
                              <>
                                <span className="font-semibold text-primary">{activity.fish}</span> 
                                {' weighing '} 
                                <span className="font-semibold text-primary">{activity.weight}</span>
                                {' at '} 
                                <span className="font-semibold text-slate-700">{activity.location}</span>
                              </>
                            ) : (
                              <>
                                <span className="font-semibold text-primary">{activity.achievement}</span>
                              </>
                            )}
                          </p>
                          
                          {activity.image && (
                            <div className="mt-3 rounded-lg overflow-hidden">
                              <img 
                                src={activity.image} 
                                alt={`${activity.user}'s catch`} 
                                className="w-full h-64 object-cover"
                              />
                            </div>
                          )}
                          
                          <div className="flex items-center mt-4 space-x-4">
                            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-primary">
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              {activity.likes}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-primary">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              {activity.comments}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-primary">
                              <Share2 className="w-4 h-4 mr-1" />
                              Share
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
          
          <div>
            {/* Quick Stats */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-slate-800">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-orange-100">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Total Catches</span>
                      <Fish className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-2xl font-bold text-primary mt-2">{quickStats.totalCatches}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-orange-100">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Achievements</span>
                      <Award className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-2xl font-bold text-primary mt-2">{quickStats.achievements}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-orange-100">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Favorite Spots</span>
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-2xl font-bold text-primary mt-2">{quickStats.favoriteSpots}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-orange-100">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Personal Best</span>
                      <Trophy className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-sm font-bold text-primary mt-2">{quickStats.personalBest}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Weather Widget */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-slate-800">Weather</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-slate-800">{weatherData.location}</h3>
                  <div className="flex items-center justify-center my-4">
                    <Sun className="w-12 h-12 text-yellow-500 mr-4" />
                    <span className="text-4xl font-bold text-slate-800">{weatherData.temperature}°F</span>
                  </div>
                  <p className="text-slate-600">{weatherData.condition}</p>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-white p-2 rounded-lg border border-orange-100 text-center">
                    <Droplets className="w-5 h-5 text-blue-500 mx-auto" />
                    <p className="text-xs text-slate-600 mt-1">Humidity</p>
                    <p className="text-sm font-semibold">{weatherData.humidity}</p>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-orange-100 text-center">
                    <Wind className="w-5 h-5 text-blue-500 mx-auto" />
                    <p className="text-xs text-slate-600 mt-1">Wind</p>
                    <p className="text-sm font-semibold">{weatherData.wind}</p>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-orange-100 text-center">
                    <Cloud className="w-5 h-5 text-blue-500 mx-auto" />
                    <p className="text-xs text-slate-600 mt-1">Rain</p>
                    <p className="text-sm font-semibold">{weatherData.precipitation}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {weatherData.forecast.map((day, index) => (
                    <div key={index} className="bg-white p-2 rounded-lg border border-orange-100 text-center">
                      <p className="text-xs font-semibold text-slate-800">{day.day}</p>
                      {day.condition === 'Sunny' && <Sun className="w-5 h-5 text-yellow-500 mx-auto my-1" />}
                      {day.condition === 'Partly Cloudy' && <Cloud className="w-5 h-5 text-gray-400 mx-auto my-1" />}
                      {day.condition === 'Rain' && <CloudRain className="w-5 h-5 text-blue-500 mx-auto my-1" />}
                      <p className="text-xs text-slate-800">{day.high}° / {day.low}°</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 