import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  User, 
  Award, 
  Fish, 
  Send,
  Filter
} from 'lucide-react';

const SocialFeed = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [commentInput, setCommentInput] = useState({});
  
  // Mock data for feed items
  const feedItems = [
    {
      id: 1,
      type: 'catch',
      user: 'Carlos M.',
      avatar: '/placeholder.svg',
      action: 'caught a',
      fish: 'Largemouth Bass',
      weight: '8.2 lbs',
      location: 'Lake Tohopekaliga',
      time: '2 hours ago',
      likes: 24,
      comments: [
        { id: 1, user: 'Maria S.', text: 'Nice catch!', time: '1 hour ago' },
        { id: 2, user: 'Tommy J.', text: 'What bait did you use?', time: '30 minutes ago' }
      ],
      image: 'https://images.unsplash.com/photo-1594804233323-5f7b3b3a1e29?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      liked: false
    },
    {
      id: 2,
      type: 'achievement',
      user: 'Tommy J.',
      avatar: '/placeholder.svg',
      action: 'earned the badge',
      achievement: 'Master Angler',
      time: '4 hours ago',
      likes: 18,
      comments: [],
      image: null,
      liked: false
    },
    {
      id: 3,
      type: 'catch',
      user: 'Maria S.',
      avatar: '/placeholder.svg',
      action: 'caught a',
      fish: 'Snook',
      weight: '12.5 lbs',
      location: 'Mosquito Lagoon',
      time: '6 hours ago',
      likes: 32,
      comments: [
        { id: 3, user: 'Carlos M.', text: 'Wow, that\'s a big one!', time: '5 hours ago' }
      ],
      image: 'https://images.unsplash.com/photo-1595503240812-7286dafaddc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      liked: true
    },
    {
      id: 4,
      type: 'friend',
      user: 'Alex D.',
      avatar: '/placeholder.svg',
      action: 'became friends with',
      friend: 'Jamie L.',
      time: '1 day ago',
      likes: 12,
      comments: [],
      image: null,
      liked: false
    }
  ];

  // Handle tab change
  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  // Handle like action
  const handleLike = (id) => {
    // In a real app, you would update the state and make an API call
    console.log(`Liked post ${id}`);
  };

  // Handle comment input change
  const handleCommentInputChange = (id, value) => {
    setCommentInput({
      ...commentInput,
      [id]: value
    });
  };

  // Handle comment submission
  const handleCommentSubmit = (id) => {
    if (commentInput[id]) {
      // In a real app, you would update the state and make an API call
      console.log(`Added comment to post ${id}: ${commentInput[id]}`);
      // Clear input after submission
      setCommentInput({
        ...commentInput,
        [id]: ''
      });
    }
  };

  // Filter feed items based on active tab
  const filteredFeedItems = feedItems.filter(item => {
    if (activeTab === 'all') return true;
    return item.type === activeTab;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-cyan-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-8">Social Feed</h1>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-semibold text-slate-800">Recent Activity</CardTitle>
              <div className="flex items-center">
                <Filter className="w-4 h-4 mr-2 text-slate-500" />
                <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="catch">Catches</TabsTrigger>
                    <TabsTrigger value="achievement">Achievements</TabsTrigger>
                    <TabsTrigger value="friend">Friends</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {filteredFeedItems.map((item) => (
                <div key={item.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-semibold text-slate-800">{item.user}</span>
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                          {item.time}
                        </Badge>
                      </div>
                      
                      <p className="text-slate-600 mt-1">
                        {item.action} {item.type === 'catch' ? (
                          <>
                            <span className="font-semibold text-primary">{item.fish}</span> 
                            {' weighing '} 
                            <span className="font-semibold text-primary">{item.weight}</span>
                            {' at '} 
                            <span className="font-semibold text-slate-700">{item.location}</span>
                          </>
                        ) : item.type === 'achievement' ? (
                          <>
                            <span className="font-semibold text-primary">{item.achievement}</span>
                          </>
                        ) : (
                          <>
                            <span className="font-semibold text-primary">{item.friend}</span>
                          </>
                        )}
                      </p>
                      
                      {item.image && (
                        <div className="mt-3 rounded-lg overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={`${item.user}'s post`} 
                            className="w-full h-64 object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center mt-4 space-x-4">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`${item.liked ? 'text-primary' : 'text-slate-600 hover:text-primary'}`}
                          onClick={() => handleLike(item.id)}
                        >
                          <ThumbsUp className={`w-4 h-4 mr-1 ${item.liked ? 'fill-primary' : ''}`} />
                          {item.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-slate-600 hover:text-primary">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          {item.comments.length}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-slate-600 hover:text-primary">
                          <Share2 className="w-4 h-4 mr-1" />
                          Share
                        </Button>
                      </div>
                      
                      {/* Comments Section */}
                      {item.comments.length > 0 && (
                        <div className="mt-4 space-y-3 pl-4 border-l-2 border-slate-100">
                          {item.comments.map((comment) => (
                            <div key={comment.id} className="text-sm">
                              <div className="flex justify-between">
                                <span className="font-semibold text-slate-800">{comment.user}</span>
                                <span className="text-xs text-slate-500">{comment.time}</span>
                              </div>
                              <p className="text-slate-600">{comment.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Add Comment */}
                      <div className="mt-4 flex space-x-2">
                        <Input
                          placeholder="Add a comment..."
                          value={commentInput[item.id] || ''}
                          onChange={(e) => handleCommentInputChange(item.id, e.target.value)}
                          className="flex-1"
                        />
                        <Button 
                          size="sm" 
                          onClick={() => handleCommentSubmit(item.id)}
                          disabled={!commentInput[item.id]}
                          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                        >
                          <Send className="w-4 h-4" />
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

export default SocialFeed; 