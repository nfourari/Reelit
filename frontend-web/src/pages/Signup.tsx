
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, ArrowLeft, TreePalm, X, CheckCircle, Mail } from 'lucide-react';
import { authApi, handleApiError } from '@/services/apiService';
import { toast } from '@/hooks/use-toast';

const Signup = () => 
{
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessState, setShowSuccessState] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [showNotificationBox, setShowNotificationBox] = useState(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try 
    {
      await authApi.signup(
      {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });

      // Store email for success state
      setUserEmail(formData.email);

      // Show both the regular toast AND the persistent notication box (MIGHT CHANGE)
      toast({
        title: "🎉 Account Created Successfully!",
        description: `Verification email sent to ${formData.email}. 
                      Please check your inbox and spam folder.`,
        className: "border-green-200 bg-green-50 text-green-800",
        duration: 8000, // 8 seconds
      });

      // Show persistent notification box
      setShowNotificationBox(true);

        // Form clears but stays on page
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
    } 
    catch (error) 
    {
      console.error('Signup error:', error);
      toast({
        title: "Signup failed",
        description: handleApiError(error),
        variant: "destructive",
      });
    } 
    finally 
    {
      setIsLoading(false);
    }
  };


  const handleDismissNotification = () =>
  {
    setShowNotificationBox(false);
  };


  const handleProceedToLogin = () => 
  {
    setShowNotificationBox(false);
    navigate('/login');
  } ;


  // Success state UI - persistent until user acknowledges
  if (showSuccessState) 
  {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-green-200 bg-green-50">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-green-800">Account Created!</CardTitle>
              <p className="text-green-700 mt-2">Welcome to Shuzzy+</p>
            </CardHeader>
            
            <CardContent className="space-y-6">

              {/* Email verification notice */}
              <div className="bg-white border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Mail className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-800 mb-2">Check Your Email</h3>
                    <p className="text-green-700 text-sm mb-3">
                      We've sent a verification link to:
                    </p>
                    <div className="bg-green-100 rounded px-3 py-2 mb-3">
                      <p className="font-medium text-green-800 text-sm break-all">{userEmail}</p>
                    </div>
                    <p className="text-green-600 text-xs">
                      Click the link in the email to activate your account. Don't forget to check your spam folder!
                    </p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={handleProceedToLogin}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  Continue to Login
                </Button>
              </div>

              {/* Help text */}
              <div className="text-center">
                <p className="text-green-600 text-xs">
                  Having trouble? Check your spam folder.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }


  // Regular sign up form
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md relative">

        {/* Persistent Email Verification Notification Box */}
        {showNotificationBox && (
          <div className="mb-6 relative">
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 shadow-lg animate-in slide-in-from-top-2 duration-300">
              
              {/* Dismiss button */}
              <button
                onClick={handleDismissNotification}
                className="absolute top-2 right-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full p-1 transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex items-start space-x-3 pr-6">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-green-800 font-semibold text-sm mb-1">
                    🎉 Account Created Successfully!
                  </h3>
                  <div className="text-green-700 text-sm space-y-2">
                    <p>
                      We've sent a verification email to:
                    </p>
                    <div className="bg-white border border-green-200 rounded px-2 py-1">
                      <code className="text-green-800 text-xs font-medium break-all">
                        {userEmail}
                      </code>
                    </div>
                    <p className="text-xs">
                      <strong>Next steps:</strong> Check your inbox (and spam folder) and click the verification link to activate your account.
                    </p>
                  </div>
                  
                  {/* Action buttons in notification */}
                  <div className="flex flex-col sm:flex-row gap-2 mt-3">
                    <Button
                      onClick={handleProceedToLogin}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-xs"
                    >
                      Go to Login
                    </Button>
                   
                  </div>
                </div>
              </div>
            </div>
            
            {/* Subtle pointer/arrow pointing down to the form */}
            <div className="flex justify-center mt-2">
              <div className="text-green-600 text-xs">
                ↓ You can create another account below or dismiss this notice
              </div>
            </div>
          </div>
        )}
        
        <Link 
          to="/" 
          className="inline-flex items-center text-slate-600 hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <Card className="shadow-xl border-orange-100">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <TreePalm className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Shuzzy+
              </span>
            </div>
            <CardTitle className="text-2xl text-slate-800">Join Shuzzy+</CardTitle>
            <p className="text-slate-600">Create your Orlando fishing account</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="border-orange-200 focus:border-accent"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="border-orange-200 focus:border-accent"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="border-orange-200 focus:border-accent"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Choose a strong password (min. 6 characters)"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="border-orange-200 focus:border-accent"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="border-orange-200 focus:border-accent"
                  disabled={isLoading}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <UserPlus className="w-4 h-4 mr-2" />
                )}
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-slate-600">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:text-primary/80 font-semibold">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;