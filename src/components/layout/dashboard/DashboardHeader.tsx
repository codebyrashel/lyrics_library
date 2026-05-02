'use client';

import { Bell, User, LogOut } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { useAuth } from '@/contexts/AuthContext';

export const DashboardHeader = () => {
  const colors = getColors();
  const { user, logout } = useAuth();
  
  const userName = user?.name || 'User';
  const userInitial = userName.charAt(0).toUpperCase();
  
  const handleLogout = async () => {
    await logout();
    // The AuthContext will handle clearing state
    // The protected route will redirect to login
  };
  
  return (
    <header 
      className="h-16 flex items-center justify-between px-4 sm:px-6 border-b ml-12 lg:ml-0"
      style={{ 
        backgroundColor: colors.background,
        borderColor: `${colors.text.muted}20`
      }}
    >
      <div>
        <h2 className="text-base sm:text-xl font-semibold truncate" style={{ color: colors.text.primary }}>
          Welcome back, {userName}
        </h2>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications */}
        <button 
          className="p-2 rounded-lg transition-all hover:scale-105"
          style={{ color: colors.text.secondary }}
        >
          <Bell size={18} className="sm:w-5 sm:h-5" />
        </button>
        
        {/* User Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white text-sm"
            style={{ backgroundColor: colors.primary }}
          >
            {userInitial}
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 rounded-lg transition-all hover:scale-105"
            style={{ color: colors.text.secondary }}
          >
            <LogOut size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};