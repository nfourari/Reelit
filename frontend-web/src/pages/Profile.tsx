import React, { useState, useRef } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Fish, 
  Award, 
  Calendar, 
  Camera,
  ImageIcon,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';

// Define the user data type
interface UserData {
  name: string;
  avatar: string;
  coverPhoto: string;
  stats: {
    totalCatches: number;
    personalBest: string;
    memberSince: string;
  };
  catches: Array<{
    id: number;
    fish: string;
    weight: string;
    location: string;
    image: string;
  }>;
}

const Profile = () => {
  // Hardcoded user data to reduce API calls
  const [userData, setUserData] = useState<UserData>({
    name: 'John Fisherman',
    avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    coverPhoto: 'https://images.unsplash.com/photo-1621336337173-9a4c3908a25d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    stats: {
      totalCatches: 47,
      personalBest: '14.5 lbs',
      memberSince: 'January 2022'
    },
    catches: [
      {
        id: 1,
        fish: 'Largemouth Bass',
        weight: '8.2 lbs',
        location: 'Lake Tohopekaliga',
        image: 'https://images.unsplash.com/photo-1594804233323-5f7b3b3a1e29?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
      },
      {
        id: 2,
        fish: 'Bluegill',
        weight: '1.5 lbs',
        location: 'Butler Chain of Lakes',
        image: 'https://images.unsplash.com/photo-1595503240812-7286dafaddc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
      },
      {
        id: 3,
        fish: 'Crappie',
        weight: '2.3 lbs',
        location: 'Johns Lake',
        image: 'https://images.unsplash.com/photo-1545804217-2f32e4944f0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
      },
      {
        id: 4,
        fish: 'Spotted Bass',
        weight: '3.7 lbs',
        location: 'Conway Chain of Lakes',
        image: 'https://images.unsplash.com/photo-1545804214-fe7c11d39c76?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
      },
      {
        id: 5,
        fish: 'Redfish',
        weight: '6.2 lbs',
        location: 'Mosquito Lagoon',
        image: 'https://images.unsplash.com/photo-1587604960744-c5f3f3f8d2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
      }
    ]
  });

  // Refs for file inputs
  const coverPhotoInputRef = useRef<HTMLInputElement>(null);
  const profilePictureInputRef = useRef<HTMLInputElement>(null);

  // Handle cover photo change
  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          setUserData(prev => ({
            ...prev,
            coverPhoto: result
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile picture change
  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          setUserData(prev => ({
            ...prev,
            avatar: result
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const triggerCoverPhotoUpload = () => {
    if (coverPhotoInputRef.current) {
      coverPhotoInputRef.current.click();
    }
  };

  // Trigger profile picture input click
  const triggerProfilePictureUpload = () => {
    if (profilePictureInputRef.current) {
      profilePictureInputRef.current.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-cyan-50">
      <Navigation />
      
      {/* Cover Photo */}
      <div 
        className="h-64 w-full bg-cover bg-center relative"
        style={{ backgroundImage: `url('${userData.coverPhoto}')` }}
      >
        <div className="h-full w-full bg-black/30 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-4">
            <Button 
              variant="outline" 
              className="bg-white/80 hover:bg-white float-right"
              onClick={triggerCoverPhotoUpload}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Change Background
            </Button>
            <input 
              type="file" 
              ref={coverPhotoInputRef} 
              onChange={handleCoverPhotoChange} 
              accept="image/*" 
              className="hidden"
            />
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-end -mt-20 mb-8">
          <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white relative group">
            <img 
              src={userData.avatar} 
              alt={userData.name} 
              className="w-full h-full object-cover"
            />
            <div 
              className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={triggerProfilePictureUpload}
            >
              <Camera className="w-8 h-8 text-white" />
            </div>
            <input 
              type="file" 
              ref={profilePictureInputRef} 
              onChange={handleProfilePictureChange} 
              accept="image/*" 
              className="hidden"
            />
          </div>
          <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
            <h1 className="text-3xl font-bold text-slate-800">{userData.name}</h1>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Fishing Stats */}
          <div>
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
                    <Award className="w-5 h-5 text-primary mr-3" />
                    <div>
                      <p className="text-sm text-slate-500">Personal Best</p>
                      <p className="font-semibold text-slate-800">{userData.stats.personalBest}</p>
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
          
          {/* Right Column - My Catches */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-slate-800 flex items-center">
                  <Fish className="w-5 h-5 mr-2" />
                  My Catches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {userData.catches.map((catch_) => (
                    <div key={catch_.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                      <h3 className="font-semibold text-slate-800 mb-2">{catch_.fish}</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-slate-600">
                            <span className="font-medium">Weight:</span> {catch_.weight}
                          </p>
                          <p className="text-sm text-slate-600">
                            <span className="font-medium">Location:</span> {catch_.location}
                          </p>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 