'use client';

import { LogIn, UserPlus } from 'lucide-react';
import { getColors } from '@/store/colorStore';

interface NavbarAuthProps {
  isMobile?: boolean;
  onClick?: () => void;
}

export const NavbarAuth = ({ isMobile = false, onClick }: NavbarAuthProps) => {
  const colors = getColors();
  
  // TODO: Implement actual auth later with Redux Toolkit
  const isAuthenticated = false; // Placeholder for auth state
  
  if (isAuthenticated) {
    return (
      <div className={isMobile ? 'px-4 py-3' : ''}>
        <button
          className="flex items-center gap-2 rounded-lg px-4 py-2 transition-all hover:scale-105"
          style={{ 
            backgroundColor: colors.primary,
            color: 'white'
          }}
        >
          <span>Profile</span>
        </button>
      </div>
    );
  }
  
  return (
    <div className={`flex ${isMobile ? 'flex-col gap-2 px-4' : 'gap-2'}`}>
      {/* Sign In Button - Placeholder */}
      <button
        onClick={onClick}
        className="flex items-center justify-center gap-2 rounded-lg px-4 py-2 transition-all hover:scale-105"
        style={{ 
          color: colors.primary,
          border: `1px solid ${colors.primary}`,
          backgroundColor: 'transparent'
        }}
      >
        <LogIn size={18} />
        <span>Sign In</span>
      </button>
      
      {/* Sign Up Button - Placeholder */}
      <button
        onClick={onClick}
        className="flex items-center justify-center gap-2 rounded-lg px-4 py-2 transition-all hover:scale-105"
        style={{ 
          backgroundColor: colors.primary,
          color: 'white'
        }}
      >
        <UserPlus size={18} />
        <span>Sign Up</span>
      </button>
    </div>
  );
};