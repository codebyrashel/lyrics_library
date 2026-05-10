'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { useToast } from '@/contexts/ToastContext';

interface ShareButtonProps {
  roomId: string;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const ShareButton = ({ roomId, variant = 'outline', size = 'md' }: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);
  const colors = getColors();
  const { showToast } = useToast();

  const getShareUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/room/${roomId}`;
  };

  const handleShare = async () => {
    const url = getShareUrl();
    
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      showToast('Link copied! Share this link with friends to join', 'success');
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      showToast('Link copied! Share this link with friends to join', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primary,
          color: 'white',
          border: 'none',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: colors.text.secondary,
          border: 'none',
        };
      default:
        return {
          backgroundColor: 'transparent',
          color: colors.primary,
          border: `1px solid ${colors.primary}`,
        };
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`flex items-center gap-2 rounded-lg transition-all hover:scale-105 ${sizeClasses[size]}`}
      style={getVariantStyles()}
      title="Copy room link to clipboard"
    >
      {copied ? <Check size={size === 'sm' ? 14 : 16} /> : <Share2 size={size === 'sm' ? 14 : 16} />}
      <span>{copied ? 'Copied!' : 'Share'}</span>
    </button>
  );
};