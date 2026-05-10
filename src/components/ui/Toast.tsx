'use client';

import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { getColors } from '@/store/colorStore';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

export const Toast = ({ message, type = 'success', onClose, duration = 3000 }: ToastProps) => {
  const colors = getColors();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow animation to finish
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={18} style={{ color: colors.status.success }} />;
      case 'error':
        return <AlertCircle size={18} style={{ color: colors.status.error }} />;
      default:
        return <Info size={18} style={{ color: colors.primary }} />;
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed bottom-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-right duration-300"
      style={{ 
        backgroundColor: colors.surface,
        border: `1px solid ${type === 'success' ? colors.status.success : type === 'error' ? colors.status.error : colors.primary}30`,
      }}
    >
      {getIcon()}
      <span className="text-sm" style={{ color: colors.text.primary }}>
        {message}
      </span>
      <button onClick={() => setIsVisible(false)} className="ml-2 p-0.5 hover:opacity-70 transition-opacity">
        <X size={14} style={{ color: colors.text.muted }} />
      </button>
    </div>
  );
};