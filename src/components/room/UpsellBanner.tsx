'use client';

import { Sparkles, X } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface UpsellBannerProps {
  roomId: string;
  type: 'watch' | 'limit';
  onClose: () => void;
}

export const UpsellBanner = ({ roomId, type, onClose }: UpsellBannerProps) => {
  const router = useRouter();
  const colors = getColors();

  useEffect(() => {
    console.log('[UpsellBanner] Component mounted/rendered');
    console.log('[UpsellBanner] Props:', { roomId, type });
    console.log('[UpsellBanner] Colors available:', !!colors);
    
    // Log the element after render
    const timer = setTimeout(() => {
      const bannerElement = document.querySelector('[data-upsell-banner]');
      console.log('[UpsellBanner] Banner element in DOM:', bannerElement);
      if (bannerElement) {
        const styles = window.getComputedStyle(bannerElement);
        console.log('[UpsellBanner] Banner styles:', {
          position: styles.position,
          bottom: styles.bottom,
          right: styles.right,
          zIndex: styles.zIndex,
          display: styles.display,
          visibility: styles.visibility,
          opacity: styles.opacity,
        });
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSignUp = () => {
    console.log('[UpsellBanner] Sign up clicked');
    localStorage.setItem('redirect_after_auth', `/guest-room/${roomId}`);
    router.push('/register');
  };

  const handleClose = () => {
    console.log('[UpsellBanner] Close clicked');
    onClose();
  };

  const messages = {
    watch: {
      title: 'Loving the watch party?',
      description: 'Create a free account to save this room, get notified when friends join, and unlock more features.',
      buttonText: 'Sign Up Free',
    },
    limit: {
      title: 'You\'ve reached the free limit',
      description: 'Create a free account to create more rooms and unlock unlimited viewing.',
      buttonText: 'Create Free Account',
    },
  };

  const msg = messages[type];

  console.log('[UpsellBanner] Rendering with message:', msg.title);

  return (
    <div 
      data-upsell-banner
      className="fixed bottom-6 right-6 z-9999 max-w-md rounded-xl shadow-2xl"
      style={{ 
        backgroundColor: colors.surface,
        border: `2px solid ${colors.primary}`,
        boxShadow: `0 10px 40px -5px ${colors.primary}40`
      }}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <div 
              className="p-1.5 rounded-full"
              style={{ backgroundColor: `${colors.primary}15` }}
            >
              <Sparkles size={16} style={{ color: colors.primary }} />
            </div>
            <h3 className="font-semibold text-base" style={{ color: colors.text.primary }}>
              {msg.title}
            </h3>
          </div>
          {type === 'watch' && (
            <button 
              onClick={handleClose} 
              className="p-1 rounded transition-colors"
              style={{ color: colors.text.muted }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${colors.text.muted}10`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
        
        <p className="text-sm mb-5" style={{ color: colors.text.secondary }}>
          {msg.description}
        </p>
        
        <div className="flex gap-3">
          <Button variant="primary" onClick={handleSignUp} className="flex-1">
            {msg.buttonText}
          </Button>
          {type === 'watch' && (
            <Button variant="outline" onClick={handleClose}>
              Later
            </Button>
          )}
        </div>
        
        <p className="text-xs mt-3 text-center" style={{ color: colors.text.muted }}>
          No credit card required • Free forever
        </p>
      </div>
    </div>
  );
};