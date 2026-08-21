import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from './Button';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
      <Link to="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
        <Activity className="w-8 h-8 text-[#00E5FF]" />
        <span className="text-xl font-bold tracking-tight">FitVision</span>
      </Link>
      
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <Link to="/profile" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
              <User className="w-5 h-5" />
              <span className="font-medium">{user?.first_name || 'Profile'}</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-red-500/20 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-300 hover:text-white font-medium transition-colors">
              Sign In
            </Link>
            <Link to="/register">
              <Button variant="primary" className="!py-2 !px-5 text-sm">
                Get Started
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};
