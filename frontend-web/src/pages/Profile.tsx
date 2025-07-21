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
  MapPin,
  Ruler,
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
import axios from 'axios';


// Define the user data type for UI display
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

interface UserProfile
{
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  totalCatches: number;
  createdAt: string;
  isEmailVerified: boolean;
}

interface UserStats
{
  totalCatches: number;
  personalBest: string;
  memberSince: string;
}


const Profile = () => 
{
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userCatches, setUserCatches] = useState<UserCatch[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalCatches: 0,
    personalBest: 'No catches yet',
    memberSince: 'Recently'
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [catchesLoading, setCatchesLoading] = useState<boolean>(true);
  const [selectedCatch, setSelectedCatch] = useState<UserCatch | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Refs for file inputs
  const coverPhotoInputRef = useRef<HTMLInputElement>(null);
  const profilePictureInputRef = useRef<HTMLInputElement>(null);

  const getAuthToken = () => localStorage.getItem('token');

  // Calculate user stats from catches and profile
  const calculateStats = (catches: UserCatch[], profile: UserProfile | null): UserStats => {
    if (catches.length === 0) {
      return { 
        totalCatches: 0, 
        personalBest: 'No catches yet',
        memberSince: profile ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'
      };
    }

    const heaviestCatch = catches.reduce((prev, current) => 
      (prev.catchWeight > current.catchWeight) ? prev : current
    );

    return {
      totalCatches: catches.length,
      personalBest: `${heaviestCatch.catchWeight} lbs ${heaviestCatch.catchName}`,
      memberSince: profile ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'
    };
  };

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast({
          title: "Session Expired",
          description: "Please log in again to continue",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      const response = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUserProfile(response.data);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      
      if (error.response?.status === 401) {
        toast({
          title: "Session Expired",
          description: "Please log in again to continue",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }
      
      toast({
        title: "Error Loading Profile",
        description: "Unable to load your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user's catches
  const fetchUserCatches = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setCatchesLoading(false);
        return;
      }

      const response = await axios.get('/api/catches', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const catches = response.data.data;
        setUserCatches(catches);
        setUserStats(calculateStats(catches, userProfile));
      }
    } catch (error) {
      console.error('Error fetching catches:', error);
    } finally {
      setCatchesLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (userProfile) {
      fetchUserCatches();
    }
  }, [userProfile]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };




  // Fetch user profile on component mount
  // useEffect( () => 
  //   {
  //     const fetchProfile = async () =>
  //     {
  //       try
  //       {
  //         setIsLoading(true);
  //         setError(null);

  //         const profile: UserProfile = await getUserProfile();

  //         // Transform backend data to UI format
  //         const transformedData: UserData =
  //         {
  //           name: `${profile.firstName} ${profile.lastName}`,
  //           firstName: profile.firstName,
  //           lastName: profile.lastName,
  //           email: profile.email,
  //           isEmailVerfied: profile.isEmailVerified,
  //           avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
  //           coverPhoto: 'https://images.unsplash.com/photo-1621336337173-9a4c3908a25d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  //           stats:
  //           {
  //             totalCatches: profile.totalCatches,
  //             personalBest: 'No catches yet',
  //             memberSince: new Date(profile.createdAt).toLocaleDateString('en-US',
  //               {
  //                 year: 'numeric',
  //                 month: 'long'
  //               })
  //           },
  //           catches: [] // TODO: Fetch user's catches from catches API
  //         };

  //         setUserData(transformedData);
  //       } 
  //       catch (error)
  //       {
  //         console.error('Profile fetch error:', error);

  //         if (error instanceof UserServiceError)
  //         {
  //           // Token expired or invalid
  //           if (error.status === 401)
  //           {
  //             clearAuth();
  //             toast({
  //               title: "Session Expired",
  //               description: "Please log in again to continue",
  //               variant: "destructive",
  //             });
  //             navigate('/login');
  //             return;
  //           }
  //           else if (error.status === 404)
  //           {
  //             toast({
  //               title: "Error Loading Profile",
  //               description: error.message,
  //               variant: "destructive",
  //             });
  //           }
  //           else
  //           {
  //             toast({
  //               title: "Error Loading Profile",
  //               description: error.message,
  //               variant: "destructive",
  //             });
  //           }
  //         }
  //         else 
  //         {
  //           toast({
  //             title: "Network Error",
  //             description: "Unable to load your profile. Please try again.",
  //             variant: "destructive",
  //           });
  //         }

  //         setError(error instanceof Error ? error.message : 'Unknown error occurred');
  //       }
  //       finally
  //       {
  //         setIsLoading(false);
  //       }
  //     };
      
  //     fetchProfile();
  //   }, [navigate]);


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


  // Add separate state for images
  const [profileImages, setProfileImages] = useState({
    coverPhoto: "https://images.unsplash.com/photo-1541742425281-c1d3fc8aff96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&h=400&q=80",
    avatar: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  });
  // Handle cover photo change
  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          setProfileImages(prev => prev ? ({
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
    if (file && userProfile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          setProfileImages(prev => prev ? ({
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
  if (error || !userProfile)
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
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
    <Navigation />
    
    <div className="container mx-auto px-4 py-8">

      {/* Profile Header */}
      <div className="relative mb-8">
        {/* <div className="h-64 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl overflow-hidden"> */}
        <div className="h-64 rounded-xl overflow-hidden">

          <img 
            src={profileImages.coverPhoto}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <input 
            type="file" 
            ref={coverPhotoInputRef}
            onChange={handleCoverPhotoChange}
            className="hidden"
            accept="image/*"
          />
        </div>
        
        <div className="absolute -bottom-16 left-8">
          <div className="relative">
            <img 
              src={profileImages.avatar}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <Button
              variant="outline"
              size="sm"
              className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0"
              onClick={() => profilePictureInputRef.current?.click()}
            >
              <Camera className="w-4 h-4" />
            </Button>
            <input 
              type="file" 
              ref={profilePictureInputRef}
              onChange={handleProfilePictureChange}
              className="hidden"
              accept="image/*"
            />
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="grid lg:grid-cols-3 gap-8 mt-16">

        {/* Left Column - Profile Info */}
        <div>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-slate-800">
                {`${userProfile.firstName} ${userProfile.lastName}`}
              </CardTitle>
              <p className="text-slate-600">{userProfile.email}</p>
              {userProfile.isEmailVerified && (
                <div className="flex items-center text-green-600 text-sm">
                  <Award className="w-4 h-4 mr-1" />
                  Email Verified
                </div>
              )}
            </CardHeader>
          </Card>

          {/* Fishing Stats */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-800">Fishing Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Fish className="w-5 h-5 text-primary mr-3" />
                  <div>
                    <p className="text-sm text-slate-500">Total Catches</p>
                    <p className="font-semibold text-slate-800">{userStats.totalCatches}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Award className="w-5 h-5 text-primary mr-3" />
                  <div>
                    <p className="text-sm text-slate-500">Personal Best</p>
                    <p className="font-semibold text-slate-800">{userStats.personalBest}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-primary mr-3" />
                  <div>
                    <p className="text-sm text-slate-500">Member Since</p>
                    <p className="font-semibold text-slate-800">{userStats.memberSince}</p>
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
                <Fish className="w-6 h-6 mr-2 text-primary" />
                My Catches ({userStats.totalCatches})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {catchesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
                  <span className="text-slate-600">Loading your catches...</span>
                </div>
              ) : userCatches.length === 0 ? (
                <div className="text-center py-12">
                  <Fish className="w-20 h-20 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">No catches yet!</h3>
                  <p className="text-slate-600 mb-4">Start your fishing journey by logging your first catch.</p>
                  <Button 
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => navigate('/add-catch')}
                  >
                    Add Your First Catch
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {userCatches.map((catch_item) => (
                    <div 
                      key={catch_item._id} 
                      className="bg-white border border-orange-100 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                      onClick={() => setSelectedCatch(catch_item)}
                    >
                      {catch_item.imageUrl ? (
                        <img 
                          src={catch_item.imageUrl} 
                          alt={catch_item.catchName}
                          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-40 bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center">
                          <Fish className="w-12 h-12 text-slate-400" />
                        </div>
                      )}
                      
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-slate-800 group-hover:text-primary transition-colors">
                            {catch_item.catchName}
                          </h3>
                          <span className="text-primary font-bold text-lg">
                            {catch_item.catchWeight} lbs
                          </span>
                        </div>
                        
                        <div className="space-y-1 text-sm text-slate-600">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{catch_item.catchLocation}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span>{formatDate(catch_item.caughtAt)}</span>
                          </div>
                          {catch_item.catchLength && (
                            <div className="flex items-center">
                              <Ruler className="w-4 h-4 mr-1 flex-shrink-0" />
                              <span>{catch_item.catchLength}" long</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    {/* Catch Detail Modal */}
    {selectedCatch && (
      <Dialog open={!!selectedCatch} onOpenChange={() => setSelectedCatch(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-800">
              {selectedCatch.catchName}
            </DialogTitle>
            <DialogClose className="absolute right-4 top-4">
              <X className="h-4 w-4" />
            </DialogClose>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedCatch.imageUrl && (
              <img 
                src={selectedCatch.imageUrl} 
                alt={selectedCatch.catchName}
                className="w-full max-h-80 object-cover rounded-lg"
              />
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600">Weight</p>
                <p className="text-2xl font-bold text-primary">{selectedCatch.catchWeight} lbs</p>
              </div>
              {selectedCatch.catchLength && (
                <div className="bg-teal-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-600">Length</p>
                  <p className="text-2xl font-bold text-teal-600">{selectedCatch.catchLength}"</p>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-slate-600">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{selectedCatch.catchLocation}</span>
              </div>
              <div className="flex items-center text-slate-600">
                <Calendar className="w-5 h-5 mr-2" />
                <span>{formatDate(selectedCatch.caughtAt)}</span>
              </div>
            </div>
            
            {selectedCatch.catchComment && (
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600 mb-1">Notes</p>
                <p className="text-slate-800 italic">"{selectedCatch.catchComment}"</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    )}
  </div>
);
}


export default Profile; 