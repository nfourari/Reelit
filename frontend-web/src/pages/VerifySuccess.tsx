import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, LogIn, ArrowLeft, TreePalm } from 'lucide-react';

const VerifySuccess = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link 
          to="/" 
          className="inline-flex items-center text-slate-600 hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <Card className="shadow-xl border-green-100">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <TreePalm className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Shuzzy+
              </span>
            </div>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-slate-800">Email Verified Successfully!</CardTitle>
            <p className="text-slate-600 mt-2">Your email has been verified and your account is now active.</p>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <p className="text-green-800 text-sm">
                  You can now access all features of Shuzzy+. Sign in to your account to start your fishing adventure!
                </p>
              </div>
              
              <Button 
                onClick={handleLoginRedirect}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In to Your Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifySuccess; 