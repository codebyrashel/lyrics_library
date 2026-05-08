'use client';

import { LogIn, UserPlus } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface NavbarAuthProps {
  isMobile?: boolean;
  onClick?: () => void;
}

export const NavbarAuth = ({ isMobile = false, onClick }: NavbarAuthProps) => {
  const colors = getColors();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  const handleSignIn = () => {
    if (onClick) onClick();
    router.push('/login');
  };

  const handleSignUp = () => {
    if (onClick) onClick();
    router.push('/register');
  };
  
  if (isAuthenticated) {
    return (
      <div className={isMobile ? 'px-4 py-3' : ''}>
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 rounded-lg px-4 py-2 transition-colors"
          style={{ 
            backgroundColor: colors.primary,
            color: 'white'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `${colors.primary}dd`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.primary;
          }}
        >
          <span>Dashboard</span>
        </button>
      </div>
    );
  }
  
  return (
    <div className={`flex ${isMobile ? 'flex-col gap-2 px-4' : 'gap-2'}`}>
      {/* Sign In Button */}
      <button
        onClick={handleSignIn}
        className="flex items-center justify-center gap-2 rounded-lg px-4 py-2 transition-colors"
        style={{ 
          color: colors.primary,
          border: `1px solid ${colors.primary}`,
          backgroundColor: 'transparent'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = `${colors.primary}10`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <LogIn size={18} />
        <span>Sign In</span>
      </button>
      
      {/* Sign Up Button */}
      <button
        onClick={handleSignUp}
        className="flex items-center justify-center gap-2 rounded-lg px-4 py-2 transition-colors"
        style={{ 
          backgroundColor: colors.primary,
          color: 'white'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = `${colors.primary}dd`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = colors.primary;
        }}
      >
        <UserPlus size={18} />
        <span>Sign Up</span>
      </button>
    </div>
  );
};