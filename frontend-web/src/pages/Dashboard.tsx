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


  const getAuthToken = () => localStorage.getItem('token');
  
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

    return {
      totalCatches: catches.length,
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