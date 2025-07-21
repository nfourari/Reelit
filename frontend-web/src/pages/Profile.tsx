import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { 
  User, 
  Fish, 
  Award, 
  Calendar, 
  Camera,
  ImageIcon,
  X,
  Loader2
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
import { getUserProfile, UserProfile, UserServiceError, clearAuth } from '@/services/userService';


// Define the user data type for UI display
interface UserData {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  coverPhoto: string;
  isEmailVerfied: boolean;
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

  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Refs for file inputs
  const coverPhotoInputRef = useRef<HTMLInputElement>(null);
  const profilePictureInputRef = useRef<HTMLInputElement>(null);

  // Fetch user profile on component mount
  useEffect( () => 
    {
      const fetchProfile = async () =>
      {
        try
        {
          setIsLoading(true);
          setError(null);

          const profile: UserProfile = await getUserProfile();

          // Transform backend data to UI format
          const transformedData: UserData =
          {
            name: `${profile.firstName} ${profile.lastName}`,
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email,
            isEmailVerfied: profile.isEmailVerified,
            avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
            coverPhoto: 'https://images.unsplash.com/photo-1621336337173-9a4c3908a25d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            stats:
            {
              totalCatches: profile.totalCatches,
              personalBest: 'No catches yet',
              memberSince: new Date(profile.createdAt).toLocaleDateString('en-US',
                {
                  year: 'numeric',
                  month: 'long'
                })
            },
            catches: [] // TODO: Fetch user's catches from catches API
          };

          setUserData(transformedData);
        } 
        catch (error)
        {
          console.error('Profile fetch error:', error);

          if (error instanceof UserServiceError)
          {
            // Token expired or invalid
            if (error.status === 401)
            {
              clearAuth();
              toast({
                title: "Session Expired",
                description: "Please log in again to continue",
                variant: "destructive",
              });
              navigate('/login');
              return;
            }
            else if (error.status === 404)
            {
              toast({
                title: "Error Loading Profile",
                description: error.message,
                variant: "destructive",
              });
            }
            else
            {
              toast({
                title: "Error Loading Profile",
                description: error.message,
                variant: "destructive",
              });
            }
          }
          else 
          {
            toast({
              title: "Network Error",
              description: "Unable to load your profile. Please try again.",
              variant: "destructive",
            });
          }

          setError(error instanceof Error ? error.message : 'Unknown error occurred');
        }
        finally
        {
          setIsLoading(false);
        }
      };
      
      fetchProfile();
    }, [navigate]);


  // Hardcoded user data to reduce API calls
  // const [userData, setUserData] = useState<UserData>({
  //   name: 'John Fisherman',
  //   avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
  //   coverPhoto: 'https://images.unsplash.com/photo-1621336337173-9a4c3908a25d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  //   stats: {
  //     totalCatches: 47,
  //     personalBest: '14.5 lbs',
  //     memberSince: 'January 2022'
  //   },
  //   catches: [
  //     {
  //       id: 1,
  //       fish: 'Largemouth Bass',
  //       weight: '8.2 lbs',
  //       location: 'Lake Tohopekaliga',
  //       image: 'https://images.unsplash.com/photo-1594804233323-5f7b3b3a1e29?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  //     },
  //     {
  //       id: 2,
  //       fish: 'Bluegill',
  //       weight: '1.5 lbs',
  //       location: 'Butler Chain of Lakes',
  //       image: 'https://images.unsplash.com/photo-1595503240812-7286dafaddc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  //     },
  //     {
  //       id: 3,
  //       fish: 'Crappie',
  //       weight: '2.3 lbs',
  //       location: 'Johns Lake',
  //       image: 'https://images.unsplash.com/photo-1545804217-2f32e4944f0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  //     },
  //     {
  //       id: 4,
  //       fish: 'Spotted Bass',
  //       weight: '3.7 lbs',
  //       location: 'Conway Chain of Lakes',
  //       image: 'https://images.unsplash.com/photo-1545804214-fe7c11d39c76?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  //     },
  //     {
  //       id: 5,
  //       fish: 'Redfish',
  //       weight: '6.2 lbs',
  //       location: 'Mosquito Lagoon',
  //       image: 'https://images.unsplash.com/photo-1587604960744-c5f3f3f8d2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  //     }
  //   ]
  // });


  // Handle cover photo change
  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && userData) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          setUserData(prev => prev ? ({
            ...prev,
            coverPhoto: result
          }) : null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile picture change
  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && userData) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          setUserData(prev => prev ? ({
            ...prev,
            avatar: result
          }) : null);
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

  // Loading state
  if (isLoading)
  {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-cyan-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-slate-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !userData)
  {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-cyan-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Profile</h2>
              <p className="text-red-600 mb-4">{error || 'An unexpected error occurred'}</p>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="mr-2"
              >
                Try Again
              </Button>
              <Button 
                onClick={() => navigate('/dashboard')}
                variant="default"
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <p className="text-slate-600">{userData.email}</p>
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
                {userData.catches.length > 0 ? (
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
                ) : (
                  <div className="text-center py-8">
                    <Fish className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-600 mb-2">No catches yet</h3>
                    <p className="text-slate-500 mb-4">Start your fishing journey and log your first catch!</p>
                    <Button 
                      onClick={() => navigate('/add-catch')}
                      className="inline-flex items-center"
                    >
                      <Fish className="w-4 h-4 mr-2" />
                      Add Your First Catch
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 