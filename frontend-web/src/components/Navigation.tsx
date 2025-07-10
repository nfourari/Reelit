import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Map, 
  Home, 
  Plus, 
  Users, 
  User, 
  LogOut, 
  Bell, 
  TreePalm 
} from 'lucide-react';

const Navigation = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Implement logout functionality here
    navigate('/');
  };

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Link to="/">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <TreePalm className="w-5 h-5 text-white" />
              </div>
            </Link>
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Shuzzy+
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="ghost" className="text-slate-600 hover:text-primary">
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link to="/map-explorer">
              <Button variant="ghost" className="text-slate-600 hover:text-primary">
                <Map className="w-4 h-4 mr-2" />
                Map Explorer
              </Button>
            </Link>
            <Link to="/add-catch">
              <Button variant="ghost" className="text-slate-600 hover:text-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Catch
              </Button>
            </Link>
            <Link to="/social-feed">
              <Button variant="ghost" className="text-slate-600 hover:text-primary">
                <Users className="w-4 h-4 mr-2" />
                Social Feed
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="ghost" className="text-slate-600 hover:text-primary">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </Link>
            <Link to="/notifications">
              <Button variant="ghost" className="text-slate-600 hover:text-primary relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              className="text-slate-600 hover:text-primary"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" className="text-slate-600">
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      <div className="hidden md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-primary hover:bg-orange-50">
            Dashboard
          </Link>
          <Link to="/map-explorer" className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-primary hover:bg-orange-50">
            Map Explorer
          </Link>
          <Link to="/add-catch" className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-primary hover:bg-orange-50">
            Add Catch
          </Link>
          <Link to="/social-feed" className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-primary hover:bg-orange-50">
            Social Feed
          </Link>
          <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-primary hover:bg-orange-50">
            Profile
          </Link>
          <Link to="/notifications" className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-primary hover:bg-orange-50">
            Notifications
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-primary hover:bg-orange-50"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 