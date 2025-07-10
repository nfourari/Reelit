import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  User, 
  ThumbsUp, 
  MessageSquare, 
  UserPlus, 
  Check, 
  X, 
  Info
} from 'lucide-react';

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: 'friend_request',
      user: 'Alex D.',
      avatar: '/placeholder.svg',
      action: 'sent you a friend request',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'like',
      user: 'Maria S.',
      avatar: '/placeholder.svg',
      action: 'liked your catch',
      catch: 'Largemouth Bass (8.2 lbs)',
      time: '4 hours ago',
      read: false
    },
    {
      id: 3,
      type: 'comment',
      user: 'Tommy J.',
      avatar: '/placeholder.svg',
      action: 'commented on your catch',
      catch: 'Bluegill (1.5 lbs)',
      comment: 'Nice catch! What bait did you use?',
      time: '1 day ago',
      read: true
    },
    {
      id: 4,
      type: 'system',
      title: 'App Update',
      message: 'Shuzzy+ has been updated to version 2.1.0 with new features!',
      time: '2 days ago',
      read: true
    },
    {
      id: 5,
      type: 'friend_request',
      user: 'Jamie L.',
      avatar: '/placeholder.svg',
      action: 'sent you a friend request',
      time: '3 days ago',
      read: true
    },
    {
      id: 6,
      type: 'system',
      title: 'New Fishing Spot Added',
      message: 'A new fishing spot "Johns Lake" has been added near your location.',
      time: '1 week ago',
      read: true
    }
  ];

  // Handle tab change
  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'friend_requests' && notification.type === 'friend_request') return true;
    if (activeTab === 'activity' && (notification.type === 'like' || notification.type === 'comment')) return true;
    if (activeTab === 'updates' && notification.type === 'system') return true;
    return false;
  });

  // Handle friend request actions
  const handleFriendRequest = (id, action) => {
    console.log(`Friend request ${id} ${action}`);
    // In a real app, you would make an API call here
  };

  // Mark notification as read
  const markAsRead = (id) => {
    console.log(`Marking notification ${id} as read`);
    // In a real app, you would make an API call here
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-cyan-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800">Notifications</h1>
          <Button variant="outline" size="sm">
            Mark all as read
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-semibold text-slate-800">Recent Notifications</CardTitle>
              <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="friend_requests">Friend Requests</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="updates">Updates</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 rounded-lg border ${notification.read ? 'bg-white border-slate-100' : 'bg-orange-50 border-orange-100'}`}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    {!notification.read && (
                      <Badge className="float-right bg-primary">New</Badge>
                    )}
                    
                    <div className="flex items-start space-x-4">
                      {notification.type === 'system' ? (
                        <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                          <Bell className="w-5 h-5 text-white" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        {notification.type === 'system' ? (
                          <>
                            <h3 className="font-semibold text-slate-800">{notification.title}</h3>
                            <p className="text-slate-600 mt-1">{notification.message}</p>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center">
                              <span className="font-semibold text-slate-800">{notification.user}</span>
                              <span className="text-slate-600 ml-1">{notification.action}</span>
                            </div>
                            
                            {notification.catch && (
                              <p className="text-slate-600 mt-1">
                                <span className="font-medium text-primary">{notification.catch}</span>
                              </p>
                            )}
                            
                            {notification.comment && (
                              <p className="text-slate-600 mt-1 italic">"{notification.comment}"</p>
                            )}
                            
                            {notification.type === 'friend_request' && (
                              <div className="mt-3 flex space-x-2">
                                <Button 
                                  size="sm" 
                                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                                  onClick={() => handleFriendRequest(notification.id, 'accept')}
                                >
                                  <Check className="w-4 h-4 mr-1" />
                                  Accept
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleFriendRequest(notification.id, 'decline')}
                                >
                                  <X className="w-4 h-4 mr-1" />
                                  Decline
                                </Button>
                              </div>
                            )}
                          </>
                        )}
                        
                        <p className="text-xs text-slate-500 mt-2">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Info className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500">No notifications in this category</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Notifications; 