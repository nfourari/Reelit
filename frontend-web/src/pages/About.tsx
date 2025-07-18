import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TreePalm, Map, Fish, Sun, ArrowLeft } from 'lucide-react';
import Navigation from '@/components/Navigation';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-cyan-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold text-slate-800 mb-6">About Shuzzy+</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-xl text-slate-600 mb-8">
            Shuzzy+ is Orlando's premier fishing companion app, designed to help anglers discover and track their fishing experiences across Central Florida's abundant waterways.
          </p>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mr-4">
                  <TreePalm className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Our Mission</h2>
              </div>
              <p className="text-slate-600">
                Our mission is to connect Florida anglers with the best fishing spots while promoting sustainable fishing practices and conservation of our precious aquatic ecosystems. We believe that by providing anglers with detailed information and tracking tools, we can help preserve Florida's fishing heritage for generations to come.
              </p>
            </CardContent>
          </Card>
          
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Key Features</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-3">
                  <Map className="w-5 h-5 text-primary mr-2" />
                  <h3 className="text-lg font-semibold text-slate-800">Interactive Fishing Map</h3>
                </div>
                <p className="text-slate-600">
                  Explore Orlando and Central Florida's best fishing spots with our detailed interactive map. Find boat ramps, shore access, and local hotspots.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-3">
                  <Fish className="w-5 h-5 text-primary mr-2" />
                  <h3 className="text-lg font-semibold text-slate-800">Catch Logging</h3>
                </div>
                <p className="text-slate-600">
                  Record your catches with details like species, weight, length, bait used, and photos. Build your personal fishing journal.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-3">
                  <Sun className="w-5 h-5 text-primary mr-2" />
                  <h3 className="text-lg font-semibold text-slate-800">Weather & Conditions</h3>
                </div>
                <p className="text-slate-600">
                  Get real-time weather updates and optimal fishing times for Florida waters based on conditions.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-3">
                  <Fish className="w-5 h-5 text-primary mr-2" />
                  <h3 className="text-lg font-semibold text-slate-800">Catch Statistics</h3>
                </div>
                <p className="text-slate-600">
                  Track your personal fishing statistics, analyze patterns, and improve your success rates over time.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Story</h2>
          <p className="text-slate-600 mb-4">
            Shuzzy+ was born from a passion for fishing in Central Florida's diverse waterways. What started as a simple tool to track personal fishing spots around Orlando has grown into a comprehensive platform for serious Florida anglers.
          </p>
          <p className="text-slate-600 mb-8">
            Our team consists of dedicated anglers and software developers who understand the unique needs of Florida fishing enthusiasts. We're constantly improving our app based on user feedback and the latest fishing trends in the Sunshine State.
          </p>
          
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Conservation Commitment</h2>
            <p className="text-slate-600">
              At Shuzzy+, we're committed to promoting sustainable fishing practices. We provide educational resources about catch-and-release techniques, size limits, and the importance of preserving Florida's aquatic habitats.
            </p>
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Start Your Fishing Journal</h2>
            <p className="text-slate-600 mb-6">
              Ready to discover the best fishing spots in Orlando and beyond?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                  Create an Account
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline">
                  Log In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <TreePalm className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold">Shuzzy+</span>
            </div>
            <p className="text-slate-400 mb-6 max-w-lg">
              Orlando's premier fishing app for discovering Central Florida's best spots.
            </p>
            
            <div className="flex items-center space-x-6 mb-8">
              <Link to="/about" className="text-slate-400 hover:text-white transition-colors font-medium">About</Link>
              <span className="text-slate-600">•</span>
              <a href="https://github.com/mkultratech/Shuzzy2.0" className="text-slate-400 hover:text-white transition-colors font-medium" target="_blank">GitHub</a>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-2 pt-6 text-center text-slate-400 text-sm">
            <p>&copy; 2025 Shuzzy+. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About; 