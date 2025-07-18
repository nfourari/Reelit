import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Map, 
  Home, 
  Plus, 
  User, 
  LogOut, 
  TreePalm,
  Menu,
  X
} from 'lucide-react';

const Navigation = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    // Implement logout functionality here
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <div className="flex-shrink-0 flex items-center space-x-2">
            <Link to="/">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <TreePalm className="w-5 h-5 text-white" />
              </div>
            </Link>
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Shuzzy+
            </Link>
          </div>
          
          <div className="hidden md:flex flex-1 justify-center items-center space-x-6">
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
            <Link to="/profile">
              <Button variant="ghost" className="text-slate-600 hover:text-primary">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center ml-auto">
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
          <div className="md:hidden ml-auto flex items-center">
            <Button 
              variant="ghost" 
              className="text-slate-600"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-b border-orange-100 shadow-sm">
          <Link 
            to="/dashboard" 
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-primary hover:bg-orange-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex items-center">
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </div>
          </Link>
          <Link 
            to="/map-explorer" 
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-primary hover:bg-orange-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex items-center">
              <Map className="w-4 h-4 mr-2" />
              Map Explorer
            </div>
          </Link>
          <Link 
            to="/add-catch" 
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-primary hover:bg-orange-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add Catch
            </div>
          </Link>
          <Link 
            to="/profile" 
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-primary hover:bg-orange-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              Profile
            </div>
          </Link>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleLogout();
            }}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-primary hover:bg-orange-50"
          >
            <div className="flex items-center">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 