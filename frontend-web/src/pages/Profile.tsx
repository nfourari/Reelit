import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Fish, 
  Award, 
  Users, 
  MapPin, 
  Calendar, 
  Edit, 
  ThumbsUp, 
  MessageSquare
} from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('catches');
  
  // Mock user data
  const userData = {
    name: 'John Fisherman',
    username: '@johnfish',
    bio: 'Avid angler from Orlando, FL. Bass fishing enthusiast with 10+ years of experience. Always looking for the next big catch!',
    avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    coverPhoto: 'https://images.unsplash.com/photo-1621336337173-9a4c3908a25d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    stats: {
      totalCatches: 47,
      favoriteSpecies: 'Largemouth Bass',
      personalBest: '14.5 lbs',
      favoriteSpot: 'Lake Tohopekaliga',
      memberSince: 'January 2022'
    },
    catches: [
      {
        id: 1,
        fish: 'Largemouth Bass',
        weight: '8.2 lbs',
        location: 'Lake Tohopekaliga',
        time: '2 days ago',
        likes: 24,
        comments: 5,
        image: 'https://images.unsplash.com/photo-1594804233323-5f7b3b3a1e29?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
      },
      {
        id: 2,
        fish: 'Bluegill',
        weight: '1.5 lbs',
        location: 'Butler Chain of Lakes',
        time: '1 week ago',
        likes: 18,
        comments: 3,
        image: 'https://images.unsplash.com/photo-1595503240812-7286dafaddc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
      },
      {
        id: 3,
        fish: 'Crappie',
        weight: '2.3 lbs',
        location: 'Johns Lake',
        time: '2 weeks ago',
        likes: 15,
        comments: 2,
        image: 'https://images.unsplash.com/photo-1545804217-2f32e4944f0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
      }
    ],
    friends: [
      { id: 1, name: 'Carlos M.', avatar: '/placeholder.svg', status: 'online' },
      { id: 2, name: 'Maria S.', avatar: '/placeholder.svg', status: 'offline' },
      { id: 3, name: 'Tommy J.', avatar: '/placeholder.svg', status: 'online' },
      { id: 4, name: 'Alex D.', avatar: '/placeholder.svg', status: 'offline' },
      { id: 5, name: 'Jamie L.', avatar: '/placeholder.svg', status: 'online' }
    ],
    achievements: [
      { id: 1, name: 'First Catch', description: 'Logged your first catch', icon: 'Fish', date: 'Jan 15, 2022' },
      { id: 2, name: 'Bass Master', description: 'Caught 10 bass over 5 lbs', icon: 'Award', date: 'Mar 22, 2022' },
      { id: 3, name: 'Explorer', description: 'Fished in 5 different locations', icon: 'MapPin', date: 'May 10, 2022' },
      { id: 4, name: 'Social Angler', description: 'Connected with 5 friends', icon: 'Users', date: 'Jun 5, 2022' },
      { id: 5, name: 'Trophy Hunter', description: 'Caught a fish over 10 lbs', icon: 'Award', date: 'Aug 17, 2022' }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-cyan-50">
      <Navigation />
      
      {/* Cover Photo */}
      <div 
        className="h-64 w-full bg-cover bg-center"
        style={{ backgroundImage: `url('${userData.coverPhoto}')` }}
      >
        <div className="h-full w-full bg-black/30 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-4">
            <Button variant="outline" className="bg-white/80 hover:bg-white float-right">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-end -mt-20 mb-8">
          <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white">
            <img 
              src={userData.avatar} 
              alt={userData.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
            <h1 className="text-3xl font-bold text-slate-800">{userData.name}</h1>
            <p className="text-slate-500">{userData.username}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Bio & Stats */}
          <div>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-slate-800">About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">{userData.bio}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-slate-800">Fishing Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Fish className="w-5 h-5 text-primary mr-3" />
                    <div>
                      <p className="text-sm text-slate-500">Total Catches</p>
                      <p className="font-semibold text-slate-800">{userData.stats.totalCatches}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Fish className="w-5 h-5 text-primary mr-3" />
                    <div>
                      <p className="text-sm text-slate-500">Favorite Species</p>
                      <p className="font-semibold text-slate-800">{userData.stats.favoriteSpecies}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Award className="w-5 h-5 text-primary mr-3" />
                    <div>
                      <p className="text-sm text-slate-500">Personal Best</p>
                      <p className="font-semibold text-slate-800">{userData.stats.personalBest}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-primary mr-3" />
                    <div>
                      <p className="text-sm text-slate-500">Favorite Spot</p>
                      <p className="font-semibold text-slate-800">{userData.stats.favoriteSpot}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-primary mr-3" />
                    <div>
                      <p className="text-sm text-slate-500">Member Since</p>
                      <p className="font-semibold text-slate-800">{userData.stats.memberSince}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column - Tabs */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Tabs defaultValue="catches" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="catches">
                      <Fish className="w-4 h-4 mr-2" />
                      My Catches
                    </TabsTrigger>
                    <TabsTrigger value="friends">
                      <Users className="w-4 h-4 mr-2" />
                      Friends
                    </TabsTrigger>
                    <TabsTrigger value="achievements">
                      <Award className="w-4 h-4 mr-2" />
                      Achievements
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="catches" className="mt-6">
                    <div className="space-y-6">
                      {userData.catches.map((catch_) => (
                        <div key={catch_.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                          <div className="flex justify-between mb-2">
                            <h3 className="font-semibold text-slate-800">{catch_.fish}</h3>
                            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                              {catch_.time}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-slate-600">
                                <span className="font-medium">Weight:</span> {catch_.weight}
                              </p>
                              <p className="text-sm text-slate-600">
                                <span className="font-medium">Location:</span> {catch_.location}
                              </p>
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
                            <div>
                              <img 
                                src={catch_.image} 
                                alt={catch_.fish} 
                                className="w-full h-32 object-cover rounded-lg"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="friends" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userData.friends.map((friend) => (
                        <div key={friend.id} className="flex items-center p-3 bg-white rounded-lg border border-slate-100 hover:shadow-md transition-shadow">
                          <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div className="ml-3">
                            <p className="font-semibold text-slate-800">{friend.name}</p>
                            <div className="flex items-center">
                              <span className={`w-2 h-2 rounded-full ${friend.status === 'online' ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                              <span className="text-xs text-slate-500 ml-1">{friend.status === 'online' ? 'Online' : 'Offline'}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="ml-auto">
                            View Profile
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="achievements" className="mt-6">
                    <div className="space-y-4">
                      {userData.achievements.map((achievement) => (
                        <div key={achievement.id} className="flex items-start p-4 bg-white rounded-lg border border-slate-100 hover:shadow-md transition-shadow">
                          <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                            {achievement.icon === 'Fish' && <Fish className="w-5 h-5 text-white" />}
                            {achievement.icon === 'Award' && <Award className="w-5 h-5 text-white" />}
                            {achievement.icon === 'MapPin' && <MapPin className="w-5 h-5 text-white" />}
                            {achievement.icon === 'Users' && <Users className="w-5 h-5 text-white" />}
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <h3 className="font-semibold text-slate-800">{achievement.name}</h3>
                              <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-700">
                                {achievement.date}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600">{achievement.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 