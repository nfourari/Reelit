import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Fish, 
  Trophy,
  Cloud,
  Droplets,
  Wind,
  Sun,
  MapPin,
  Calendar,
  Loader2
} from 'lucide-react';

interface UserCatch
{
  _id: string;
  catchName: string;
  catchWeight: number;
  catchLength: number;
  catchLocation: string;
  catchComment?: string;
  caughtAt: string;
  imageUrl?: string;
}

interface UserStats
{
  totalCatches: number;
  personalBest: string;
}



const Dashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [userCatches, setUserCatches] = useState<UserCatch[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({ totalCatches: 0, 
                                                          personalBest: 'No catches yet (Add a catch to get your stats)'}); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [catchesLoading, setCatchesLoading] = useState(true);


  const getAuthToken = () => localStorage.getItem('authToken');
  
  // Calculate user stats from catches
  const calculateStats = (catches: UserCatch[]): UserStats =>
  {
    if (catches.length === 0)
    {
      return { totalCatches: 0, personalBest: 'No catches yet' };
    }

    const heaviestCatch = catches.reduce((previous, current) =>
    (previous.catchWeight > current.catchWeight) ? previous : current
    );

    return
    {
      totalCatches: catches.length;
      personalBest: `${heaviestCatch.catchWeight} lbs ${heaviestCatch.catchName}`
    };
  };
  
  // Fetch user's catches
  const fetchUserCatches = async () =>
  {
    try
    {
      const token = getAuthToken();
      if (!token)
      {
        setCatchesLoading(false);
        return;
      }

      const response = await axios.get('/api/catches', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      
        if (response.data.success)
        {
          const catches = response.data.data;
          setUserCatches(catches.slice(0, 8));    // Show recent 8 catches on dashboard
          setUserStats(calculateStats(catches));
        }
    }
    catch (error)
    {
      console.error('Error fetching catches:', error);

      // Fallback to demo data if API fails
      setUserStats( { totalCatches: 0, personalBest: 'No catches yet'});
    }

    finally
    {
      setCatchesLoading(false);
    }
  };


  // // Mock data for personal catches
  // const personalCatches = [
  //   {
  //     id: 1,
  //     fish: 'Largemouth Bass',
  //     weight: '8.2 lbs',
  //     location: 'Lake Tohopekaliga',
  //     image: 'data:image/jpeg;base64,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'
  //   },
  //   {
  //     id: 2,
  //     fish: 'Snook',
  //     weight: '12.5 lbs',
  //     location: 'Mosquito Lagoon',
  //     image: 'https://images.unsplash.com/photo-1595503240812-7286dafaddc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  //   },
  //   {
  //     id: 3,
  //     fish: 'Redfish',
  //     weight: '6.8 lbs',
  //     location: 'Indian River',
  //     image: 'data:image/jpeg;base64,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'
  //   }
  // ];

  // // Mock data for quick stats
  // const quickStats = {
  //   totalCatches: 47,
  //   personalBest: '14.5 lbs Largemouth Bass'
  // };


  // Fetch weather data
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        // Using a free weather API that doesn't require authentication
        const response = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=28.5383&longitude=-81.3792&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch`
        );
        
        setWeatherData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch weather data. Please try again later.');
        setLoading(false);
        console.error('Error fetching weather data:', err);
      }
    };

    fetchWeatherData();
    fetchUserCatches();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => 
  {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Weather code to description mapping
  const getWeatherDescription = (code) => {
    const weatherCodes = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      56: 'Light freezing drizzle',
      57: 'Dense freezing drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      66: 'Light freezing rain',
      67: 'Heavy freezing rain',
      71: 'Slight snow fall',
      73: 'Moderate snow fall',
      75: 'Heavy snow fall',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail'
    };
    return weatherCodes[code] || 'Unknown';
  };

  // Get weather icon based on weather code
  const getWeatherIcon = (code) => {
    if (code === 0) return <Sun className="w-12 h-12 text-yellow-500" />;
    if (code === 1 || code === 2) return <Sun className="w-12 h-12 text-yellow-500" />;
    if (code === 3) return <Cloud className="w-12 h-12 text-gray-400" />;
    if (code === 45 || code === 48) return <Cloud className="w-12 h-12 text-gray-400" />;
    if ([51, 53, 55, 56, 57].includes(code)) return <Cloud className="w-12 h-12 text-blue-400" />;
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return <Cloud className="w-12 h-12 text-blue-500" />;
    if ([71, 73, 75, 77, 85, 86].includes(code)) return <Cloud className="w-12 h-12 text-blue-300" />;
    if ([95, 96, 99].includes(code)) return <Cloud className="w-12 h-12 text-purple-500" />;
    return <Sun className="w-12 h-12 text-yellow-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Dashboard</h1>
          <p className="text-slate-600">Welcome back! Here's your fishing overview.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column - Recent Catches */}
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-slate-800 flex items-center">
                  <Fish className="w-6 h-6 mr-2 text-primary" />
                  Recent Catches
                </CardTitle>
              </CardHeader>
              <CardContent>
                {catchesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span className="ml-2 text-slate-600">Loading your catches...</span>
                  </div>
                ) : userCatches.length === 0 ? (
                  <div className="text-center py-8">
                    <Fish className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 text-lg">No catches yet!</p>
                    <p className="text-slate-500">Head out to the water and start logging your catches.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {userCatches.map((catch_item) => (
                      <div key={catch_item._id} className="bg-white border border-orange-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                        {catch_item.imageUrl && (
                          <img 
                            src={catch_item.imageUrl} 
                            alt={catch_item.catchName}
                            className="w-full h-32 object-cover"
                          />
                        )}
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-slate-800">{catch_item.catchName}</h3>
                            <span className="text-primary font-bold">{catch_item.catchWeight} lbs</span>
                          </div>
                          
                          <div className="space-y-1 text-sm text-slate-600">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span>{catch_item.catchLocation}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              <span>{formatDate(catch_item.caughtAt)}</span>
                            </div>
                            {catch_item.catchLength && (
                              <div className="text-slate-500">
                                Length: {catch_item.catchLength}"
                              </div>
                            )}
                          </div>
                          
                          {catch_item.catchComment && (
                            <p className="text-sm text-slate-600 mt-2 italic">
                              "{catch_item.catchComment}"
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            {/* Quick Stats */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-slate-800">Your Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-orange-100">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Total Catches</span>
                      <Fish className="w-5 h-5 text-primary p-0.5" />
                    </div>
                    <p className="text-2xl font-bold text-primary mt-2">{userStats.totalCatches}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-orange-100">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Personal Best</span>
                      <Trophy className="w-5 h-5 text-primary p-0.5" />
                    </div>
                    <p className="text-sm font-bold text-primary mt-2">{userStats.personalBest}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weather Widget */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-slate-800">Weather in Orlando</CardTitle>
              </CardHeader>
              <CardContent>
                {loading && <p className="text-center text-slate-600">Loading weather data...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}
                
                {weatherData && weatherData.current && (
                  <>
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-primary mb-2">
                        {Math.round(weatherData.current.temperature_2m)}°F
                      </div>
                      <div className="text-slate-600">
                        Feels like {Math.round(weatherData.current.apparent_temperature)}°F
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Droplets className="w-5 h-5 text-blue-500 mr-2" />
                          <span className="text-slate-600">Humidity</span>
                        </div>
                        <span className="font-semibold">{weatherData.current.relative_humidity_2m}%</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Wind className="w-5 h-5 text-slate-500 mr-2" />
                          <span className="text-slate-600">Wind</span>
                        </div>
                        <span className="font-semibold">{weatherData.current.wind_speed_10m} mph</span>
                      </div>

                      {weatherData.current.precipitation > 0 && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Cloud className="w-5 h-5 text-gray-500 mr-2" />
                            <span className="text-slate-600">Precipitation</span>
                          </div>
                          <span className="font-semibold">{weatherData.current.precipitation} in</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center">
                        <Sun className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-green-800 font-medium">
                          {weatherData.current.temperature_2m > 70 && weatherData.current.wind_speed_10m < 15 
                            ? "Great fishing conditions!" 
                            : "Check conditions before heading out"}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;





//   return (
//     <div className="min-h-screen bg-gradient-to-b from-orange-50 to-cyan-50">
//       <Navigation />
      
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <h1 className="text-4xl font-bold text-slate-800 mb-8">Your Dashboard</h1>
        
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Personal Catch History */}
//           <div className="lg:col-span-2">
//             <Card className="mb-8">
//               <CardHeader>
//                 <CardTitle className="text-2xl font-semibold text-slate-800">Recent Catches</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-6">
//                   {personalCatches.map((catch_) => (
//                     <div key={catch_.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
//                       <div className="flex items-start space-x-4">
//                         <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
//                           <Fish className="w-5 h-5 text-white" />
//                         </div>
//                         <div className="flex-1">
//                           <span className="font-semibold text-slate-800">{catch_.fish}</span>
                          
//                           <p className="text-slate-600 mt-1">
//                             <span className="font-semibold text-primary">{catch_.weight}</span>
//                             {' caught at '} 
//                             <span className="font-semibold text-slate-700">{catch_.location}</span>
//                           </p>
                          
//                           {catch_.image && (
//                             <div className="mt-3 rounded-lg overflow-hidden">
//                               <img 
//                                 src={catch_.image} 
//                                 alt={`${catch_.fish} catch`} 
//                                 className="w-full h-64 object-cover"
//                               />
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
          
//           <div>
//             {/* Quick Stats */}
//             <Card className="mb-8">
//               <CardHeader>
//                 <CardTitle className="text-2xl font-semibold text-slate-800">Your Stats</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="bg-white p-4 rounded-lg border border-orange-100">
//                     <div className="flex items-center justify-between">
//                       <span className="text-slate-600">Total Catches</span>
//                       <Fish className="w-5 h-5 text-primary p-0.5" />
//                     </div>
//                     <p className="text-2xl font-bold text-primary mt-2">{quickStats.totalCatches}</p>
//                   </div>
//                   <div className="bg-white p-4 rounded-lg border border-orange-100">
//                     <div className="flex items-center justify-between">
//                       <span className="text-slate-600">Personal Best</span>
//                       <Trophy className="w-5 h-5 text-primary p-0.5" />
//                     </div>
//                     <p className="text-sm font-bold text-primary mt-2">{quickStats.personalBest}</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Weather Widget */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-2xl font-semibold text-slate-800">Weather in Orlando</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {loading && <p className="text-center text-slate-600">Loading weather data...</p>}
//                 {error && <p className="text-center text-red-500">{error}</p>}
                
//                 {weatherData && weatherData.current && (
//                   <>
//                     <div className="text-center mb-4">
//                       <div className="flex items-center justify-center my-4">
//                         {getWeatherIcon(weatherData.current.weather_code)}
//                         <span className="text-4xl font-bold text-slate-800 ml-4">
//                           {Math.round(weatherData.current.temperature_2m)}°F
//                         </span>
//                       </div>
//                       <p className="text-slate-600">
//                         {getWeatherDescription(weatherData.current.weather_code)}
//                       </p>
//                     </div>
                    
//                     <div className="grid grid-cols-3 gap-2">
//                       <div className="bg-white p-2 rounded-lg border border-orange-100 text-center">
//                         <Droplets className="w-5 h-5 text-blue-500 mx-auto" />
//                         <p className="text-xs text-slate-600 mt-1">Humidity</p>
//                         <p className="text-sm font-semibold">{weatherData.current.relative_humidity_2m}%</p>
//                       </div>
//                       <div className="bg-white p-2 rounded-lg border border-orange-100 text-center">
//                         <Wind className="w-5 h-5 text-blue-500 mx-auto" />
//                         <p className="text-xs text-slate-600 mt-1">Wind</p>
//                         <p className="text-sm font-semibold">{Math.round(weatherData.current.wind_speed_10m)} mph</p>
//                       </div>
//                       <div className="bg-white p-2 rounded-lg border border-orange-100 text-center">
//                         <Sun className="w-5 h-5 text-yellow-500 mx-auto" />
//                         <p className="text-xs text-slate-600 mt-1">Feels Like</p>
//                         <p className="text-sm font-semibold">{Math.round(weatherData.current.apparent_temperature)}°F</p>
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard; 