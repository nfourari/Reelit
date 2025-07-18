import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Map, LogIn, User, Plus, TreePalm, Sun, Fish } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-cyan-50">
      {/* Navigation */}
      <nav className="relative z-10 bg-white/90 backdrop-blur-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <TreePalm className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Shuzzy+
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button 
                  variant="ghost" 
                  className="text-slate-600 hover:text-primary"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Log In
                </Button>
              </Link>
              <Link to="/signup">
                <Button 
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-orange-900/40 via-pink-800/30 to-cyan-900/50"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Find Your Next
            <span className="block bg-gradient-to-r from-orange-200 to-cyan-200 bg-clip-text text-transparent">
              Florida Trophy
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-orange-100 animate-fade-in animation-delay-200">
            Discover Orlando's best fishing spots, from Lake Apopka to the Butler Chain of Lakes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animation-delay-400">
            <Link to="/login">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-lg px-8 py-4">
                <Map className="w-5 h-5 mr-2" />
                Explore Florida Spots
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 text-lg px-8 py-4">
                <TreePalm className="w-5 h-5 mr-2" />
                Start Tracking Catches
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Everything You Need to Fish Florida Waters
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              From Orlando's hidden gems to Central Florida lakes, discover the best fishing with expert data
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-orange-100">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Map className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Florida Fishing Spots</h3>
                <p className="text-slate-600 leading-relaxed">
                  Discover Orlando lakes, Kissimmee Chain, and secret Florida spots with GPS coordinates and expert tips.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-cyan-100">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Fish className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Log Your Bass & Snook</h3>
                <p className="text-slate-600 leading-relaxed">
                  Track your Florida catches - from largemouth bass to snook, tarpon to redfish. Build your trophy log.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-orange-100">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Sun className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Florida Weather Data</h3>
                <p className="text-slate-600 leading-relaxed">
                  Get Orlando weather updates and the best fishing times for Florida waters based on conditions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Personal Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-50 to-cyan-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Track Your Florida Catches
            </h2>
            <p className="text-xl text-slate-600">
              Record and analyze your personal fishing statistics
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { angler: "Michael R.", fish: "Largemouth Bass", weight: "8.2 lbs", location: "Lake Tohopekaliga" },
              { angler: "Sarah J.", fish: "Snook", weight: "12.5 lbs", location: "Mosquito Lagoon" },
              { angler: "David T.", fish: "Redfish", weight: "6.8 lbs", location: "Indian River" }
            ].map((catch_, index) => (
              <Card key={index} className="bg-white hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold text-slate-800">{catch_.angler}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Species:</span>
                      <span className="font-semibold text-slate-800">{catch_.fish}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Weight:</span>
                      <span className="font-semibold text-primary">{catch_.weight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Location:</span>
                      <span className="font-semibold text-slate-800">{catch_.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Explore Florida Waters?
          </h2>
          <p className="text-xl mb-8 text-orange-100">
            Start tracking your catches and discover Central Florida's hidden gems
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-white text-primary hover:bg-orange-50 text-lg px-8 py-4">
                <TreePalm className="w-5 h-5 mr-2" />
                Start Fishing Florida
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 text-lg px-8 py-4">
                <Sun className="w-5 h-5 mr-2" />
                Explore Orlando Spots
              </Button>
            </Link>
          </div>
        </div>
      </section>

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

export default Index;
